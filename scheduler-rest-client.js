import request from 'superagent';

const schedulerUrl = 'http://localhost:3002';

const RESET_SCHEDULE_ENDPOINT = '/resetschedule';

class SchedulerRestClient{
  constructor(request){
    this.request = request;
  }

  resetSchedule = async () => {

  }
  
};

export const schedulerRestClient = new SchedulerRestClient(request);
