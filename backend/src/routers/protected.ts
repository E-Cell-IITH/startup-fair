import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { User, UserSchema, UserType } from "../entity/User.js";
import { AppDataSource } from "../data-source.js";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { Startup } from "../entity/Startup.js";
import { Equity } from "../entity/Investment.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { GlobalStats, Mutex, MutexManager } from "./lib.js";
import * as bcrypt from 'bcrypt';
import addAdminRoutes from "./admin.js";

var investment_valuation_increment = Number.parseInt(process.env.PER_INVESTMENT_VALUATION_INCREMENT as string)
var investment_amount = Number.parseInt(process.env.PER_INVESTMENT_AMOUNT as string)

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.cookies || !request.cookies.auth_token) {
        reply.redirect('/login');
        return reply;
    }
    await request.jwtVerify({onlyCookie: true});
}

const requireAuth_404 = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.cookies || !request.cookies.auth_token) {
        reply.code(404)
        reply.send("");
        return reply;
    }
    await request.jwtVerify({onlyCookie: true});
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
        }
    }, async function (request, reply) {
        const { email, password } = request.body as { email: string, password: string };

        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {email}});

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

        const token = fastify.jwt.sign({id: user.id, name: user.name, isAdmin: user.isAdmin});
        reply.setCookie('auth_token', token, {
            sameSite: 'lax', //TODO: Change
            httpOnly: true,
            secure: false, //process.env.NODE_ENV === 'production',
        });
        reply.code(200);
        return user as unknown as UserType;
    });

    fastify.post('/logout', function (request, reply) {
        reply.setCookie('auth_token', '', {expires: new Date(0)});
        reply.redirect('/login');
    })

    fastify.post('/me', {preHandler:requireAuth_404} , async function (request, reply) {
        reply.code(200);
        return { user: request.user };
    })

    fastify.route({
        url: '/pay',
        method: 'POST',
        schema: {
            body: Type.Object({
                startup_id: Type.Number()
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
                return {message: 'Payment successful'};

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