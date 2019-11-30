import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Flights from '../controllers/Flights';
import Accounts from '../controllers/Accounts';
import Bookings from '../controllers/Bookings';
import { stringify } from 'querystring';

export async function indexPageData(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    return {
        appname: app.config.appname,
    };
}

export async function allAvailableFlights(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    const info = {};
    const flights = await new Flights(app, req, res).findAllEntries();

    info['flights'] = flights;

    if (Object.keys(req.query).length && !req.query['utm_source']) {
        const matches = await new Flights(app, req, res).findMatchingFlights();

        info['flights'] = matches;
        info['query'] = stringify(req.query);
    }

    return info;
}

export async function clientAccountData(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    const info = {};

    const bookings = await new Bookings(app, req, res).findAllEntries();

    info['bookings'] = bookings;

    const user = await new Accounts(app, req, res).findOneEntry();

    info['user'] = user[0];

    return info;
}

export async function flightCheckoutData(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    const info = {};

    const flight = await new Flights(app, req, res).findOneEntry().catch(e => []);

    info['flight'] = flight.length ? flight[0] : {};

    return info;
}

export async function allBookings(app: FastifyInstance, req: FastifyRequest, res: FastifyReply<{}>) {
    const info = {};

    const bookings = await new Bookings(app, req, res).findAllEntries();
    console.log(bookings);
    return info;
}
