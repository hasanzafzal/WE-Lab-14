import { useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const handleRemoveItem = (id) => {
    // Remove item logic
  };

  const handlePlaceOrder = () => {
    // Place order logic
  };

  return (
    <div className="cart">
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {/* List of cart items with quantity controls and remove button */}
      </div>
      <div className="cart-summary">
        <p>Subtotal: $0.00</p>
        <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}
