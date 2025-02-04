import { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';

export default async function addFrontendRoutes(fastify: FastifyInstance, options: any) {
    const frontend_index = fs.readFileSync('./dist/index.html')
    await fastify.register(fastifyStatic, { root: path.join(path.resolve('.'), './dist'), prefix: '/public' })

    fastify.setNotFoundHandler((request, reply) => { 
        reply.code(200).type('text/html').send( frontend_index )
    })
}
