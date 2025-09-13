import { createOrder } from '../../../../lib/firebase';
import { createMolliePayment } from '../../../../lib/mollie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items, total, customerInfo, storeId } = req.body;

    // Validate required fields
    if (!items || !total || !customerInfo || !storeId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create order in Firebase
    const orderId = await createOrder({
      storeId,
      customerEmail: customerInfo.email,
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      shippingAddress: customerInfo.address,
      items,
      total,
      currency: 'EUR'
    });

    // Create Mollie payment
    const paymentResult = await createMolliePayment(storeId, {
      orderId,
      total,
      customerEmail: customerInfo.email
    });

    if (!paymentResult.success) {
      return res.status(500).json({ error: paymentResult.error });
    }

    return res.status(200).json({
      success: true,
      orderId,
      paymentUrl: paymentResult.paymentUrl,
      paymentId: paymentResult.paymentId
    });

  } catch (error) {
    console.error('Checkout creation failed:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}