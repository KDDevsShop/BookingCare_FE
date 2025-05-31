import ApiService from './api.service';

class BookingService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/bookings');
  }

  async createBooking(data) {
    return this.api.request(`/`, 'POST', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async getBookingById(id) {
    return this.api.request(`/${id}`, 'GET');
  }

  async getAllBookingsByPatientId(patientId) {
    return this.api.request(`/patient/${patientId}/histories`, 'GET');
  }

  async cancelBooking(id) {
    return this.api.request(`/${id}/cancel`, 'PATCH');
  }

  // Add a method to get all bookings by doctorId
  async getAllBookingsByDoctorId(doctorId) {
    return this.api.request(`/doctor/${doctorId}`, 'GET');
  }

  // Confirm a booking by id
  async confirmBooking(bookingId) {
    return this.api.request(
      `/confirm`,
      'PUT',
      { bookingId },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // Get all bookings (admin)
  async getAllBookings() {
    return this.api.request(`/`, 'GET');
  }
}

export default new BookingService();
