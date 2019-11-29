import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { protectClientResources, protectAuthorizedUser, protectAdminResources } from '../middlewares/Authentication';
import Flights from '../controllers/Flights';
import Bookings from '../controllers/Bookings';

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: { prefix: string }, next: (err?: Error) => void) => {
    app.post(
        '/flight',
        {
            // preHandler: protectAdminResources,
            schema: {
                tags: ['api'],
                description: 'Create a new flight.',
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        origin: { type: 'string', description: 'Origin name' },
                        destination: { type: 'string', description: 'Destination name' },
                        departure: { type: 'string', description: 'Departure date' },
                        arrival: { type: 'string', description: 'Date of arrival' },
                        cost: { type: 'string', description: 'Cost per person' },
                        seats: { type: 'string', description: 'Number of seats' },
                        fullTrip: { type: 'string', description: 'Whether the flight will return to origin same day' },
                        code: { type: 'string', description: 'Flight code' },
                    },
                },
                summary: 'Create a new flight',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Flights(app, req, res).addNewEntry()
    );

    app.get(
        '/available-flights',
        {
            preHandler: protectAuthorizedUser,
            schema: {
                tags: ['api'],
                description: 'Find all available flights',
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Id of the object being referenced' },
                    },
                },
                summary: 'List all available flights',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Flights(app, req, res).findAllEntries()
    );

    app.post(
        '/book-flight',
        {
            preHandler: protectClientResources,
            schema: {
                tags: ['api'],
                description: 'Book a new flight.',
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'Sample entry title, e.g Resource title.' },
                        description: { type: 'string', description: 'Resource description' },
                    },
                    required: ['title'],
                },
                summary: 'Book flight',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Bookings(app, req, res).addNewEntry()
    );

    app.put(
        '/update-flight/:id',
        {
            preHandler: protectClientResources,
            schema: {
                tags: ['api'],
                description: 'Update/edit a flight.',
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'Description of this title field.' },
                        description: { type: 'string', description: 'Description of description field' },
                    },
                },
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Id of the object being referenced' },
                    },
                },
                summary: 'Update a flight',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Bookings(app, req, res).findOneAndUpdate()
    );

    app.delete(
        '/cancel-flight/:id',
        {
            preHandler: protectClientResources,
            schema: {
                description: 'Cancel a flight.',
                tags: ['api'],
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Flight id' },
                    },
                },
                response: {
                    ...app.utils.statuscodes,
                },
                summary: 'Cancel a flight',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Bookings(app, req, res).cancelFlight()
    );

    // pass to the next middleware
    next();
};
