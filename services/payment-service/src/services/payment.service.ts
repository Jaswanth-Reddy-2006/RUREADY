import { prisma } from '../lib/prisma.js';
import { NotFoundError, BadRequestError } from '../lib/errors.js';
import { v4 as uuidv4 } from 'uuid';

export const paymentService = {
  async getPlans() {
    return [
      {
        id: 'plan_starter',
        name: 'Starter Tier',
        price: 19,
        currency: 'USD',
        interval: 'MONTHLY',
        features: ['5 Mock Oral Interviews / mo', 'Unlimited Coding Execution', 'Basic AI Feedback'],
      },
      {
        id: 'plan_pro',
        name: 'Pro Career Tier',
        price: 49,
        currency: 'USD',
        interval: 'MONTHLY',
        features: ['Unlimited Oral & Coding Interviews', 'STAR Method Analysis', 'Telemetry Eye-Contact Metrics', 'Priority Support'],
      },
    ];
  },

  async createPayment(userId: string, planId: string) {
    const plans = await this.getPlans();
    const plan = plans.find((p) => p.id === planId);
    if (!plan) {
      throw new BadRequestError('Invalid plan ID selected');
    }

    const orderId = `ord_${uuidv4()}`;
    const providerOrderId = `pay_prov_${uuidv4()}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        userId,
        planId: plan.id,
        amount: plan.price,
        currency: plan.currency,
        status: 'CREATED',
        providerOrderId,
      },
    });

    return {
      order,
      checkoutUrl: `https://checkout.ru-ready.com/pay/${order.id}`,
    };
  },

  async verifyPayment(userId: string, orderId: string, paymentId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundError('Payment order not found');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: order.planId === 'plan_pro' ? 'PRO' : 'STARTER',
        status: 'ACTIVE',
        currentPeriodEnd: periodEnd,
      },
      create: {
        userId,
        plan: order.planId === 'plan_pro' ? 'PRO' : 'STARTER',
        status: 'ACTIVE',
        currentPeriodEnd: periodEnd,
      },
    });

    return { success: true, order: updatedOrder };
  },

  async getHistory(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async handleWebhook(payload: any) {
    console.log('[Payment Webhook] Event received:', payload?.event || 'generic');
    return { received: true };
  },
};
