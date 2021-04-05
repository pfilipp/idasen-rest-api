import {expressServer} from './server/express-server.js';
import {RestServer} from './server/rest-server.js';
import idasenController from 'idasen-controller';

const serverPort = process.env.PORT || '3001';

const restServer = new RestServer(serverPort, expressServer);
restServer.start();

process.on('SIGINT', async () => {
  const {deskManager} = idasenController;
  await deskManager.disconnectAsync(deskManager.desk);

  process.exit(0);
});
