import ApiService from './api.service';

class DoctorScheduleService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/doctor-schedules');
  }

  async getAllWorkSchdules() {
    return this.api.request('/', 'GET');
  }

  async getSchedulesByDoctorId(doctorId) {
    return this.api.request(`/work-schedules/${doctorId}`, 'GET');
  }

  async createSchedule(doctorId, scheduleId, workDate, isConfirmed = false) {
    return this.api.request(
      '/',
      'POST',
      { doctorId, scheduleId, workDate, isConfirmed },
      {
        'Content-Type': 'application/json',
      }
    );
  }

  async approve(id) {
    return this.api.request(`/approve/${id}`, 'PUT');
  }

  async reject(id) {
    return this.api.request(`/reject/${id}`, 'PUT');
  }
}

export default new DoctorScheduleService();
