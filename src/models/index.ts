import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { IFlightDocument, Flight } from './Flight';
import { IAccountDocument, Account } from './Account';
import { IBookingDocument, Booking } from './Booking';

export interface IDatabase {
    Flight: Model<IFlightDocument>;
    Account: Model<IAccountDocument>;
    Booking: Model<IBookingDocument>;
}

const models: IDatabase = {
    Flight,
    Account,
    Booking,
};

export default fp(async (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, done: (err?: Error) => void) => {
    mongoose.connection.on('connected', () => console.log('Mongo connected successfully'));
    mongoose.connection.on('error', console.log);

    await mongoose.connect(app.config.mongouri, { useNewUrlParser: true, keepAlive: true, useCreateIndex: true, useUnifiedTopology: true });

    app.decorate('models', models);

    done();
});
