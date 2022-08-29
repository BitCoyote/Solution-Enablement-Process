import { SuperTest, Test } from 'supertest';
import express from 'express';
import * as authorization from './authorization';
import { mockRequest, mockResponse, mockNext } from './mocks/express-mocks';
const globals = globalThis as any;

describe('authorization', () => {
    let req: express.Request, res: express.Response, next: express.NextFunction;
    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
    });
    describe('mustOwnResource middleware', () => {
        it('should return a 404 error when the resource cannot be found', async () => {
            await authorization.mustOwnResource(req, res, next, globals.db.User, 'somefakeid');
            expect(res.status).toHaveBeenCalledWith(404);
        });
        it('should return a 403 error when the requesting user does not own the resource', async () => {
            await authorization.mustOwnResource(req, res, next, globals.db.User, 'abc');
            expect(res.status).toHaveBeenCalledWith(403);
        });
        it('should proceed when the user owns the resource', async () => {
            res.locals.user = {
                oid: globals.loggedInUserID
            }
            await authorization.mustOwnResource(req, res, next, globals.db.User, globals.loggedInUserID);
            expect(next).toHaveBeenCalled();
        });

    });
    describe('checkForPermission middleware', () => {
        it('should return a 403 error when the requesting user does not have the required permission', async () => {
            await authorization.checkForPermissionMiddleware(res, next, 'FLOOP');
            expect(res.status).toHaveBeenCalledWith(403);
        });
        it('should proceed when the user has the single given permission', async () => {
            res.locals.user = {
                oid: globals.loggedInUserID,
                roles: [
                    {
                        permissions: [
                            { id: 'FLOOP' }
                        ]
                    }
                ]
            }
            await authorization.checkForPermissionMiddleware(res, next, 'FLOOP');
            expect(next).toHaveBeenCalled();
        });
        it('should proceed when the user has one of the given permissions', async () => {
            res.locals.user = {
                oid: globals.loggedInUserID,
                roles: [
                    {
                        permissions: [
                            { id: 'FLOOP' }
                        ]
                    }
                ]
            }
            await authorization.checkForPermissionMiddleware(res, next, ['FLOOP', 'DOOP']);
            expect(next).toHaveBeenCalled();
        });
        it('should proceed when the user has a superUser role', async () => {
            res.locals.user = {
                oid: globals.loggedInUserID,
                roles: [
                    {
                        superUser: true
                    }
                ]
            }
            await authorization.checkForPermissionMiddleware(res, next, 'FLOOP');
            expect(next).toHaveBeenCalled();
        });

    });
});