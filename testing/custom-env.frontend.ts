import { createApp } from "../src/backend";
import { seedTables } from "./mocks/mock-db";
require('dotenv').config({ path: '.env.testing' })

// my-custom-environment
const JsdomEnvironment = require('jest-environment-jsdom').default;

class CustomEnvironment extends JsdomEnvironment {
    constructor(config: any, context: any) {
        super(config, context);
    }

    async setup() {
        await super.setup();
        this.global.setupApp = async () => {
            const { app, db } = await createApp();

            // Create server on port so frontend tests can hit the backend api. 
            // Pass 0 to pick a random available port because tests run in parellel.
            this.global.server  = await app.listen(0);
            const port = (this.global.server.address() as any).port;
            await db.sequelize.sync({ force: true }).catch((err: any) => console.warn(err));
            await seedTables(db);

            this.global.port = port;
            this.global.app = app;
            this.global.db = db;
    
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