var express = require('express');
const idasenController = require('idasen-controller');
const welcome = require('./welcome.json');
var router = express.Router();

const deskManager = idasenController.deskManager;

const SIT = 75;
const STAND = 118;
const LOWEST = 62;

router.get('/', function(req, res, next) {
  res.json(welcome);
});

router.get('/scan', async (req, res, next) => {
  const discoveredPeripherals = await deskManager.getAvailableDevices();
  res.json(discoveredPeripherals);
});

router.post('/connect', async (req, res, next) =>{
  const result = await deskManager.connectAsync(req.body.address);
  res.json(result);
});

router.post('/disconnect', async (req, res, next) =>{
  const result = await deskManager.disconnectAsync();
  res.json(result);
});

router.post('/up', async (req, res, next) =>{
  await deskManager.deskController.moveUpAsync();
});

router.post('/down', async (req, res, next) => {
  await deskManager.deskController.moveDownAsync();
});

router.post('/to', async (req, res, next) => {
  console.log(req.body.height);
  await deskManager.deskController.moveToAsync(req.body.height);
  res.send();
});

router.post('/sit', async (req, res, next) => {
  await deskManager.deskController.moveToAsync(SIT);
  res.send();
});

router.post('/stand', async (req, res, next) => {
  await deskManager.deskController.moveToAsync(STAND);
  res.send();
});

router.post('/lowest', async (req, res, next) => {
  await deskManager.deskController.moveToAsync(LOWEST);
  res.send();
});

router.get('/height', async (req, res, next) => {
  const height = await deskManager.desk.getCurrentHeightAsync();
  res.json({height});
});

router.get('/state', async (req, res, next) => {
  const height = await deskManager.desk.getCurrentHeightAsync();
  if (height === SIT){
    res.json({sit: true});
    return;
  }
  if (height === STAND){
    res.json({stand: true});
    return;
  }
  res.json({height});
});

router.get('/isstanding', async (req, res, next) => {
  const height = await deskManager.desk.getCurrentHeightAsync();
  if (height === STAND){
    res.send(true);
    return;
  }
  res.send(false);
});

router.post('/stop', async (req, res, next) => {
  console.log('in stop');
  await deskManager.deskController.stopAsync();
  res.send();
});

module.exports = router;
