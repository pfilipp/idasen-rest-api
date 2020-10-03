import {expressServer} from './express-server.js';
import {RestServer} from './rest-server.js';
import idasenController from 'idasen-controller';

const {deskManager} = idasenController;

const restServer = new RestServer(process.env.PORT || '3001', expressServer);

restServer.start();

const cliArgs = process.argv.slice(2);
console.log(cliArgs);

const handleCLI = async () => {
  switch(cliArgs[0]){
    case ('scan'):
      console.log('starting scan');
      const devices = await deskManager.getAvailableDevices();
      console.log(devices);
      process.exit(0);
    case ('connect'):
      await deskManager.connectAsync(cliArgs[1]);
      break;
    default:
      break;
  }
}

handleCLI();

process.on('SIGINT', async () => {
  await deskManager.disconnectAsync(deskManager.desk);
  process.exit(0);
});
