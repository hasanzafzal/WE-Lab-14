import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { productAPI } from '../utils/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to fetch product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert(`${product.name} added to cart!`);
    navigate('/cart');
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!product) return <div className="container"><p>Product not found</p></div>;

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate('/')} className="btn btn-secondary back-btn">
          ← Back to Products
        </button>

        <div className="detail-content">
          <div className="product-image-section">
            {product.image && <img src={product.image} alt={product.name} />}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            
            <div className="product-meta">
              <span className="price">Rs. {product.price.toFixed(2)}</span>
              {product.rating && <span className="rating">★ {product.rating}/5</span>}
            </div>

            <div className="stock-indicator">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                disabled={product.stock === 0}
              >
                {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary add-to-cart-btn"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
