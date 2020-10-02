import request from 'superagent';

class SchedulerRestClient{
  constructor(request){
    this.request = request;
  }

  
};

export const schedulerRestClient = new SchedulerRestClient(request);
