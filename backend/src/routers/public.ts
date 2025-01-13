import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { ExtendedUserSchema, ExtendedUserType, User, UserSchema, UserType } from "../entity/User";
import { Startup, StartupSchema, StartupType } from "../entity/Startup";
import { AppDataSource } from "../data-source";

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
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.createQueryBuilder('user')
        .select('user.id', 'id')
        .addSelect('user.name', 'name')
        .innerJoin('user.investments', 'investment')
        .innerJoin('investment.startup', 'startup')
        .groupBy('user.id')
        .addSelect('COALESCE(SUM(investment.equity * startup.valuation), 0) + user.balance', 'net_worth')
        .orderBy('net_worth', 'DESC')
        .offset(request.query.from)
        .limit(25)
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
        200: ExtendedUserSchema,
        404: Type.Object({
          error: Type.String()
        })
      }
    },
    handler: async function (request, reply) {
        const userRepository = AppDataSource.getRepository(User);
        // const user = await userRepository.findOne({where: {id: request.params.id}, relations: ['investments']});
        const user = await userRepository.createQueryBuilder('user')
          .where('user.id = :id', {id: request.params.id})
          .leftJoin('user.investments', 'investment')
          .leftJoin('investment.startup', 'startup')
          .addSelect([
            'investment.id', 
            'investment.equity', 
            'investment.amount',
            'startup.id',
            'startup.name',
            'startup.valuation', 
          ])
          .getOne();

        if (!user) {
          reply.code(404);
          return {error: 'User not found'};
        }

        user.net_worth = (await user.investments).reduce((acc, investment) => {
          return acc + investment.equity * investment.startup.valuation;
        }, user.balance);

        console.log(user);

        reply.code(200);
        return user as unknown as ExtendedUserType;
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