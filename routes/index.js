import express from 'express';
import idasenController from 'idasen-controller';
import welcome from './welcome.json';
const router = express.Router();

const deskManager = idasenController.deskManager;

const SIT = 78;
const STAND = 120;
const LOWEST = 62;

class RouterWrapper {
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
    
    this.setRoute('post', '/up', this.handleUpRequest);
    this.setRoute('post', '/down', this.handleDownRequest);
    this.setRoute('post', '/moveto', this.handleMoveToRequest);
    this.setRoute('post', '/stop', this.handleStopRequest);
    
    this.setRoute('post', '/sit', this.handleSitRequest);
    this.setRoute('post', '/stand', this.handleStandRequest);
    this.setRoute('post', '/lowest', this.handleLowestRequest);
    this.setRoute('get', '/isstanding', this.handleIsStandingRequest);
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

  handleUpRequest = async (request, response, next) =>{
    await deskManager.deskController.moveUpAsync();
  }

  handleDownRequest = async (request, response, next) => {
    await deskManager.deskController.moveDownAsync();
  }

  handleMoveToRequest = async (request, response, next) => {
    console.log(request.body.height);
    await deskManager.deskController.moveToAsync(request.body.height);
    response.send();
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

  handleIsStandingRequest = async (request, response, next) => {
    const height = await deskManager.desk.getCurrentHeightAsync();
    if (height === STAND){
      response.send(true);
      return;
    }
    response.send(false);
  }

  handleStopRequest = async (request, response, next) => {
    console.log('in stop');
    await deskManager.deskController.stopAsync();
    response.send();
  }

}

export const routerWrapper = new RouterWrapper(deskManager, router);
