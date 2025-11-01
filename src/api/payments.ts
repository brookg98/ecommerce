import axiosClient from './axiosClient';

export interface PaymentIntentRequest {
  order_id: number;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export const paymentsAPI = {
  createIntent: (data: PaymentIntentRequest) =>
    axiosClient.post<PaymentIntentResponse>('/payments/create-intent', data),
};
