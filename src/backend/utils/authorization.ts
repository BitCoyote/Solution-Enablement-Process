import express from 'express';
import logger from './logger';
import Database from '../database';
import { ModelStatic, Op } from 'sequelize';

/**
 * @function void Express middleware to load permissions for user
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response object
 * @param {Database} db Database object
 */
export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  db: Database
): Promise<void> => {
  const user: any = res.locals.user;

  const userRoleOptions = {
    where: {
      userId: {
        [Op.eq]: user.oid
      }
    }
  };

  try {
    const userRoles = await db.UserRole.findAll(userRoleOptions);
    const roleOptions: any = {
      where: {
        id: {
          [Op.in]: userRoles.map(ur => ur.roleID)
        }
      },
      include: {
        model: db.Permission,
        as: 'permissions',
        through: { attributes: [] }
      }
    };

    res.locals.user.roles = await db.Role.findAll(roleOptions);
    next();
  } catch (err) {
    logger.error(err);
    res.status(500).send(err.message);
  }
};

/**
 * @function void Express middleware to check if user owns the resource they are trying to interact with
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response object
 * @param {any} resourcePromise A resourceModel such as db.Dashboard
 * @param {string | number} resourceID The id (primary key) of the resource to check
 */
export const mustOwnResource = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  resourceModel: any,
  resourceID: string | number
) => {
  try {
    const resource = await resourceModel.findByPk(resourceID);
    if (!resource) {
      return res.status(404).send('Unable to find resource.');
    }
    if (
      resource.userID === res.locals.user.oid ||
      resource.createdBy === res.locals.user.oid
    ) {
      next();
    } else {
      return res.status(403).send('Unauthorized');
    }
  } catch (err) {
    return res.status(500).send(err.message)
  }
};

export const checkForPermission = (
  res: express.Response,
  permission: string | string[]
) => {
  // Check for a single permission or a list of permisisons. Returns true if at least 1 is found.
  let permissionsToCheck: string[];
  if (typeof permission === 'object') {
    permissionsToCheck = permission;
  } else {
    permissionsToCheck = [permission];
  }
  for (let i = 0; i < res.locals.user.roles.length; i++) {
    const role = res.locals.user.roles[i];
    if (role.superUser) {
      // Super User, can do anything.
      return true;
    }
    for (let k = 0; k < role.dataValues.permissions.length; k++) {
      const permission = role.dataValues.permissions[k].dataValues;
      if (
        permissionsToCheck.includes(
          permission.dataValues.title
        )
      ) {
        return true;
      }
    }
  }
  return false;
};

export const checkForPermissionMiddleware = (
  res: express.Response,
  next: express.NextFunction,
  permission: string | string[]
) => {
  if (checkForPermission(res, permission)) {
    next();
  } else {
    return res
      .status(403)
      .send(
        'You are missing the following permission required for this endpoint: ' +
        permission
      );
  }
};

