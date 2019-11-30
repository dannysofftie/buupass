import { Schema, Document, model, HookNextFunction, Types } from 'mongoose';

export interface IBooking {
    client: Types.ObjectId;
    flight: Types.ObjectId;
    seats: number;
    passengers: Array<{
        firstname: string;
        lastname: string;
        phone: string;
        idnumber: number;
        country: string;
    }>;
    payment?: {
        nameOnCard: string;
        cardNumber: number;
        month: number;
        year: number;
        cvv: string;
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
        passengers: [
            {
                firstname: {
                    type: String,
                },
                lastname: {
                    type: String,
                },
                phone: {
                    type: Number,
                },
                idnumber: {
                    type: Number,
                },
                country: {
                    type: String,
                },
            },
        ],
        payment: {
            nameOnCard: {
                type: String,
            },
            cardNumber: {
                type: Number,
            },
            month: {
                type: Number,
            },
            year: {
                type: Number,
            },
            cvv: {
                type: String,
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
