import 'dotenv/config';
import 'reflect-metadata';
import fastify from 'fastify';
import { AppDataSource } from './data-source';
import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import addUserRoutes from './routers/public';
import addProtectedRoutes from './routers/protected';

const server = fastify({ logger: {file: './log', level: 'debug'} })
    .setValidatorCompiler(TypeBoxValidatorCompiler)
    .withTypeProvider<TypeBoxTypeProvider>();

server.register(addUserRoutes, { prefix: '/api' });
server.register(addProtectedRoutes, { prefix: '/api' });

AppDataSource.initialize().then(async () => {

    server.log.info('Database Connected');

    server.listen({ port: 8080 }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        server.log.info(`Server listening on ${address}`);
    })

})