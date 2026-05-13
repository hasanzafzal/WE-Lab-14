import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { productAPI } from '../utils/api';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert('Product deleted successfully');
      } catch (err) {
        alert('Failed to delete product');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-actions">
          <Link to="/admin/product" className="btn btn-primary add-product-btn">
            + Add Product
          </Link>
        </div>

        <div className="products-table-section">
          {products.length === 0 ? (
            <p>No products found. <Link to="/admin/product">Add your first product</Link></p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id.substring(0, 8)}...</td>
                    <td className="product-name">{product.name}</td>
                    <td className="product-price">Rs. {product.price.toFixed(2)}</td>
                    <td className="product-stock">{product.stock}</td>
                    <td className="product-description">
                      {(product.description || 'No description').substring(0, 50)}...
                    </td>
                    <td className="product-actions">
                      <Link
                        to={`/admin/product/${product._id}`}
                        className="btn btn-secondary edit-btn"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="btn btn-danger delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
