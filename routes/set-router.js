import express from 'express';
import {store} from '../store/store.js';
import {storeKeys} from '../store/store-keys.js';

const router = express.Router();

class SetRouterWrapped {
  constructor(router){
    this.router = router;

    this.setRoutes();
  }

  setRoute = (httpType, path, callback) => {
    this.router[httpType](path, callback);
  }

  setRoutes = () => {
    this.setRoute('post', '/defaultdesk', this.handleDefaultDesk);

    this.setRoute('post', '/savesettings', this.handleSaveSettings);
    this.setRoute('post', '/clearsettings', this.handleClearSettings);

    this.setRoute('post', '/sitheight', this.handleSitHeightRequest);
    this.setRoute('post', '/standheight', this.handleStandHeightRequest);
    this.setRoute('post', '/lowestheight', this.handleLowestHeightRequest);
    this.setRoute('post', '/deskoffsetheight', this.handleDeskOffsetHeightRequest);
  }

  handleDefaultDesk = async (request, response) => {
    const {address} = request.body;
    store.addWithOverwrite(storeKeys.DESK_ADDRESS, address);
    console.log(store.get(storeKeys.DESK_ADDRESS));

    response.send();
  }

  handleSaveSettings = async (request, response) => {
    await store.save();
    response.send();
  }

  handleClearSettings = (request, response) => {
    store.clear();
    response.send('To clear settings permanently use /savesettings');
  }

  handleSitHeightRequest = async (request, response) => {
    const height = request.body;
    store.addWithOverwrite(storeKeys.SIT_HEIGHT, height);
    response.send();
  }

  handleStandHeightRequest = async (request, response) => {
    const height = request.body;
    store.addWithOverwrite(storeKeys.STAND_HEIGHT, height);
    response.send();
  }

  handleLowestHeightRequest = async (request, response) => {
    const height = request.body;
    store.addWithOverwrite(storeKeys.LOWEST_HEIGHT, height);
    response.send();
  }

  handleDeskOffsetHeightRequest = async (request, response) => {
    const height = request.body;
    store.addWithOverwrite(storeKeys.DESK_OFFSET_HEIGHT, height);
    response.send();
  }

}

export const setRouterWrapped = new SetRouterWrapped(router);
