import { pseudoRandomBytes } from 'crypto';
import { IAccount } from '../models/Account';
import { IBooking } from '../models/Booking';
import Controller from '../utils/Controller';

export default class Bookings extends Controller {
    public async addNewEntry(): Promise<any> {
        if (!this.user.id) {
            const user: IAccount = {
                account: 'client',
                email: this.body['email'],
                password: pseudoRandomBytes(2).toString('hex'),
            };

            // create user account for faster subsequent checkouts
        }

        const data: IBooking = {
            client: this.user.id,
            flight: this.body['flight'],
            seats: this.body['seats'],
        };

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
