import { pseudoRandomBytes } from 'crypto';
import { IAccount } from '../models/Account';
import Controller from '../utils/Controller';

export default class Bookings extends Controller {
    public async addNewEntry(): Promise<any> {
        if (!this.user) {
            const user: IAccount = {
                account: 'client',
                email: this.body['email'],
                password: pseudoRandomBytes(2).toString('hex'),
            };

            // create user account for faster subsequent checkouts
            let exists = await (await this.app.models.Account.aggregate([{ $match: { email: user.email } }]))[0];

            if (!exists) {
                exists = await new this.app.models.Account(user).save();
            }

            this.user.id = exists['id'];
        }

        const data = {
            client: this.user.id,
            ...this.body,
        };

        // basic without checking remaining seats

        await new this.app.models.Booking(data).save();

        return { message: 'success' };
    }

    public async findAllEntries() {
        if (this.user) {
            return await this.app.models.Booking.aggregate([
                {
                    $match: { client: this.user.id },
                },
            ]);
        }
        return [];
    }

    public async findOneAndUpdate(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public async findOneEntry() {
        throw new Error('Method not implemented');
    }

    public async cancelFlight() {
        //
    }
}
