const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const idasenController = require('idasen-controller');

const indexRouter = require('./routes/index');

const {deskManager} = idasenController;

const app = express();

const myLogger = (req, res, next) => {
  console.log('LOGGED')
  console.log(req);
  next()
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(myLogger);
app.use(cookieParser());

app.use('/', indexRouter);

const startTime = 8;
const endTime = 22;

const isInTimeBound = (time) => {
  const hours = time.getHours();
  if(hours < endTime && hours > startTime){
    return true;
  }
  return false;
};

const scheduler = async () => {
  console.log('in scheduler');
  const now = new Date();
  const fullHour = new Date();
  fullHour.setHours(now.getHours()+1, 0)
  console.log(now);
  console.log(fullHour);
  console.log(now.getMinutes());
  
  const timeoutToStart = fullHour - now;
  console.log(timeoutToStart);
  
  const ONE_SECOND = 1000;
  const ONE_MINUTE = 60 * ONE_SECOND;
  const ONE_HOUR = 60 * ONE_MINUTE;
  return new Promise((resolve, rejesct) => {
    setTimeout(async () => {
      console.log('started main timeout');
      await deskManager.desk.moveToAsync(118);
      setInterval(async () => {
        if(isInTimeBound(new Date().getHours())){
          console.log('moving up');
          await deskManager.desk.moveToAsync(118);
        }
      }, ONE_HOUR);
      setTimeout(async ()=>{
        console.log('started sit timeout');
        await deskManager.desk.moveToAsync(75);
        setInterval(async ()=>{
          if(isInTimeBound(new Date().getHours())){
            console.log('moving down');
            await deskManager.desk.moveToAsync(75);
          }
        }, ONE_HOUR);
      }, 15 * ONE_MINUTE);
    }, 
    timeoutToStart
    // 10000
    );
  })
}

scheduler();

console.log('after scheduler');

process.on('SIGINT', async () => {
  await deskManager.disconnectAsync(deskManager.desk);
  process.exit(0);
});

module.exports = app;
