import ApiService from "./api.service";

class DoctorService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/doctors");
  }

  async getAllDoctors() {
    return this.api.request("/", "GET");
  }

  async getDoctorById(id) {
    return this.api.request(`/${id}`, "GET");
  }

  async createDoctor(data, userAvatarFile) {
    if (userAvatarFile) {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      formData.append("userAvatar", userAvatarFile);
      return this.api.request(`/`, "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      return this.api.request(`/`, "POST", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  async updateDoctor(id, data, userAvatarFile) {
    if (userAvatarFile) {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      formData.append("userAvatar", userAvatarFile);
      return this.api.request(`/${id}`, "PUT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      return this.api.request(`/${id}`, "PUT", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  async deleteDoctor(id) {
    return this.api.request(`/${id}`, "DELETE");
  }
}

export default new DoctorService();
