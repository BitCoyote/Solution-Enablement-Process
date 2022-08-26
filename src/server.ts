// It is important to require our dotenv config here, so the proper env variables are applied to all code run in this node process.
// It is also important to use "require" instead of "import", so that we can call "config()" before other modules are imported.
require('dotenv').config();
import { createApp } from './backend/index';
(async ()=>{
  const { app } = await createApp();
  const port = process.env.API_PORT || 3001;
  app.listen(port, () => {
    console.log('Express server listening on port ' + port)
  })
})()
