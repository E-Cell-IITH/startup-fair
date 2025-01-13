import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { User, UserSchema, UserType } from "../entity/User";
import { AppDataSource } from "../data-source";
import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { Startup } from "../entity/Startup";
import { Equity } from "../entity/Investment";
import { FastifyReply, FastifyRequest } from "fastify";

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
        return reply;
    }
    await request.jwtVerify({onlyCookie: true});
}

const protectedRoutes: FastifyPluginAsyncTypebox = async function protectedRoutes(fastify, opts) {

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
            
            let [user, startup, investment] = await Promise.all([
                userRepository.findOne({where: {id: request.user.id}}),
                startupRepository.findOne({where: {id: startup_id}}),
                investmentRepository.findOne({where: {userId: request.user.id, startupId: startup_id}})
            ]);

            if (!user) {
                reply.code(400);
                return {error: 'User not found'};
            }

            if (!startup) {
                reply.code(400);
                return {error: 'Startup not found'};
            }

            if (user.balance < investment_amount) {
                reply.code(400);
                return {error: 'Insufficient balance'};
            }

            user.balance -= investment_amount;
            let equity_sold = investment_amount / startup.valuation;

            if (!investment) investment = new Equity();
            investment.user = user;
            investment.startup = startup;
            investment.amount += investment_amount;
            investment.equity += equity_sold
            startup.equity_sold += equity_sold
            startup.valuation += investment_valuation_increment;

            await investmentRepository.save(investment);
            await userRepository.save(user);
            await startupRepository.save(startup);

            reply.code(200);
            return {message: 'Payment successful'};
        }
    })
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

        if (user.password !== password) {
            reply.code(401);
            return {error: 'Incorrect password'};
        }

        const token = fastify.jwt.sign({id: user.id, name: user.name});
        reply.setCookie('auth_token', token, {
            sameSite: 'lax',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        reply.code(200);
        return user as unknown as UserType;
    });

    fastify.get('/logout', function (request, reply) {
        reply.clearCookie('auth_token');
        reply.redirect('/login');
    })

    await fastify.register(protectedRoutes);
}

export default addProtectedRoutes;