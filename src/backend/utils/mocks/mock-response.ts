import express from 'express';
export default (): express.Response => {
  const res: express.Response = express.response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.locals = {
    user: { oid: 'thisisafakeuserid', roles: []}
  };
  return res;
};
