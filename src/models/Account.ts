import { Document, Schema, HookNextFunction, model } from 'mongoose';

export type AccountType = 'client' | 'admin';

export interface IAccount {
    account: AccountType;
    email: string;
    name?: string;
    idnumber?: number;
    phone?: string;
    password: string;
}

export interface IAccountDocument extends IAccount, Document {}

const account = new Schema<IAccountDocument>(
    {
        account: {
            type: String,
            enum: ['client', 'admin'],
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
        },
        idnumber: {
            type: Number,
        },
        phone: {
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
account.pre('aggregate', function(next: HookNextFunction) {
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

export const Account = model<IAccountDocument>('accounts', account);
