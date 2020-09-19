const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const idasenController = require('idasen-controller');

const indexRouter = require('./routes/index');

const {deskManager} = idasenController;

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

process.on('SIGINT', async () => {
  await deskManager.disconnectAsync(deskManager.desk);
  process.exit(0);
});

module.exports = app;
