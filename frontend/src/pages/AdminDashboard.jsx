import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products for admin
    setLoading(false);
  }, []);

  const handleDeleteProduct = (id) => {
    // Delete product logic
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <Link to="/admin/product" className="btn btn-primary">
        Add Product
      </Link>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Display all products with Edit and Delete buttons */}
        </tbody>
      </table>
    </div>
  );
}
