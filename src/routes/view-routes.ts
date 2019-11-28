import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { routes } from '../configs/views';

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, next: (err?: Error) => void) => {
    routes.forEach(route => {
        app.get(
            route.path,
            {
                ...(route.middleware && { preHandler: route.middleware }),
                schema: {
                    hide: true,
                },
            },
            async (req, res) => {
                res.view(route.view, await app.utils.resolve(route.locals, app, req, res));
            }
        );
    });

    // pass to the next middleware
    next();
};
