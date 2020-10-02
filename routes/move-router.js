import express from 'express';
import idasenController from 'idasen-controller';
const router = express.Router();

const deskManager = idasenController.deskManager;

class MoveRouterWrapped {
  constructor(deskManager, router){
    this.deskManager = deskManager;
    this.router = router;

    this.setRoutes();
  }

  setRoute = (httpType, path, callback) => {
    this.router[httpType](path, callback);
  }

  setRoutes = () => {
    this.setRoute('post', '/up', this.handleUpRequest);
    this.setRoute('post', '/down', this.handleDownRequest);
    this.setRoute('post', '/to', this.handleMoveToRequest);
    this.setRoute('post', '/stop', this.handleStopRequest);
  }

  handleUpRequest = async (request, response, next) =>{
    await deskManager.deskController.moveUpAsync();
    response.sendCode(200);
  }

  handleDownRequest = async (request, response, next) => {
    await deskManager.deskController.moveDownAsync();
    response.sendCode(200);
  }

  handleMoveToRequest = async (request, response, next) => {
    console.log(request.body.height);
    await deskManager.deskController.moveToAsync(request.body.height);
    response.send();
  }

  handleStopRequest = async (request, response, next) => {
    console.log('in stop');
    await deskManager.deskController.stopAsync();
    response.send();
  }

}

export const moveRouterWrapped = new MoveRouterWrapped(deskManager, router);
