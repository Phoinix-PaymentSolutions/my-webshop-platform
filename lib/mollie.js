import { createMollieClient } from '@mollie/api-client';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export async function createMolliePayment(storeId, orderData) {
  try {
    const storeDoc = await getDoc(doc(db, 'stores', storeId));
    const store = storeDoc.data();
    
    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: orderData.total.toFixed(2)
      },
      description: `Order from ${store.name}`,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/store/${storeId}/payment/success?orderId=${orderData.orderId}`,
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhook/mollie`,
      metadata: {
        storeId: storeId,
        orderId: orderData.orderId,
        customerEmail: orderData.customerEmail
      },
      method: ['ideal', 'creditcard', 'bancontact', 'sofort', 'paypal']
    });

    await updateDoc(doc(db, 'orders', orderData.orderId), {
      molliePaymentId: payment.id,
      paymentStatus: 'pending',
      paymentUrl: payment.getCheckoutUrl()
    });

    return {
      success: true,
      paymentUrl: payment.getCheckoutUrl(),
      paymentId: payment.id
    };
  } catch (error) {
    console.error('Mollie payment creation failed:', error);
    return { success: false, error: error.message };
  }
}

export async function checkMolliePayment(paymentId) {
  try {
    const payment = await mollie.payments.get(paymentId);
    return {
      status: payment.status,
      amount: payment.amount,
      method: payment.method,
      paidAt: payment.paidAt,
      metadata: payment.metadata
    };
  } catch (error) {
    console.error('Error checking Mollie payment:', error);
    return null;
  }
}