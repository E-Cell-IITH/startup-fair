import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { User, UserSchema, UserType } from "../entity/User.js";
import { AppDataSource } from "../data-source.js";
import { Startup, StartupSchema, StartupType } from "../entity/Startup.js";
import * as bcrypt from 'bcrypt';

const requireAdmin = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.cookies || !request.cookies.auth_token) {
        reply.redirect('/login');
        return reply;
    }
    
    await request.jwtVerify({onlyCookie: true});
    
    if (!request.user.isAdmin) {
        reply.redirect('/login');
        return reply;
    }
}

const addAdminRoutes: FastifyPluginAsyncTypebox = async function addAdminRoutes(fastify, opts) {
    
    fastify.route({
        url: '/block',
        method: 'POST',
        schema: {
            body: Type.Object({
                email: Type.String()
            }),
            response: {
                200: Type.String(),
                400: Type.String()
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const { email } = request.body;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({where: {email}});
            
            if (!user) {
                reply.code(400);
                return 'User not found';
            }

            if (user.id == request.user.id) {
                reply.code(400);
                return 'Cannot block yourself';
            }

            if (user.isBlocked) {
                reply.code(400);
                return 'User is already blocked';
            }

            user.isBlocked = true;
            await userRepository.save(user);
            reply.code(200);
            return 'User blocked';
        }
    })

    fastify.route({
        url: '/unblock',
        method: 'POST',
        schema: {
            body: Type.Object({
                email: Type.String()
            }),
            response: {
                200: Type.String(),
                400: Type.String()
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const { email } = request.body;
            const userRepository = AppDataSource.getRepository(User);
            const user = await userRepository.findOne({where: {email}});

            if (!user) {
                reply.code(400);
                return 'User not found';
            }

            if (!user.isBlocked) {
                reply.code(400);
                return 'User is not blocked';
            }

            user.isBlocked = false;
            await userRepository.save(user);
            reply.code(200);
            return 'User Unblocked';
        }
    })

    fastify.route({
        url: '/user',
        method: 'GET',
        schema: {
            querystring: Type.Object({
                search: Type.String({default: ''})
            }),
            response: {
                200: Type.Array(UserSchema)
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const userRepository = AppDataSource.getRepository(User);
            const users = await userRepository.createQueryBuilder()
                .where('name LIKE :search OR email LIKE :search', {search: `%${request.query.search}%`})
                .orderBy('name', 'ASC')
                .limit(25)
                .getMany();

            reply.code(200);
            return users as unknown as UserType[];
        }
    })

    fastify.route({
        url: '/startup',
        method: 'GET',
        schema: {
            response: {
                200: Type.Array(StartupSchema)
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const startupRepository = AppDataSource.getRepository(Startup);
            const startups = await startupRepository.find({select: ['id', 'icon', 'name', 'valuation']});

            reply.code(200);
            return startups as unknown as StartupType[];
        }
    })

    fastify.route({
        url: '/user',
        method: 'POST',
        schema: {
            body: Type.Object({
                name: Type.String(),
                email: Type.String(),
                password: Type.String(),
                balance: Type.Number()
            }),
            response: {
                400: Type.String()
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const { name, email, password, balance } = request.body;

            const userRepository = AppDataSource.getRepository(User);
            const user = userRepository.create({
                name,
                email,
                password,
                balance
            });
            user.password = bcrypt.hashSync(user.password, 10);
            
            try {
                await userRepository.save(user);
            } catch (e) {
                reply.code(400);
                return (e as Error).message;
            }

            reply.code(200);
            return;
        }
    });

    fastify.route({
        url: '/startup',
        method: 'POST',
        schema: {
            body: Type.Object({
                name: Type.String(),
                icon: Type.String(),
                valuation: Type.Number()
            }),
            response: {
                200: StartupSchema,
                400: Type.String()
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const { name, icon, valuation } = request.body;

            const startupRepository = AppDataSource.getRepository(Startup);
            const startup = startupRepository.create({
                name,
                icon,
                valuation
            });
            
            try {
                await startupRepository.save(startup);
            } catch (e) {
                reply.code(400);
                return (e as Error).message;
            }

            reply.code(200);
            return startup;
        }
    })

    fastify.route({
        url: '/startup/:id',
        method: 'PUT',
        schema: {
            params: Type.Object({
                id: Type.Number()
            }),
            body: Type.Object({
                name: Type.String(),
                icon: Type.String(),
                valuation: Type.Number()
            }),
            response: {
                200: StartupSchema,
                400: Type.String()
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            const { id } = request.params;
            const { name, icon, valuation } = request.body;

            const startupRepository = AppDataSource.getRepository(Startup);
            const startup = await startupRepository.findOne({where: {id}});

            if (!startup) {
                reply.code(400);
                return 'Startup not found';
            }

            try {
                await startupRepository.save({
                    id,
                    name,
                    icon,
                    valuation
                });
            } catch (e) {
                reply.code(400);
                return (e as Error).message;
            }

            reply.code(200);
            return startup;
        }
    })

    fastify.route({
        url: '/stats',
        method: 'GET',
        schema: {
            response: {
                200: Type.Object({
                    users: Type.Number(),
                    payments: Type.Number(),
                    recent_payments: Type.Number(),
                    average_response_time: Type.Number(),
                    max_response_time: Type.Number(),
                })
            }
        },
        preHandler: requireAdmin,
        handler: async function (request, reply) {
            reply.code(200)
            return {
                users: 1000,
                payments: 200,
                recent_payments: 20,
                average_response_time: Math.round((Math.random() * 250)),
                max_response_time: 200
            }
        }
    })
}

export default addAdminRoutes;