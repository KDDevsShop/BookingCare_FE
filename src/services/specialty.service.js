import ApiService from "./api.service";

class SpecialtyService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/specialties");
  }

  async getAllSpecialties() {
    return this.api.request("/", "GET");
  }
}

export default new SpecialtyService();
