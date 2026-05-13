import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../utils/api';

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
    rating: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      setFormData(response.data);
    } catch (err) {
      alert('Failed to fetch product');
      console.error(err);
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };

      if (isEditing) {
        await productAPI.update(id, productData);
        alert('Product updated successfully');
      } else {
        await productAPI.create(productData);
        alert('Product created successfully');
      }
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading...</p></div>;
  }

  return (
    <div className="add-edit-product">
      <div className="container">
        <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Product name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Product description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              rows="5"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (Rs.) *</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="0.00"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? 'error' : ''}
              />
              {errors.stock && <span className="error-text">{errors.stock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (0-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                placeholder="4.5"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
