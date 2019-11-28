import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { indexPageData } from '../locals';

/**
 * Instance definition for every view route defined in the application.
 *
 * @export
 * @interface IViewRoutes
 */
export interface IViewRoutes {
    path: string;
    view: string;
    middleware?: (req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void) => void;
    locals?: Array<(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) => Promise<any>>;
}

export const routes: IViewRoutes[] = [
    {
        path: '/',
        view: 'index',
        middleware: null,
        locals: [indexPageData],
    },
    {
        path: '/login',
        view: 'login',
        middleware: null,
        locals: [indexPageData],
    },
    {
        path: '/sign-up',
        view: 'sign-up',
        middleware: null,
        locals: [indexPageData],
    },
    {
        path: '/search-results',
        view: 'search-results',
        middleware: null,
        locals: [indexPageData],
    },
    {
        path: '/flight-checkout',
        view: 'flight-checkout',
        middleware: null,
        locals: [indexPageData],
    },
    {
        path: '/flights',
        view: 'all-flights',
        middleware: null,
        locals: [indexPageData],
    },
];
