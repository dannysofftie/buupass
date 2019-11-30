import { IFreight } from '../models/Flight';
import Controller from '../utils/Controller';
import { Types } from 'mongoose';

export default class Flights extends Controller {
    public async addNewEntry(): Promise<any> {
        const data: IFreight = {
            arrival: this.body['arrival'],
            origin: this.body['origin'],
            departure: this.body['departure'],
            cost: this.body['cost'],
            fullTrip: this.body['fullTrip'] || true,
            destination: this.body['destination'],
            seats: this.body['seats'],
            code: this.body['code'],
            airline: this.body['airline'],
            flightType: this.body['flightType'],
        };

        const exists = await this.findOneEntry();

        if (exists.length) {
            return { error: 'flight-exists' };
        }

        await new this.app.models.Flight(data).save();

        return { message: 'success' };
    }

    public async findAllEntries(): Promise<any> {
        return await this.app.models.Flight.aggregate([
            {
                $lookup: {
                    from: 'bookings',
                    let: { id: '$id' },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ['$flight', '$$id'] } },
                        },
                    ],
                    as: 'booked',
                },
            },
            {
                $project: { booked: { $size: '$booked' }, other: '$$ROOT' },
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ['$other', '$$ROOT'] } },
            },
            {
                $project: { other: 0 },
            },
        ]);
    }

    public async findOneEntry() {
        const query = this.req.query['flight']
            ? {
                  id: Types.ObjectId(this.req.query['flight']),
              }
            : {
                  code: this.body['code'] || this.req.query['code'],
              };

        return this.app.models.Flight.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: 'bookings',
                    let: { id: '$id' },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ['$flight', '$$id'] } },
                        },
                    ],
                    as: 'booked',
                },
            },
            {
                $project: { booked: { $size: '$booked' }, other: '$$ROOT' },
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ['$other', '$$ROOT'] } },
            },
            {
                $project: { other: 0 },
            },
        ]);
    }

    public async findMatchingFlights() {
        const search = {
            origin: this.req.query['origin'],
            destination: this.req.query['destination'],
            departure: this.req.query['departure'],
            arrival: this.req.query['arrival'],
            seats: this.req.query['seats'],
        };

        const bookedSeats = [
            {
                $lookup: {
                    from: 'bookings',
                    let: { id: '$id' },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ['$flight', '$$id'] } },
                        },
                    ],
                    as: 'booked',
                },
            },
            {
                $project: { booked: { $size: '$booked' }, other: '$$ROOT' },
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: ['$other', '$$ROOT'] } },
            },
            {
                $project: { other: 0 },
            },
        ];

        if (search.origin && !search.destination) {
            return await this.app.models.Flight.aggregate([
                {
                    $match: { origin: { $regex: new RegExp(search.origin, 'ig') } },
                },
                ...bookedSeats,
            ]);
        }

        if (search.origin && search.destination) {
            return await this.app.models.Flight.aggregate([
                {
                    $match: {
                        $and: [{ origin: { $regex: new RegExp(search.origin, 'ig') } }, { destination: { $regex: new RegExp(search.destination, 'ig') } }],
                    },
                },
                ...bookedSeats,
            ]);
        }

        return [];
    }

    public async addPassenger() {
        const html = this.app.utils.compileEjs({ template: 'add-passenger' }, { number: Number(this.req.query['n']) + 1 });

        return this.res.type('text/html').send(html);
    }
}
