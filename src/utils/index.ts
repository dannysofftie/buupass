import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IStatusCodesInterface, statuscodes } from './Statuscodes';
import { ICompileTemplate, compileEjs } from './Template';
import { IJWTToken, JWTToken } from './Token';
import { IEmail, sendEmail } from '../libraries/Email';
import { IResolveLocals, resolve } from './Resolvelocals';
import { IPaginate, paginate } from './Paginate';

// tslint:disable-next-line: no-empty-interface
export interface IUtilities extends IStatusCodesInterface, ICompileTemplate, IJWTToken, IEmail, IResolveLocals, IPaginate {}

export default fp((app: FastifyInstance, opts: {}, done: (err?: Error) => void) => {
    app.decorate('utils', { statuscodes, compileEjs, ...JWTToken, sendEmail, resolve, paginate });

    // pass execution to the next middleware in fastify instance
    done();
});
