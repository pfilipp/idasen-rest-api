const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const idasenController = require('idasen-controller');

const indexRouter = require('./routes/index');
const { Scheduler } = require('./scheduler/scheduler');

const { deskManager } = idasenController;

const app = express();

const myLogger = (req, res, next) => {
  console.log('LOGGED')
  console.log(req);
  next()
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(myLogger);
app.use(cookieParser());

app.use('/', indexRouter);

// const scheduler = new Scheduler(deskManager);

// const ids = scheduler.startSchedule();
// console.log(ids);

// deskManager.addCustomDisconnectHandler(scheduler.restartSchedule);

process.on('SIGINT', async () => {
  await deskManager.disconnectAsync(deskManager.desk);
  process.exit(0);
});

module.exports = app;
