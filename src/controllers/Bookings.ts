import Controller from '../utils/Controller';

export default class Bookings extends Controller {
    public async addNewEntry(): Promise<any> {
        throw new Error('Method not impelemented');
    }

    public async findAllEntries(): Promise<any> {
        return await this.app.models.Booking.aggregate([
            {
                $match: { client: this.user.id },
            },
        ]);
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
