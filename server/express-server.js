import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {rootRouterWrapped} from '../routes/root-router.js';
import {moveRouterWrapped} from '../routes/move-router.js';
import {positionRouterWrapped} from '../routes/position-router.js';

export const app = express();

class ExpressServer{
  constructor(){
    this.app = express();

    this.initializeServer();
  }

  initializeServer = () => {
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    // this.app.use(myLogger);
    this.app.use(cookieParser());
    
    this.app.use('/', rootRouterWrapped.router);
    this.app.use('/move', moveRouterWrapped.router);
    this.app.use('/position', positionRouterWrapped.router);
  }
}

export const expressServer = new ExpressServer();

const myLogger = (req, res, next) => {
  console.log('LOGGED')
  console.log(req);
  next()
}
