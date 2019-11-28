import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function indexPageData(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    return {
        appname: app.config.appname,
    };
}

export async function allAvailableFlights(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    //
}
