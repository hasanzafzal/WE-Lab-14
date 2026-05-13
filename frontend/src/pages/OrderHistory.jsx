import { useEffect, useState } from 'react';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user's past orders
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-history">
      <h1>Order History</h1>
      <div className="orders-list">
        {/* Display past orders with status badges */}
        {orders.length === 0 && <p>No orders found</p>}
      </div>
    </div>
  );
}
