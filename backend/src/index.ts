import 'dotenv/config';
import 'reflect-metadata';
import fastify from 'fastify';
import { AppDataSource } from './data-source.js';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import addPublicRoutes from './routers/public.js';
import addProtectedRoutes from './routers/protected.js';
import { attachLogger, logger } from './logging.js';
import { seedDatabase } from './utils/seed_db.js';
import cors from '@fastify/cors'
import { attachStats } from './routers/lib.js';

const server = fastify({ logger: {level: 'debug'} })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

server.register(cors, {
    origin: process.env.ADMIN_ORIGIN,
    credentials: true
})

server.register(addPublicRoutes, { prefix: '/api' });
server.register(addProtectedRoutes, { prefix: '/api' });
attachLogger(server);
attachStats(server);

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