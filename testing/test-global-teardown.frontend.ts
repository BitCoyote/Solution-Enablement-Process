require('dotenv').config({ path: '.env.testing' })

module.exports = async () => {
    const globals = globalThis as any;
    await globals.server.close();
}