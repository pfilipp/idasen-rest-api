var express = require('express');
const idasenController = require('idasen-controller');
const welcome = require('./welcome.json');
var router = express.Router();

const deskManager = idasenController.deskManager;

const SIT = 75;
const STAND = 118;

router.get('/', function(req, res, next) {
  res.json(welcome);
});

router.get('/scan', async (req, res, next) => {
  const discoveredPeripherals = await deskManager.scan();
  res.json(discoveredPeripherals);
});

router.post('/connect', async (req, res, next) =>{
  const result = await deskManager.connect(req.body.address);
  res.json(result);
});

router.post('/disconnect', async (req, res, next) =>{
  const result = await deskManager.disconnect();
  res.json(result);
});

router.post('/up', async (req, res, next) =>{
  await deskManager.desk.moveUp();
});

router.post('/down', async (req, res, next) => {
  await deskManager.desk.moveDown();
});

router.post('/to', async (req, res, next) => {
  await deskManager.desk.moveTo(req.body.height);
  res.send();
});

router.post('/sit', async (req, res, next) => {
  await deskManager.desk.moveTo(SIT);
  res.send();
});

router.post('/stand', async (req, res, next) => {
  await deskManager.desk.moveTo(STAND);
  res.send();
});

router.get('/height', async (req, res, next) => {
  const height = await deskManager.desk.getCurrentHeight();
  res.json({height});
});

router.get('/state', async (req, res, next) => {
  const height = await deskManager.desk.getCurrentHeight();
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
  const height = await deskManager.desk.getCurrentHeight();
  if (height === STAND){
    res.send(true);
    return;
  }
  res.send(false);
});

router.post('/stop', async (req, res, next) => {
  console.log('in stop');
  await deskManager.desk.stop();
  res.send();
});

module.exports = router;
