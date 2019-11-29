import { FastifyInstance, FastifyReply, FastifyRequest, FastifyMiddleware } from 'fastify';

/**
 * Determine account, and user type from the incoming request.
 *
 * @export
 */
export function determineAccountAndUser(app: FastifyInstance, req: FastifyRequest) {
    const auth: string = req.headers['authorization'] || req.cookies['token'];

    try {
        const token = auth.split(' ')[0] === 'Bearer' ? auth.split(' ')[1] : auth;

        return app.utils.verify(token);
    } catch {
        return null;
    }
}

/**
 * Prehandler hook,
 *  - Protect all resources accessible to admin only
 *
 * @export
 * @param {FastifyRequest} req
 * @param {FastifyReply<{}>} res
 */
export function protectAdminResources(req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void): any {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return res.status(401).send({ error: 'unauthorized', message: 'Missing authentication token' });
    }

    const { account, email, id } = determineAccountAndUser(this, req);

    if (account !== 'admin') {
        return res.status(403).send({ error: 'forbidden', message: 'Invalid credentials in authentication token' });
    }

    return done();
}

/**
 * Prehandler hook,
 *  - Protect all resources accessible to clients only
 *
 * @export
 * @param {FastifyRequest} req
 * @param {FastifyReply<{}>} res
 */
export function protectClientResources(req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void): any {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return res.status(401).send({ error: 'unauthorized', message: 'Missing authentication token' });
    }

    const { account, email, id } = determineAccountAndUser(this, req);

    if (account !== 'client') {
        return res.status(403).send({ error: 'forbidden', message: 'Invalid credentials in authentication token' });
    }

    return done();
}

/**
 * Allow authorized user to access resource, without narrowing scope to role/account
 *
 * @export
 * @param {FastifyRequest} req
 * @param {FastifyReply<{}>} res
 * @param {(err?: Error) => void} done
 * @returns
 */
export function protectAuthorizedUser(req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void): any {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return res.status(401).send({ error: 'unauthorized', message: 'Missing authentication token' });
    }

    const { account, email, id } = determineAccountAndUser(this, req);

    if (!account) {
        return res.status(403).send({ error: 'forbidden', message: 'Invalid credentials in authentication token' });
    }

    return done();
}

/**
 * Allow access to protected resources for any authorized user
 *
 * @export
 * @param {FastifyRequest} req
 * @param {FastifyReply<{}>} res
 * @param {(err?: Error) => void} done
 * @returns
 */
export function protectAuthorizedUserViews(req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void): any {
    const token = req.cookies['token'];

    if (!token) {
        return res.redirect('/logout?utm_source=authentication-redirect');
    }

    return done();
}

export function logoutAndClearToken(req: FastifyRequest, res: FastifyReply<{}>, done: (err?: Error) => void): any {
    res.setCookie('token', '', { expires: new Date('01-01-1997') });
    res.redirect('/?utm_source=authentication-server-redirect');
}
