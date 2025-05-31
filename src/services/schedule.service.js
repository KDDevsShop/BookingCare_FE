import ApiService from './api.service';

class ScheduleService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/schedules');
  }

  async getAllSchedules() {
    return this.api.request(`/`, 'GET');
  }
}

export default new ScheduleService();
