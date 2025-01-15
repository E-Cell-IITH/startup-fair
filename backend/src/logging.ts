import { FastifyInstance } from 'fastify';
import { createLogger, format, transports } from 'winston';
import { PapertrailTransport } from 'winston-papertrail-transport';

const papertrail = new PapertrailTransport({
    host: 'logs.papertrailapp.com',
    port: Number.parseInt(process.env.PAPERTRAIL_PORT as string),
    hostname: 'ecell-vmf',
    program: 'app',
    flushOnClose: true,
    handleExceptions: true
})

papertrail.on('connect', function(message) {
    console.log('Papertrail connected:', message);
});

papertrail.on('error', function(err) {
    console.error('Papertrail error:', err, err.message, err.name, err.stack);
});

export const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({ format: format.colorize() }),// TODO: Might remove this
        new transports.File({ filename: 'logs/combined.log' }), // TODO: Might remove this
        // papertrail
    ]
});

export function attachLogger(server: FastifyInstance) {
    // Hook for logging all requests
    server.addHook('onRequest', async (request, reply) => {
        logger.info('Incoming request', {
            method: request.method,
            url: request.url,
            agent: request.headers['user-agent']
        });
    });

    // Hook for logging responses
    server.addHook('onResponse', async (request, reply) => {
        logger.info('Request completed', {
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode
        });
    });

    // Error handler
    server.setErrorHandler(async (error, request, reply) => {
        logger.error('Error occurred', {
            error: error.message,
            stack: error.stack,
            method: request.method,
            url: request.url
        });
        
        console.log();

        reply.status(500).send({ error: 'Internal Server Error' });
    });

    process.on('SIGINT', async () => {
        logger.crit('Application shutting down - SIGINT');
        await server.close();
        process.exit(0);
    });
}