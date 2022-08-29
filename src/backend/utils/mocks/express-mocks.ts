import express from 'express';
export const mockRequest = (): express.Request => {
    const req: express.Request = express.request;
    req.params = {};
    req.query = {};
    return req;
};

export const mockResponse = (): express.Response => {
    const res: express.Response = express.response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.locals = {
        user: { oid: 'thisisafakeuserid', roles: [] },
        roles: []
    };
    return res;
};

export const mockNext = () => jest.fn();