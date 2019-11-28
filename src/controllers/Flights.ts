import Controller from '../utils/Controller';

export default class Flights extends Controller {
    public async addNewEntry(): Promise<any> {
        throw new Error('Method not impelemented');
    }

    public async findAllEntries(): Promise<any> {
        const users = await this.app.models.Flight.aggregate([
            {
                $match: {},
            },
        ]);

        return users;
    }

    public async findOneAndUpdate(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public async findOneEntry() {
        throw new Error('Method not implemented');
    }
}
