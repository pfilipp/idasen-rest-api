import express from 'express';
import idasenController from 'idasen-controller';
const router = express.Router();

const deskManager = idasenController.deskManager;

const SIT = 78;
const STAND = 120;
const LOWEST = 62;

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

  handleSitRequest = async (request, response, next) => {
    await deskManager.deskController.moveToAsync(SIT);
    response.send();
  }

  handleStandRequest = async (request, response, next) => {
    await deskManager.deskController.moveToAsync(STAND);
    response.send();
  }

  handleLowestRequest = async (request, response, next) => {
    await deskManager.deskController.moveToAsync(LOWEST);
    response.send();
  }

  handleIsStandingRequest = async (request, response, next) => {
    const height = await deskManager.desk.getCurrentHeightAsync();
    if (height === STAND){
      response.send(true);
      return;
    }
    response.send(false);
  }

}

export const positionRouterWrapped = new PositionRouterWrapped(deskManager, router);
