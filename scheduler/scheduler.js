const {wait, scheduleRepeatableAction} = require("./schedulable-actions");

const dev = false;

const START_TIME = 8;
const END_TIME = 22;
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;

const STANDING_TIME = dev ? 30 * ONE_SECOND : 10 * ONE_MINUTE;
const BASE_INTERVAL_TIME = dev ? 60 * ONE_SECOND : ONE_HOUR;

const STAND_HEIGHT = 118;
const SIT_HEIGHT = 75;

class Scheduler{
  constructor(deskManager){
    this.deskManager = deskManager;
  }

  isInTimeBound = (time) => {
    const hour = time.getHours();
    if(hour < END_TIME && hour > START_TIME){
      return true;
    }
    return false;
  };
  
  moveToSitWithCheck = async () => {
    console.log('calling moveToSitWithCheck');
    if(this.isInTimeBound(new Date())){
      return await this.deskManager.deskController.moveToAsync(SIT_HEIGHT);
    }
  }

  moveToStandWithCheck = async () => {
    if(this.isInTimeBound(new Date())){
      return await this.deskManager.deskController.moveToAsync(STAND_HEIGHT);
    }
    return;
  }

  startSchedule = async () => {
    const now = new Date();
    const nextFullHour = this.getNextFullHour(now);
    
    const timeoutToStart = dev ? 10 * ONE_SECOND : nextFullHour - now;
    
    await wait(timeoutToStart);
      
    console.log('started main timeout');
    await this.moveToStandWithCheck();
    const moveToStandIntervalId = scheduleRepeatableAction(BASE_INTERVAL_TIME, this.moveToStandWithCheck);

    console.log('waiting for as long as should stand');
    console.log(STANDING_TIME);
    await wait(STANDING_TIME);

    console.log('started sit timeout');
    await this.moveToSitWithCheck();
    const moveToSitIntervalId = scheduleRepeatableAction(BASE_INTERVAL_TIME, this.moveToSitWithCheck);

    return { 
      moveToSitIntervalId, 
      moveToStandIntervalId 
    };
  }
  
  getNextFullHour = (now) => {
    const fullHour = new Date();
    fullHour.setHours(now.getHours() + 1, 0);
    return fullHour;
  }

};

module.exports = {Scheduler};
