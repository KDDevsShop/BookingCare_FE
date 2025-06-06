import ApiService from './api.service';

class AuthService {
  constructor() {
    this.api = new ApiService('http://localhost:5000/api/auth');
  }

  async login(data) {
    try {
      const response = await this.api.request('/login', 'POST', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      throw error;
    }
  }

  async signup(data) {
    try {
      // Send JSON directly, do not use FormData
      const response = await this.api.request('/sign-up', 'POST', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error when signing up:', error);
      throw error;
    }
  }

  async resetPassword(data) {
    try {
      const response = await this.api.request('/reset-password', 'POST', data);
      return response.data;
    } catch (error) {
      console.error('Error when resetting password:', error);
      throw error;
    }
  }

  async forgotPassword(data) {
    try {
      const response = await this.api.request('/forgot-password', 'POST', data);
      return response.data;
    } catch (error) {
      console.error('Error when resetting password:', error);
      throw error;
    }
  }

  async changePassword(accountId, oldPassword, newPassword) {
    try {
      const response = await this.api.request('/change-password', 'POST', {
        accountId,
        oldPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error('Error when changing password:', error);
      throw error;
    }
  }
}
export default new AuthService();
