import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { ExtendedUserSchema, ExtendedUserType, User, UserSchema, UserType } from "../entity/User.js";
import { AppDataSource } from "../data-source.js";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { Startup } from "../entity/Startup.js";
import { Equity } from "../entity/Investment.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { GlobalStats, leaderboardCache, Mutex, MutexManager } from "./lib.js";
import * as bcrypt from 'bcrypt';
import addAdminRoutes from "./admin.js";
import { logRequest } from "../logging.js";
import { generateVerificationToken, sendVerificationEmail } from "./mail.js";

var investment_valuation_increment = Number.parseInt(process.env.PER_INVESTMENT_VALUATION_INCREMENT as string)
var investment_amount = Number.parseInt(process.env.PER_INVESTMENT_AMOUNT as string)

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.cookies || !request.cookies.auth_token) {
        reply.code(401);
        return reply;
    }
    await request.jwtVerify({onlyCookie: true}).catch((err) => {
        reply.setCookie('auth_token', '', {expires: new Date(0)});
        reply.code(401);
        return reply;
    });
}

const requireAuth_404 = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.cookies || !request.cookies.auth_token) {
        reply.code(404)
        reply.send("");
        return reply;
    }
    await request.jwtVerify({onlyCookie: true}).catch((err) => {
        reply.setCookie('auth_token', '', {expires: new Date(0)});
        reply.code(404);
        reply.send("");
        return reply;
    });
}

const optionalAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.cookies && request.cookies.auth_token) {
        await request.jwtVerify({onlyCookie: true}).catch((err) => {
            reply.setCookie('auth_token', '', {expires: new Date(0)});
        });   
    }
}

function ValidateEmail(email: string) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; 
    return email.match(validRegex)
}

