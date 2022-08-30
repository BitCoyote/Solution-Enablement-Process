import { createApp } from '../src/backend/index';
import { seedTables } from './mocks/mock-db';
require('dotenv').config({ path: '.env.testing' })

module.exports = async () => {
    // Fake expired token used alongside BYPASS_AUTH env variable. For user ID 774d6f78-5477-4f71-8f6e-fea599577a50
    const globals = globalThis as any;
    // port 0 tells express to use the first open port. This prevents a "listen EADDRINUSE: address already in use" error since jest runs tests in parallel.
    const port = 3001;

    const { app, db } = await createApp();
    // Create server on port so frontend tests can hit the backend api 
    globals.server = await app.listen(port);

    await db.sequelize.sync({ force: true }).catch((err: any) => console.warn(err));
    await seedTables(db);
}