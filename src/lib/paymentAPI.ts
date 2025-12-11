import api from "./api";

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: "MOMO" | "VNPAY" | "COD";
  customerEmail: string;
  description?: string;
  returnUrl: string;
}

export interface PaymentResponse {
  orderId: string;
  transactionId: string;
  amount: number;
  paymentMethod: "MOMO" | "VNPAY" | "COD";
  status: "PENDING" | "COMPLETED" | "FAILED";
  paymentUrl?: string;
  responseCode?: string;
  responseMessage?: string;
}

export const paymentAPI = {
  createPayment: (data: PaymentRequest) => 
    api.post<PaymentResponse>("/payments", data),
  
  getPaymentStatus: (orderId: string) => 
    api.get<PaymentResponse>(`/payments/${orderId}`),
};
