import express from 'express';
import idasenController from 'idasen-controller';
import {storeKeys} from '../store/store-keys.js';
import {store} from '../store/store.js';

const router = express.Router();
const deskManager = idasenController.deskManager;

class PositionRouterWrapped {
  constructor(deskManager, router){
    this.deskManager = deskManager;
    this.router = router;

    this.setRoutes();
  }

  setRoute = (httpType, path, callback) => {
    this.router[httpType](path, callback);
  }

  setRoutes = () => {
    this.setRoute('post', '/sit', this.handleSitRequest);
    this.setRoute('post', '/stand', this.handleStandRequest);
    this.setRoute('post', '/lowest', this.handleLowestRequest);
    this.setRoute('get', '/isstanding', this.handleIsStandingRequest);
  }

  handleSitRequest = async (request, response) => {
    const sitHeight = store.get(storeKeys.SIT_HEIGHT)
    await deskManager.deskController.moveToAsync(sitHeight);
    response.send();
  }

  handleStandRequest = async (request, response) => {
    const standHeight = store.get(storeKeys.STAND_HEIGHT)
    await deskManager.deskController.moveToAsync(standHeight);
    response.send();
  }

  handleLowestRequest = async (request, response) => {
    const lowestHeight = store.get(storeKeys.LOWEST_HEIGHT)
    await deskManager.deskController.moveToAsync(lowestHeight);
    response.send();
  }

  handleIsStandingRequest = async (request, response) => {
    const height = await deskManager.desk.getCurrentHeightAsync();
    if (height === STAND){
      response.send(true);
      return;
    }
    response.send(false);
  }

}

export const positionRouterWrapped = new PositionRouterWrapped(deskManager, router);
