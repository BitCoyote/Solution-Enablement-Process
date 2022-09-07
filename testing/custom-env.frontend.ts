import 'whatwg-fetch';
import { createApp } from "../src/backend";
import { seedTables } from "./mocks/mock-db";
require('dotenv').config({ path: '.env.testing' })

const JsdomEnvironment = require('jest-environment-jsdom').default;

class CustomEnvironment extends JsdomEnvironment {
    constructor(config: any, context: any) {
        super(config, context);
    }

    async setup() {
        await super.setup();
        this.global.setupApp = async () => {
            return new Promise(async (resolve: any) => {
                const { app, db } = await createApp();
                await db.sequelize.sync({ force: true }).catch((err: any) => console.warn(err));
                await seedTables(db);
                this.global.app = app;
                this.global.db = db;

                // Create server on port so frontend tests can hit the backend api. 
                // Pass 0 to pick a random available port because tests run in parallel.
                this.global.server = app.listen(0, () => {
                    this.global.port = (this.global.server.address() as any).port;
                    resolve();
                });


            })
        }
        this.global.teardownApp = async () => {
            await this.global.server.close();
            await this.global.db.sequelize.close();
        }

    }

    async teardown() {
        if (this.global.server) {
            await this.global.server.close();
        }
    }

    getVmContext() {
        return super.getVmContext();
    }

}

module.exports = CustomEnvironment;