import { Document, Schema, HookNextFunction, model } from 'mongoose';

export interface IFreight {
    origin: string;
    email: string;
    name: string;
    idnumber: number;
    phone: string;
    password: string;
}

export interface IFlightDocument extends IFreight, Document {}

const flight = new Schema<IFlightDocument>(
    {
        origin: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        password: {
            type: String,
            required: true,
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
