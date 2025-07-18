import { TPayment } from "./payment.interface";
import { PaymentModel } from "./payment.model";

  const createPayment = async (data: TPayment) =>{
    const payment = await PaymentModel.create(data);
    return payment;
  }

  const updatePaymentStatus = async (
    paymentId: string,
    status: TPayment["status"],
    transactionId?: string
  ) =>{
    return PaymentModel.findByIdAndUpdate(
      paymentId,
      { status, transactionId, paidAt: new Date() },
      { new: true }
    );
  }

  const getPaymentById = async (paymentId: string)=> {
    return PaymentModel.findById(paymentId);
  }


export const PaymentServices = {
    createPayment,
    updatePaymentStatus,
    getPaymentById
}
