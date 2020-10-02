import express from 'express';
import idasenController from 'idasen-controller';
import welcome from './welcome.json';
const router = express.Router();

const deskManager = idasenController.deskManager;

const SIT = 78;
const STAND = 120;

class RootRouterWrapped {
  constructor(deskManager, router){
    this.deskManager = deskManager;
    this.router = router;

    this.setRoutes();
  }


  setRoute = (httpType, path, callback) => {
    this.router[httpType](path, callback);
  }

  setRoutes = () => {
    this.setRoute('get', '/', this.handleRootRequest);
    this.setRoute('get', '/scan', this.handleScanRequest);
    this.setRoute('post', '/connect', this.handleConnectRequest);
    this.setRoute('post', '/disconnect', this.handleDisconnectRequest);
    this.setRoute('get', '/height', this.handleHeightRequest);
    this.setRoute('get', '/state', this.handleStateRequest);
  }

  handleRootRequest = (request, response) => response.json(welcome);

  handleScanRequest = async (request, response, next) => {
    const discoveredPeripherals = await deskManager.getAvailableDevices();
    response.json(discoveredPeripherals);
  }

  handleConnectRequest = async (request, response, next) =>{
    const result = await deskManager.connectAsync(request.body.address);
    response.json(result);
  }
  
  handleDisconnectRequest = async (request, response, next) =>{
    const result = await deskManager.disconnectAsync();
    response.json(result);
  }

  handleHeightRequest = async (request, response, next) => {
    const height = await deskManager.desk.getCurrentHeightAsync();
    response.json({height});
  }

  handleStateRequest = async (request, response, next) => {
    const height = await deskManager.desk.getCurrentHeightAsync();
    if (height === SIT){
      response.json({sit: true});
      return;
    }
    if (height === STAND){
      response.json({stand: true});
      return;
    }
    response.json({height});
  }

}

export const rootRouterWrapped = new RootRouterWrapped(deskManager, router);
