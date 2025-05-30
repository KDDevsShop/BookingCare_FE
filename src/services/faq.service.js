import ApiService from './api.service';

class FAQService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/faqs');
  }

  async getAllFAQs() {
    return this.api.request(`/`, 'GET');
  }

  async getFAQById(id) {
    return this.api.request(`/${id}`, 'GET');
  }

  async createFAQ(data) {
    return this.api.request(`/`, 'POST', data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async updateFAQ(id, data) {
    return this.api.request(`/${id}`, 'PUT', data, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async deleteFAQ(id) {
    return this.api.request(`/${id}`, 'DELETE');
  }
}

export default new FAQService();
