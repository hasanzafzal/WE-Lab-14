import { useParams } from 'react-router-dom';
import { useState } from 'react';

export default function ProductDetail() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add to cart logic
  };

  return (
    <div className="product-detail">
      <h1>Product Detail</h1>
      <p>Product ID: {id}</p>
      {/* Full product info, stock indicator, quantity selector, and Add to Cart button */}
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
