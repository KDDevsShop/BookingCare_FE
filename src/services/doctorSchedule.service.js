import ApiService from "./api.service";

class DoctorScheduleService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/doctor-schedules");
  }

  async getSchedulesByDoctorId(doctorId) {
    return this.api.request(`/doctor/${doctorId}`, "GET");
  }
}

export default new DoctorScheduleService();
