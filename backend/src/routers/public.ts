import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { ExtendedUserSchema, ExtendedUserType, User, UserSchema, UserType } from "../entity/User.js";
import { Startup, StartupSchema, StartupType } from "../entity/Startup.js";
import { AppDataSource } from "../data-source.js";
import * as bcrypt from 'bcrypt';
import { leaderboardCache } from "./lib.js";

const plugin: FastifyPluginAsyncTypebox = async function addPublicRoutes(fastify, _opts) {
    
  fastify.route({
    url: '/user',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        from: Type.Number({default: 0, minimum: 0})
      }),
      response: {
        200: Type.Array(Type.Pick(UserSchema, ['id', 'name', 'net_worth'])),
      }
    },
    handler: async function (request, reply) {
      reply.code(200);
      return (await leaderboardCache.get(request.query.from));
    }
  })

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
        200: Type.Partial(UserSchema),
        400: {error: Type.String()}
      }
    },
    handler: async function (request, reply) {

      if (!request.body.email.endsWith('@iith.ac.in')) {
        reply.code(400);
        return {error: 'Only IITH email addresses are allowed'};
      }

      const usersRepository = AppDataSource.getRepository(User);

      let user = new User();
      user.name = request.body.name;
      user.email = request.body.email;
      user.password = bcrypt.hashSync(request.body.password, 10);

      try {
        user = await usersRepository.save(user);
      } catch (err) {
        reply.code(400);
        return {error: 'User with email already exists'};
      }

      reply.code(200);
      return user as unknown as UserType;
    }
  })

  fastify.route({
    url: '/startup',
    method: 'GET',
    schema: {
      response: {
        200: Type.Array(StartupSchema),
      }
    },
    handler: async function (request, reply) {
      const startupRepository = AppDataSource.getRepository(Startup);
      const startups = await startupRepository.find({order: {valuation: 'DESC'}});

      reply.code(200);
      return startups as unknown as StartupType[];
    }

  })

  fastify.route({
    url: '/startup/:id',
    method: 'GET',
    schema: {
      params: Type.Object({
        id: Type.Number()
      }),
      response: {
        200: StartupSchema,
        404: Type.Object({
          error: Type.String()
        })
      }
    },
    handler: async function (request, reply) {
      const startupRepository = AppDataSource.getRepository(Startup);
      const startup = await startupRepository.findOne({where: {id: request.params.id}});

      if (!startup) {
        reply.code(404);
        return {error: 'Startup not found'};
      }

      reply.code(200);
      return startup as unknown as StartupType;
    }
  })

}

export default plugin;