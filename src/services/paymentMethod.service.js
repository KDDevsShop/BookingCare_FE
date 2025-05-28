import ApiService from "./api.service";

class PaymentMethodService {
  constructor() {
    this.api = new ApiService("http://localhost:5000/api/payment-methods");
  }

  async getAllPaymentMethods() {
    return this.api.request("/", "GET");
  }
}

export default new PaymentMethodService();
