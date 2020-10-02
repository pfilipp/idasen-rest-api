import {expressServer} from './express-server.js';
import {RestServer} from './rest-server.js';

const restServer = new RestServer(process.env.PORT || '3001', expressServer);

restServer.start();

process.on('SIGINT', async () => {
  await deskManager.disconnectAsync(deskManager.desk);
  process.exit(0);
});
