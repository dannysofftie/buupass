import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import Accounts from '../controllers/Accounts';

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: { prefix: string }, next: (err?: Error) => void) => {
    app.post(
        '/sign-in',
        {
            schema: {
                description: 'Authentication endpoint, for all the users, to allow access to protected resources',
                summary: 'Sign in to access protected resources',
                tags: ['auth'],
                body: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', description: 'Will accept email address' },
                        password: { type: 'string', description: 'User password' },
                    },
                    required: ['email', 'password'],
                },
                response: {
                    200: {
                        description: 'Success',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            error: { type: 'string' },
                            role: { type: 'string' },
                            token: { type: 'string' },
                        },
                    },
                },
            },
        },
        async (req, res) => await new Accounts(app, req, res).authenticate()
    );

    app.post(
        '/reset-password',
        {
            schema: {
                description: 'Reset forgotten user password. An autogenerated password will be sent to the supplied email address.',
                tags: ['auth'],
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', description: `User's email address` },
                    },
                    required: ['email'],
                },
                summary: 'Reset passowrd',
            },
        },
        async (req, res) => await new Accounts(app, req, res).resetUserPassword()
    );

    app.post(
        '/sign-up',
        {
            schema: {
                description: 'Create user account',
                tags: ['auth'],
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: `User's first and last name` },
                        idnumber: { type: 'number', description: `User's ID number` },
                        phone: { type: 'number', description: `User's phone number` },
                        email: { type: 'string', description: `User's email address` },
                        account: { type: 'string', enum: ['client', 'admin'], description: 'Account authentication role, accepted values are either of below' },
                    },
                    required: ['password', 'email', 'account'],
                },
                summary: 'Create user account',
            },
        },
        async (req, res) => await new Accounts(app, req, res).addNewEntry()
    );

    // pass execution to the next middleware
    next();
};
