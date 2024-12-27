import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { User, UserSchema, UserType } from "../entity/User";
import { Startup, StartupSchema, StartupType } from "../entity/Startup";
import { AppDataSource } from "../data-source";

const plugin: FastifyPluginAsyncTypebox = async function addUserRoutes(fastify, _opts) {
    
  fastify.route({
    url: '/user',
    method: 'GET',
    schema: {
      querystring: Type.Object({
        from: Type.Number({default: 0, minimum: 0})
      }),
      response: {
        200: Type.Array(Type.Pick(UserSchema, ['id', 'name', 'total_investment'])),
      }
    },
    handler: async function (request, reply) {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.createQueryBuilder('user')
        .select('user.id', 'id')
        .addSelect('user.name', 'name')
        .leftJoin('user.investments', 'investment')
        .groupBy('user.id')
        .addSelect('COALESCE(SUM(investment.amount), 0)', 'total_investment')
        .orderBy('total_investment', 'DESC')
        .skip(request.query.from)
        .take(25)
        .getRawMany()

      console.log(users);
      reply.code(200);
      return users as unknown as UserType[];
    }
  })
  
  fastify.route({
    url: '/user/:id',
    method: 'GET',
    schema: {
      params: Type.Object({
        id: Type.Number()
      }),
      response: {
        200: UserSchema,
        404: Type.Object({
          error: Type.String()
        })
      }
    },
    handler: async function (request, reply) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({where: {id: request.params.id}, relations: ['investments']});

        if (!user) {
          reply.code(404);
          return {error: 'User not found'};
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