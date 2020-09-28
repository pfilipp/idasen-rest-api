
const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const  scheduleRepeatableAction = (repeatInterval, action) => {
  console.log('scheduling action');
    let result;
    const intervalId = setInterval(async () => {
      try{
        result = await action();
      } catch(error){
        error && console.error(error);
      }
    }, repeatInterval);
    return {result, intervalId}
  }

  const scheduleSingleAction = (actionDelay, action) => {
    let timeoutId;
    const promise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try{
          const result = await action();
          resolve(result);
        } catch(error){
          reject(error);
        }
      }, actionDelay);
    }) 
    return { promise, timeoutId }
  }

  module.exports = {
    wait,
    scheduleRepeatableAction, 
    scheduleSingleAction
  }