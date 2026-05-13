import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { productAPI } from '../utils/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = products.filter(
      (product) =>
        (product.name || '').toLowerCase().includes(term) ||
        (product.description || '').toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
    alert('Product added to cart!');
  };

  if (loading) return <div className="container"><p>Loading products...</p></div>;
  if (error) return <div className="container"><p className="error">{error}</p></div>;

  return (
    <div className="home">
      <div className="container">
        <h1>Our Products</h1>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <p className="no-results">No products found matching your search.</p>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product._id || product.id} className="product-card">
                <div className="product-image">
                  {product.image && <img src={product.image} alt={product.name} />}
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{(product.description || '').substring(0, 100)}...</p>
                  <div className="product-footer">
                    <div className="price-rating">
                      <span className="price">Rs. {product.price.toFixed(2)}</span>
                      {product.rating && <span className="rating">★ {product.rating}</span>}
                    </div>
                    <div className="stock-status">
                      {product.stock > 0 ? (
                        <span className="in-stock">In Stock ({product.stock})</span>
                      ) : (
                        <span className="out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>
                  <div className="product-actions">
                    <Link to={`/products/${product._id || product.id}`} className="btn btn-secondary">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="btn btn-primary"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
