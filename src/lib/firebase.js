import { db } from '../../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

export async function getStoreConfig(subdomain) {
  try {
    const storeDoc = await getDoc(doc(db, 'stores', subdomain));
    if (storeDoc.exists()) {
      return { id: storeDoc.id, ...storeDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching store config:', error);
    return null;
  }
}

export async function getStoreProducts(storeId) {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      where('storeId', '==', storeId),
      where('active', '==', true)
    );
    const snapshot = await getDocs(productsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function createOrder(orderData) {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending',
      paymentStatus: 'awaiting_payment'
    });
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, status, paymentData = null) {
  try {
    const updateData = {
      status,
      updatedAt: serverTimestamp()
    };
    
    if (paymentData) {
      updateData.paymentStatus = paymentData.status;
      updateData.paymentMethod = paymentData.method;
      updateData.paidAt = paymentData.paidAt;
    }
    
    await updateDoc(doc(db, 'orders', orderId), updateData);
    return true;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
}