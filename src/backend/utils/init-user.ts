import Database from '../models';
export default async (user: any, db: Database): Promise<any> => {
  // Users are from Active Directory, but are replicated in the database so they can be referenced.
  const newUser = await db.User.create({
    id: user.oid,
    familyName: user.family_name,
    givenName: user.given_name,
    upn: user.upn || user.email || user.preferred_username
  });
  // Give general user role
  // await db.UserRole.create({
  //   createdBy: 'system',
  //   roleID: 0,
  //   userID: user.oid
  // });
  return newUser;
};
