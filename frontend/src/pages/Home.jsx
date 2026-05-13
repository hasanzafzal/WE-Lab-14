import { useState } from 'react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="home">
      <h1>Product Listing</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearch}
      />
      {/* Grid of product cards will be rendered here */}
      <div className="product-grid">
        {/* Products will be displayed as cards */}
      </div>
    </div>
  );
}
