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
  describe('mustBeRequestorOrResourceOwner middleware', () => {
    it('should return a 403 error when the requesting user is not the sep requestor or a resource owner', async () => {
      res.locals.user = {
        oid: 'incorrect oid',
        roles: [],
      };
      await authorization.mustBeRequestorOrResourceOwner(
        res,
        next,
        globals.db,
        1
      );
      expect(res.status).toHaveBeenCalledWith(403);
    });
    it('should proceed when the requesting user is the sep requestor', async () => {
      res.locals.user = {
        oid: 'abc',
      };
      await authorization.mustBeRequestorOrResourceOwner(
        res,
        next,
        globals.db,
        1
      );
      expect(next).toHaveBeenCalled();
    });
    it('should proceed when the requesting user is a resource owner', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
        roles: ['AuthLegal'],
      };
      await authorization.mustBeRequestorOrResourceOwner(
        res,
        next,
        globals.db,
        1
      );
      expect(next).toHaveBeenCalled();
    });
  });

  describe('checkForRole middleware', () => {
    it('should return a 403 error when the requesting user does not have the required role', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
        roles: [],
      };
      await authorization.checkForRoleMiddleware(res, next, 'FLOOP');
      expect(res.status).toHaveBeenCalledWith(403);
    });
    it('should return a 403 error when the requesting user does not have any roles', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
      };
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
    it('should proceed when the user has a AuthSuperUser role', async () => {
      res.locals.user = {
        oid: globals.loggedInUserID,
        roles: ['AuthSuperUser'],
      };
      await authorization.checkForRoleMiddleware(res, next, 'FLOOP');
      expect(next).toHaveBeenCalled();
    });
  });
});
