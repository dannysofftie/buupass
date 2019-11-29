import { Schema, Document, model, HookNextFunction, Types } from 'mongoose';

export interface IBooking {
    client: Types.ObjectId;
    flight: Types.ObjectId;
    seats: number;
    payment?: {
        status: boolean;
        amount: number;
        date: Date;
    };
}

export interface IBookingDocument extends IBooking, Document {}

const booking = new Schema<IBookingDocument>(
    {
        client: {
            type: Schema.Types.ObjectId,
        },
        flight: {
            type: Schema.Types.ObjectId,
        },
        seats: {
            type: Number,
        },
        payment: {
            status: {
                type: Boolean,
                default: false,
            },
            amount: {
                type: Number,
            },
            date: {
                type: Date,
            },
        },
    },
    {
        timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' },
    }
);

// tslint:disable-next-line: only-arrow-functions
booking.pre('aggregate', function(next: HookNextFunction) {
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

export const Booking = model<IBookingDocument>('bookings', booking);