const addProtectedRoutes: FastifyPluginAsyncTypebox = async function addProtectedRoutes(fastify, opts) {
    
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }

    await fastify.register(fastifyCookie);
    await fastify.register(fastifyJwt, {
        secret: process.env.JWT_SECRET as string,
        cookie: {
            cookieName: 'auth_token',
            signed: false
        },
        
    } as FastifyJWTOptions);

    const pay_mutexes = new MutexManager();

    fastify.route({
        url: '/user',
        method: 'GET',
        schema: {
          querystring: Type.Object({
            from: Type.Number({default: 0, minimum: 0})
          }),
          response: {
            200: Type.Object({
                leaderboard: Type.Array(Type.Pick(UserSchema, ['id', 'name', 'net_worth'])),
                user: Type.Optional(Type.Object({
                    rank: Type.Number(),
                    name: Type.String(),
                    net_worth: Type.Number()
                }))
            }),
          }
        },
        preHandler: optionalAuth,
        handler: async function (request, reply) {
            reply.code(200);
            let user_info = request.user ? leaderboardCache.getInfoById(request.user.id) : undefined; 
                
            return {
                leaderboard: await leaderboardCache.get(request.query.from),
                user: user_info ? {
                    ...(user_info),
                    name: request.user.name,
                } : undefined
            };
        }
    })

    fastify.post('/login', {
        schema: {
            body: Type.Object({
                email: Type.String(),
                password: Type.String()
            }),
            response: {
                200: UserSchema,
                400: Type.Object({
                    error: Type.String()
                }),
                401: Type.Object({
                    error: Type.String()
                })
            }
        },
        onRequest: [logRequest]
    }, async function (request, reply) {
        const { email, password } = request.body as { email: string, password: string };

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.createQueryBuilder()
          .addSelect(['User.password', 'User.verified'])
          .where('User.email = :email', {email})
          .getOne();

        if (!user) {
            reply.code(400);
            return {error: 'User with email does not exist'};
        }

        if (!bcrypt.compareSync(password, user.password)) {
            reply.code(401);
            return {error: 'Incorrect password'};
        }

        if (user.isBlocked) {
            reply.code(401);
            return {error: 'User is blocked'};
        }

        if (!user.verified) {
            reply.code(401);
            return {error: 'User is not verified, Please check your inbox for verification email'};
        }

        const token = fastify.jwt.sign({id: user.id, name: user.name, isAdmin: user.isAdmin});
        reply.setCookie('auth_token', token, {
            sameSite: 'none',
            httpOnly: true,
            secure: true, //process.env.NODE_ENV === 'production',
        });
        reply.code(200);
        return user as unknown as UserType;
    });

    fastify.route({
        url: '/signup',
        method: 'POST',
        schema: {
          body: Type.Object({
            name: Type.String({minLength: 1}),
            password: Type.String({minLength: 1}),
            email: Type.String({minLength: 1})
          }),
          response: {
            201: Type.String(),
            400: {error: Type.String()}
          }
        },
        onRequest: [logRequest],
        handler: async function (request, reply) {

          request.body.email = request.body.email.toLowerCase();
    
          if (!ValidateEmail(request.body.email)) {
            reply.code(400);
            return {error: 'Invalid email address'};
          }

          if (!request.body.email.endsWith('@iith.ac.in')) {
            reply.code(400);
            return {error: 'Only IITH email addresses (domain iith.ac.in) are allowed'};
          }
    
          const usersRepository = AppDataSource.getRepository(User);
    
          let user = new User();
          user.name = request.body.name;
          user.email = request.body.email;
          user.password = bcrypt.hashSync(request.body.password, 10);
          user.verificationToken = generateVerificationToken();
    
          try {
            user = await usersRepository.save(user);
          } catch (err) {
            reply.code(400);
            return {error: 'User with email already exists'};
          }

          await sendVerificationEmail(user.email, user.verificationToken, user.id.toString());
    
          reply.code(201);
          reply.send('');
        }
    })

    fastify.route({
        method: 'POST',
        url: '/verify-email',
        schema: {
          body: Type.Object({
            token: Type.String(),
            id: Type.String()
          }),
          response: {
            200: Type.Object({
              message: Type.String()
            }),
            400: Type.Object({
              error: Type.String()
            })
          }
        },
        onRequest: logRequest,
        handler: async function (request, reply) {
          const token= request.body.token;
          const id= parseInt(request.body.id, 10);

          if (isNaN(id) || !Number.isInteger(id)) {
            reply.code(400);
            return {error: 'Invalid user id'};
          }
    
          const userRepository = AppDataSource.getRepository(User);
          const user = await userRepository.findOne({where: {id, verificationToken: token}, select: ['id', 'verified']});
    
          if (!user) {
            reply.code(400);
            return {error: 'Invalid verification token'};
          }
    
          if (user.verified) {
            reply.code(400);
            return {error: 'Email already verified, please try to log in'};
          }

          await userRepository.update(user.id, {verified: true});
    
          reply.code(200);
          return {message: 'Email verified successfully. You can now log in.'};
        }
    })

    fastify.post('/logout', function (request, reply) {
        reply.setCookie('auth_token', '', {expires: new Date(0)});
        reply.code(200);
    })

    fastify.post('/me', {preHandler:requireAuth_404} , async function (request, reply) {
        reply.code(200);
        return { user: request.user };
    })

    fastify.route({
        url: '/user/portfolio',
        method: 'GET',
        schema: {
          response: {
            200: ExtendedUserSchema,
            404: Type.Object({
              error: Type.String()
            })
          }
        },
        onRequest: logRequest,
        preHandler: requireAuth,
        handler: async function (request, reply) {
            const userRepository = AppDataSource.getRepository(User);
            // const user = await userRepository.findOne({where: {id: request.params.id}, relations: ['investments']});
            const user = await userRepository.createQueryBuilder('user')
              .where('user.id = :id', {id: request.user.id})
              .leftJoin('user.investments', 'investment')
              .leftJoin('investment.startup', 'startup')
              .addSelect([
                'investment.id', 
                'investment.equity', 
                'investment.amount',
                'startup.id',
                'startup.name',
                'startup.valuation', 
                'startup.icon'
              ])
              .getOne();
    
            if (!user) {
              reply.code(404);
              return {error: 'User not found'};
            }
    
            user.net_worth = (await user.investments).reduce((acc, investment) => {
              return acc + investment.equity * investment.startup.valuation;
            }, user.balance);
    
            reply.code(200);
            return user as unknown as ExtendedUserType;
        }
    })

    fastify.route({
        url: '/pay',
        method: 'POST',
        schema: {
            body: Type.Object({
                startup_id: Type.String()
            }),
            response: {
                200: Type.Object({
                    message: Type.String(),
                    new_balance: Type.Number()
                }),
                400: Type.Object({
                    error: Type.String()
                })
            }
        },
        onRequest: logRequest,
        preHandler: requireAuth,
        handler: async function (request, reply) {
            const { startup_id } = request.body;

            const userRepository = AppDataSource.getRepository(User);
            const startupRepository = AppDataSource.getRepository(Startup);
            const investmentRepository = AppDataSource.getRepository(Equity);
            
            let mutex_lock = pay_mutexes.getMutex(startup_id);
            await mutex_lock.acquire();

            try {    
                let [user, startup, investment] = await Promise.all([
                    userRepository.findOne({where: {id: request.user.id}}),
                    startupRepository.findOne({where: {id: startup_id}}),
                    investmentRepository.findOne({where: {user_id: request.user.id, startup_id: startup_id}})
                ]);

                if (!user || user.isBlocked) {
                    if (!startup) pay_mutexes.dropMutex(startup_id);
                    if (user) reply.setCookie('auth_token', '', {expires: new Date(0)});
                    reply.code(400);
                    return {error: 'User not found'};
                }

                if (!startup) {
                    reply.code(400);
                    pay_mutexes.dropMutex(startup_id);
                    return {error: 'Startup not found'};
                }

                if (user.balance < investment_amount) {
                    reply.code(400);
                    return {error: 'Insufficient balance'};
                }

                user.balance -= investment_amount;
                let equity_sold = investment_amount / (startup.valuation + investment_valuation_increment);

                if (!investment) {
                    investment = new Equity();
                    investment.amount = 0;
                    investment.equity = 0;
                }
                investment.user = user;
                investment.startup = startup;
                investment.amount += investment_amount;
                investment.equity += equity_sold
                startup.equity_sold += equity_sold
                startup.valuation += investment_valuation_increment;

                await investmentRepository.save(investment);
                await userRepository.save(user);
                await startupRepository.save(startup);

                GlobalStats.next_recent_payments += 1;
                GlobalStats.payments += 1;
                reply.code(200);
                return {message: 'Payment successful', new_balance: user.balance};

            } catch (err) {
                reply.code(500);
                console.log("Error during payment:", err);
                return {error: 'Payment failed'};

            } finally {
                mutex_lock.release();
            }
        }
    })

    fastify.register(addAdminRoutes, {prefix: '/admin'});
}

export default addProtectedRoutes;