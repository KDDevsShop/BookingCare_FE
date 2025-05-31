import ApiService from './api.service';

class PatientService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/patients');
  }

  async getAllPatients() {
    return this.api.request('/', 'GET');
  }

  async getPatientById(id) {
    return this.api.request(`/${id}`, 'GET');
  }

  async updatePatient(id, data, userAvatarFile) {
    // If userAvatarFile is provided, use FormData for file upload
    if (userAvatarFile) {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      formData.append('userAvatar', userAvatarFile);
      return this.api.request(`/${id}`, 'PUT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // No file, send JSON
      return this.api.request(`/${id}`, 'PUT', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }

  async deletePatient(id) {
    return this.api.request(`/${id}`, 'DELETE');
  }
}

export default new PatientService();
