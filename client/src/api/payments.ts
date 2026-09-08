import apiClient from './client';
import { PaymentPlan, PaymentOrder, PaymentVerificationRequest } from '@ru-ready/shared';

export const paymentsApi = {
  async getPlans(): Promise<PaymentPlan[]> {
    const response = await apiClient.get<PaymentPlan[]>('/payments/plans');
    return response.data;
  },

  async createCheckout(planId: string): Promise<{ order: PaymentOrder; checkoutUrl: string }> {
    const response = await apiClient.post<{ order: PaymentOrder; checkoutUrl: string }>('/payments/checkout', { planId });
    return response.data;
  },

  async verifyPayment(verification: PaymentVerificationRequest): Promise<{ success: boolean; order: PaymentOrder }> {
    const response = await apiClient.post<{ success: boolean; order: PaymentOrder }>('/payments/verify', verification);
    return response.data;
  },

  async getHistory(): Promise<PaymentOrder[]> {
    const response = await apiClient.get<PaymentOrder[]>('/payments/history');
    return response.data;
  },
};
