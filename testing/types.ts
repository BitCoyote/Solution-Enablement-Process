import { Express } from 'express';
import { Server } from "http";
import { SuperTest, Test } from 'supertest';
import Database from "../src/backend/models";

interface TestingGlobals {
    db: Database,
    app: Express,
    loggedInUserID: string,
    idToken: string,
    accessToken: string
}

export interface BackendTestingGlobals extends TestingGlobals {
    request: SuperTest<Test>
}

export interface FrontendTestingGlobals extends TestingGlobals {
    port: number,
    server: Server,
    setupApp: Function,
    teardownApp: Function
}