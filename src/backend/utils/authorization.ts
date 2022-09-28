import express from 'express';
import Database from '../models';
import { allAppRoles } from '../../shared/utils/helpers';

/**
 * @function void Express middleware to check if user owns the resource they are trying to interact with
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response object
 * @param {any} resourcePromise A resourceModel such as db.User
 * @param {string | number} resourceID The id (primary key) of the resource to check
 */
export const mustOwnResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  resourceModel: any,
  resourceID: string | number
) => {
  const resource = await resourceModel.findByPk(resourceID);
  if (!resource) {
    return res.status(404).send('Unable to find resource.');
  }
  if (
    resource.userID === res.locals.user.oid ||
    resource.createdBy === res.locals.user.oid ||
    resource.id === res.locals.user.oid
  ) {
    next();
  } else {
    return res.status(403).send('Unauthorized');
  }
};

export const checkForRoleMiddleware = (
  res: express.Response,
  next: express.NextFunction,
  role: string | string[]
) => {
  if (checkForRole(res, role)) {
    next();
  } else {
    return res
      .status(403)
      .send(
        'You are missing the following role required for this endpoint: ' + role
      );
  }
};

const checkForRole = (res: express.Response, role: string | string[]) => {
  // Check for a single role or a list of roles. Returns true if at least 1 is found.
  let rolesToCheck: string[];
  if (typeof role === 'object') {
    rolesToCheck = role;
  } else {
    rolesToCheck = [role];
  }
  for (let i = 0; i < (res.locals.user.roles || []).length; i++) {
    const role = res.locals.user.roles[i];
    if (role === 'AuthSuperUser') {
      // Super User, can do anything.
      return true;
    }
    if (rolesToCheck.includes(role)) {
      return true;
    }
  }
  return false;
};

/** Checks if the requesting user is the requestor or a resource owner for the given SEP */
export const mustBeRequestorOrResourceOwner = async (
  res: express.Response,
  next: express.NextFunction,
  db: Database,
  sepID: number
) => {
  const sep = await db.SEP.findByPk(sepID);
  if (
    !sep ||
    (sep.createdBy !== res.locals.user.oid && !checkForRole(res, allAppRoles))
  ) {
    return res
      .status(403)
      .send(
        'You must be either the requestor for this SEP or a resource owner to take this action.'
      );
  } else {
    next();
  }
};
