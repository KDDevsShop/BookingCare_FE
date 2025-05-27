import ApiService from './api.service';

class StatisticService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/statistics');
  }

  async getRevenueStatistics({ year = 2025, month = null }) {
    const params = new URLSearchParams();

    if (year) params.append('year', year);

    if (month) {
      params.append('month', month);
    }

    return this.api.request(`/revenue?${params.toString()}`, 'GET');
  }

  async getAllDoctors() {
    return this.api.request('/total-doctors', 'GET');
  }

  async getTotalCompleteBookings({ year = 2025, month = null }) {
    const params = new URLSearchParams();

    if (year) params.append('year', year);

    if (month) {
      params.append('month', month);
    }

    return this.api.request(
      `/total-complete-bookings?${params.toString()}`,
      'GET'
    );
  }

  async getDoctorRevenueStatistics({
    year = 2025,
    month = null,
    top3 = 'false',
  }) {
    const params = new URLSearchParams();

    if (year) params.append('year', year);

    if (month) {
      params.append('month', month);
    }

    if (top3) {
      params.append('top3', top3);
    }

    return this.api.request(`/doctor-revenue?${params.toString()}`, 'GET');
  }

  async getTopVipPatients({ year = 2025, month = null }) {
    const params = new URLSearchParams();

    if (year) params.append('year', year);

    if (month) {
      params.append('month', month);
    }

    return this.api.request(`/top-vip-patients?${params.toString()}`, 'GET');
  }
}

export default new StatisticService();
