import {expressServer} from './express-server.js';
import {RestServer} from './rest-server.js';
import idasenController from 'idasen-controller';
import {store} from './store/store.js';
import {storeKeys} from './store/store-keys.js';

const {deskManager, deskSettings} = idasenController;
const deskStore = deskSettings.store;
const deskStoreKeys = deskSettings.storeKeys;

const restServer = new RestServer(process.env.PORT || '3001', expressServer);

const setDefaultValues = () => {
  store.add(storeKeys.SIT_HEIGHT, 78);
  store.add(storeKeys.STAND_HEIGHT, 120);
  store.add(storeKeys.LOWEST_HEIGHT, 62);
  store.add(storeKeys.DESK_OFFSET_HEIGHT, 62);
}

setDefaultValues();

await store.load();
deskStore.addWithOverwrite(
  deskStoreKeys.DESK_OFFSET_HEIGHT,
  store.get(storeKeys.DESK_OFFSET_HEIGHT) * 100
);

if(store.exists(storeKeys.DESK_ADDRESS)){
  console.log('trying to connect to pre-saved address');
  const address = store.get(storeKeys.DESK_ADDRESS);
  console.log(address);
  setTimeout(()=> {
    const result = await deskManager.connectAsync(address);
    console.log(result);
  }, 2000)
}

restServer.start();

process.on('SIGINT', async () => {
  await deskManager.disconnectAsync(deskManager.desk);
  process.exit(0);
});
