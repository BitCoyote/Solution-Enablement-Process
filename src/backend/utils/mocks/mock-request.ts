import express from 'express';
export default (): express.Request => {
  const req: express.Request = express.request;
  req.params = {};
  req.query = {};
  return req;
};
