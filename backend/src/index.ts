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
import { attachCache, attachStats } from './routers/lib.js';
import { createAdmin } from './utils/create_admin.js';
import { sendEmails } from './utils/send_emails.js';

const server = fastify()
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

server.register(cors, {
    origin: true,
    credentials: true
})

server.register(addPublicRoutes, { prefix: '/api' });
server.register(addProtectedRoutes, { prefix: '/api' });
server.register(import('@fastify/rate-limit'), {
    max: 60,
    timeWindow: '1 minute'
})
attachLogger(server);
attachStats(server);
attachCache(server);

AppDataSource.initialize().then(async () => {

    logger.info('Database Connected');

    if (process.argv.includes('--seed')) {
        await seedDatabase();
        logger.info('Database Seeding complete');
        process.exit(0);
    } else if (process.argv.includes('--create-admin')) {
        process.exit(await createAdmin())
    } else if (process.argv.includes('--send-emails')) {
        await sendEmails();
        process.exit(0);
    }

    server.listen({ port: 6969 }, (err, address) => {
        if (err) {
            logger.error(err);
            process.exit(1);
        } else {
            logger.info(`Server listening at ${address}`);
        }
    })

})