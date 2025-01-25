import { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import fs from 'fs';
import path from 'path';

export default async function addFrontendRoutes(fastify: FastifyInstance, options: any) {
    // const student_frontend = fs.readFileSync('./dist/student-frontend/index.html')
    // const admin_frontend = fs.readFileSync('../admin-frontend/dist/index.html')
    // await fastify.register(fastifyStatic, { root: path.join(import.meta.dirname, '../dist'), prefix: '/public/admin_portal' })

    // fastify.get('/admin_portal/*', (request, reply) => { reply.code(200).type('text/html').send( admin_frontend )})
}
