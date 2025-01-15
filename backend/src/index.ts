import 'dotenv/config';
import 'reflect-metadata';
import fastify from 'fastify';
import { AppDataSource } from './data-source';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import addPublicRoutes from './routers/public';
import addProtectedRoutes from './routers/protected';
import { attachLogger, logger } from './logging';
import { seedDatabase } from './utils/seed_db';

const server = fastify({ logger: {level: 'debug'} })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

server.register(addPublicRoutes, { prefix: '/api' });
server.register(addProtectedRoutes, { prefix: '/api' });
attachLogger(server);

AppDataSource.initialize().then(async () => {

    server.log.info('Database Connected');

    if (process.argv.includes('--seed')) {
        await seedDatabase();
        logger.info('Database Seeding complete');
        process.exit(0);
    }

    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        } else {
            logger.info(`Server listening at ${address}`);
        }
    })

})