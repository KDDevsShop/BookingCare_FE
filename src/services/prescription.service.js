import ApiService from './api.service';

class PrescriptionService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/prescriptions');
  }

  async createPrescription(data, imageFile) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (imageFile) {
      formData.append('prescriptionImage', imageFile);
    }
    return this.api.request(`/`, 'POST', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updatePrescription(id, data, imageFile) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (imageFile) {
      formData.append('prescriptionImage', imageFile);
    }
    return this.api.request(`/${id}`, 'PUT', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async getPrescriptionById(id) {
    return this.api.request(`/${id}`, 'GET');
  }

  async sendPrescriptionEmail(bookingId, prescriptionId) {
    return this.api.request('/send-email', 'POST', {
      bookingId,
      prescriptionId,
    });
  }
}

export default new PrescriptionService();
