const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const idasenController = require('idasen-controller');

const indexRouter = require('./routes/index');

const deskEngine = idasenController.deskManager;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

deskEngine.init();

process.on('SIGINT', async () => {
  await deskEngine.disconnect(deskEngine.desk);

  process.exit(0);
});

module.exports = app;
