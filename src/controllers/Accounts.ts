import Controller from '../utils/Controller';
import { IAccount, IAccountDocument } from '../models/Account';
import { hash, compare } from 'bcrypt';
import { IEmailOptions } from '../libraries/Email';
import { pseudoRandomBytes } from 'crypto';

export default class Accounts extends Controller {
    public async addNewEntry() {
        const user: IAccount = {
            account: 'client',
            email: this.body['email'],
            name: this.body['name'],
            password: await hash(this.body['password'], 8),
        };

        const exists = await this.findOneEntry();

        if (exists.length) {
            return this.res.status(403).send({ error: 'exists', message: 'Supplied email address exists' });
        }

        await new this.app.models.Account(user).save();

        return { message: 'success' };
    }

    public async findOneEntry() {
        if (this.body) {
            return await this.app.models.Account.aggregate([
                {
                    $match: { email: this.body['email'] },
                },
            ]);
        }

        if (this.user) {
            return await this.app.models.Account.aggregate([
                {
                    $match: { id: this.user.id },
                },
            ]);
        }

        return [];
    }

    public async authenticate() {
        const body = {
            email: (this.body['email'] as string).trim().toLowerCase(),
            password: (this.body['password'] as string).trim(),
        };

        this.body = body;

        const user = (await this.findOneEntry()) as IAccountDocument[];

        if (!user.length) {
            return this.res.status(401).send({ error: 'not-exists', message: 'Username or email not found', role: null, token: null });
        }

        if (!(await compare(this.body['password'], user[0]['password']))) {
            return this.res.status(400).send({ error: 'password-mismatch', message: 'Supplied password does not match', role: null, token: null });
        }

        const data = {
            id: user[0]['id'],
            email: user[0]['email'],
            account: user[0]['account'],
        };

        const token = this.app.utils.sign(data);

        return { message: 'success', role: user[0]['account'], token, email: user[0]['email'], phone: user[0]['phone'], name: user[0]['name'], avatar: user[0]['avatar'] };
    }

    /**
     * Reset user password, to a an auto-generated password
     *
     * @returns
     * @memberof Platformusers
     */
    public async resetUserPassword() {
        const password = pseudoRandomBytes(2).toString('hex');

        const data = {
            password: await hash(password, 9),
            email: (this.body['email'] as string).trim().toLowerCase(),
        };

        const exists = await this.app.models.Account.aggregate([
            {
                $match: { email: data.email },
            },
        ]);

        if (!exists.length) {
            return this.res.status(400).send({ error: 'not-exists', message: 'Account associated with that email was not found' });
        }

        const email: IEmailOptions = {
            recipients: data.email,
            message: this.app.utils.compileEjs(
                { template: 'reset-password' },
                {
                    appname: this.app.config.appname,
                    header: 'Password recovery',
                    message: `Your password has been reset to, ${password}. Use the new passowrd to access your dashboard.`,
                    ...data,
                }
            ),
            tocustomname: data.email,
            fromtext: this.app.config.appname,
            subject: 'Your password has been reset',
        };

        await this.app.models.Account.updateOne({ email: data.email }, { $set: { password: data.password } }).exec();

        this.app.utils.sendEmail(email);

        return this.res.status(200).send({ message: 'success' });
    }
}
