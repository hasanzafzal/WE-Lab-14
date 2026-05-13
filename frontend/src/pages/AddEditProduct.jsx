import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: '',
  });
  const [errors, setErrors] = useState({});
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      // Fetch product data if editing
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Submit form data
    // navigate back to admin dashboard
  };

  return (
    <div className="add-edit-product">
      <h1>{isEditing ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <span className="error">{errors.description}</span>}
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <span className="error">{errors.price}</span>}
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />
        {errors.stock && <span className="error">{errors.stock}</span>}
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? 'Update Product' : 'Add Product'}</button>
      </form>
    </div>
  );
}
