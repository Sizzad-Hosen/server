declare module 'sslcommerz-lts' {
  // You can declare the minimal class shape you use here
  class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);
    init(data: any): Promise<any>;
  }

  export default SSLCommerzPayment;
}
