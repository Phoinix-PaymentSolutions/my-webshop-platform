import { createMollieClient } from '@mollie/api-client';
import { updateOrderStatus } from '../../../lib/firebase';

const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id: paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID required' });
    }

    // Get payment details from Mollie
    const payment = await mollie.payments.get(paymentId);
    
    const orderId = payment.metadata?.orderId;
    if (!orderId) {
      console.error('No order ID found in payment metadata');
      return res.status(400).json({ error: 'Order ID not found' });
    }

    // Update order status based on payment status
    let orderStatus = 'pending';
    let paymentData = null;

    if (payment.status === 'paid') {
      orderStatus = 'confirmed';
      paymentData = {
        status: 'paid',
        method: payment.method,
        paidAt: new Date(payment.paidAt)
      };
    } else if (payment.status === 'failed' || payment.status === 'canceled') {
      orderStatus = 'cancelled';
      paymentData = {
        status: payment.status,
        method: payment.method,
        paidAt: null
      };
    }

    // Update order in Firebase
    await updateOrderStatus(orderId, orderStatus, paymentData);

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}