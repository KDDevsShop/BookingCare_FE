import ApiService from "./api.service";

class BookingService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/bookings");
  }

  async createBooking(data) {
    return this.api.request(`/`, "POST", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getBookingById(id) {
    return this.api.request(`/${id}`, "GET");
  }

  async getAllBookingsByPatientId(patientId) {
    return this.api.request(`/patient/${patientId}/histories`, "GET");
  }
}

export default new BookingService();
