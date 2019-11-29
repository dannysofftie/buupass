import { Document, Schema, HookNextFunction, model } from 'mongoose';

export interface IFreight {
    origin: string;
    destination: string;
    departure: Date;
    arrival: Date;
    cost: number;
    seats: number;
    fullTrip: boolean;
    code: string;
    discount?: number;
    airline: string;
    flightType: string;
}

export interface IFlightDocument extends IFreight, Document {}

const flight = new Schema<IFlightDocument>(
    {
        origin: {
            type: String,
        },
        destination: {
            type: String,
        },
        departure: {
            type: Date,
        },
        arrival: {
            type: Date,
        },
        cost: {
            type: Number,
        },
        seats: {
            type: Number,
        },
        fullTrip: {
            type: Boolean,
            default: true,
        },
        code: {
            type: String,
        },
        discount: {
            type: Number,
            default: 0,
        },
        airline: {
            type: String,
        },
        flightType: {
            type: String,
        },
    },
    { timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' } }
);

// tslint:disable-next-line: only-arrow-functions
flight.pre('aggregate', function(next: HookNextFunction) {
    this.pipeline().unshift(
        {
            $project: { id: '$_id', other: '$$ROOT' },
        },
        {
            $replaceRoot: { newRoot: { $mergeObjects: ['$$ROOT', '$other'] } },
        },
        {
            $project: { other: 0, _id: 0 },
        }
    );

    next();
});

export const Flight = model<IFlightDocument>('flights', flight);
