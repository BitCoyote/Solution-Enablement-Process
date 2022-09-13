import express from 'express';
import * as authorization from './authorization';
import {
  mockRequest,
  mockResponse,
  mockNext,
} from '../../../testing/mocks/express-mocks';
import { BackendTestingGlobals } from '../../../testing/types';
const globals = globalThis as unknown as BackendTestingGlobals;

describe('authorization', () => {
  let req: express.Request, res: express.Response, next: express.NextFunction;
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext();
  });
  describe('mustOwnResource middleware', () => {
    it('should return a 404 error when the resource cannot be found', async () => {
      await authorization.mustOwnResource(
        req,
        res,
        next,
        globals.db.User,
        'somefakeid'
      );
      expect(res.status).toHaveBeenCalledWith(404);
    });
    it('should return a 403 error when the requesting user does not own the resource', async () => {
      await authorization.mustOwnResource(
        req,
        res,
        next,
        globals.db.User,
        'abc'
      );
      expect(res.status).toHaveBeenCalledWith(403);
    });
    it('should proceed when the user owns the resource', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
      };
      await authorization.mustOwnResource(
        req,
        res,
        next,
        globals.db.User,
        globals.loggedInUserID
      );
      expect(next).toHaveBeenCalled();
    });
  });
  describe('checkForRole middleware', () => {
    it('should return a 403 error when the requesting user does not have the required role', async () => {
      await authorization.checkForRoleMiddleware(res, next, 'FLOOP');
      expect(res.status).toHaveBeenCalledWith(403);
    });
    it('should proceed when the user has the single given role', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
        roles: ['FLOOP'],
      };
      await authorization.checkForRoleMiddleware(res, next, 'FLOOP');
      expect(next).toHaveBeenCalled();
    });
    it('should proceed when the user has one of the given roles', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
        roles: ['FLOOP'],
      };
      await authorization.checkForRoleMiddleware(res, next, ['FLOOP', 'DOOP']);
      expect(next).toHaveBeenCalled();
    });
    it('should proceed when the user has a SUPER_USER role', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
        roles: ['SUPER_USER'],
      };
      await authorization.checkForRoleMiddleware(res, next, 'FLOOP');
      expect(next).toHaveBeenCalled();
    });
  });
});
