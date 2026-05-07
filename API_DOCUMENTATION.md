# Ecommerce Backend API Documentation

## Overview
This is a complete backend API for an ecommerce platform inspired by PakWheels AutoStore. It includes authentication, product management, and order handling.

## Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or connection string)

### Installation
```bash
npm install
```

### Environment Variables (.env)
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerceDB
JWT_SECRET=mysecretkey
```

### Running the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

---

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
**POST** `/api/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

---

#### Login User
**POST** `/api/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

---

### Product Routes (`/api/products`)

#### Get All Products (with Search & Filter)
**GET** `/api/products`

Query Parameters:
- `search` - Search in name or description
- `category` - Filter by category
- `minPrice` - Filter products with price >= minPrice
- `maxPrice` - Filter products with price <= maxPrice
- `sort` - Sort by field (format: `field:asc` or `field:desc`)

Examples:
```
GET /api/products
GET /api/products?search=car
GET /api/products?category=sedan
GET /api/products?minPrice=500000&maxPrice=2000000
GET /api/products?sort=price:asc
```

Response (200):
```json
[
  {
    "_id": "product_id",
    "name": "Toyota Corolla",
    "description": "Sedan vehicle",
    "price": 1500000,
    "category": "sedan",
    "stock": 10,
    "image": "url",
    "rating": 4.5,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### Get Single Product
**GET** `/api/products/:id`

Response (200):
```json
{
  "_id": "product_id",
  "name": "Toyota Corolla",
  "description": "Sedan vehicle",
  "price": 1500000,
  "category": "sedan",
  "stock": 10,
  "image": "url",
  "rating": 4.5,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

#### Create Product (Admin Only)
**POST** `/api/products`

Headers:
```
Authorization: Bearer <jwt_token>
```

Request Body:
```json
{
  "name": "Toyota Corolla",
  "description": "A reliable sedan",
  "price": 1500000,
  "category": "sedan",
  "stock": 10,
  "image": "image_url",
  "rating": 4.5
}
```

Response (201):
```json
{
  "message": "Product created successfully",
  "product": { /* product object */ }
}
```

---

#### Update Product (Admin Only)
**PUT** `/api/products/:id`

Headers:
```
Authorization: Bearer <jwt_token>
```

Request Body:
```json
{
  "name": "Updated Name",
  "price": 1600000,
  "stock": 15
}
```

Response (200):
```json
{
  "message": "Product updated successfully",
  "product": { /* updated product object */ }
}
```

---

#### Delete Product (Admin Only)
**DELETE** `/api/products/:id`

Headers:
```
Authorization: Bearer <jwt_token>
```

Response (200):
```json
{
  "message": "Product deleted successfully"
}
```

---

### Order Routes (`/api/orders`)

#### Place Order
**POST** `/api/orders`

Headers:
```
Authorization: Bearer <jwt_token>
```

Request Body:
```json
{
  "products": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main Street, City, Country",
  "paymentMethod": "cash_on_delivery"
}
```

Response (201):
```json
{
  "message": "Order placed successfully",
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "products": [
      {
        "product": "product_id",
        "quantity": 2,
        "price": 1500000
      }
    ],
    "totalPrice": 3000000,
    "status": "pending",
    "shippingAddress": "123 Main Street, City, Country",
    "paymentMethod": "cash_on_delivery",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

#### Get My Orders
**GET** `/api/orders/my-orders`

Headers:
```
Authorization: Bearer <jwt_token>
```

Response (200):
```json
[
  {
    "_id": "order_id",
    "user": { /* user details */ },
    "products": [ /* populated product details */ ],
    "totalPrice": 3000000,
    "status": "pending",
    "shippingAddress": "123 Main Street, City, Country",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### Get All Orders (Admin Only)
**GET** `/api/orders`

Headers:
```
Authorization: Bearer <jwt_token>
```

Response (200):
```json
[
  {
    "_id": "order_id",
    "user": { /* user details */ },
    "products": [ /* populated product details */ ],
    "totalPrice": 3000000,
    "status": "pending",
    "shippingAddress": "123 Main Street, City, Country",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

#### Update Order Status (Admin Only)
**PUT** `/api/orders/:id/status`

Headers:
```
Authorization: Bearer <jwt_token>
```

Request Body:
```json
{
  "status": "confirmed"
}
```

Valid Status Values:
- `pending`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`

Response (200):
```json
{
  "message": "Order status updated successfully",
  "order": { /* updated order object */ }
}
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The token is obtained from either `/api/auth/register` or `/api/auth/login` endpoints.

---

## Features Implemented

✅ User registration with bcrypt password hashing
✅ User login with JWT authentication
✅ JWT verification middleware
✅ Admin role-based access control
✅ Product CRUD operations (Create, Read, Update, Delete)
✅ Product search and filtering (by name, category, price)
✅ Product sorting
✅ Order placement with inventory management
✅ Get user's orders
✅ Admin: Get all orders
✅ Admin: Update order status

---

## Error Handling

Common error responses:

**401 Unauthorized**
```json
{
  "message": "No token provided" / "Invalid or expired token"
}
```

**403 Forbidden**
```json
{
  "message": "Admin access required"
}
```

**404 Not Found**
```json
{
  "message": "Product not found" / "Order not found"
}
```

**400 Bad Request**
```json
{
  "message": "Please provide all required fields" / "Invalid status"
}
```

**500 Internal Server Error**
```json
{
  "message": "error message"
}
```

---

## Testing with Postman

1. **Register User**: POST to `/api/auth/register` with name, email, password
2. **Copy the JWT token** from response
3. **Create Product**: POST to `/api/products` with token (as admin user)
4. **Place Order**: POST to `/api/orders` with token
5. **Update Order**: PUT to `/api/orders/:id/status` with new status (admin only)

---

## Database Models

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `isAdmin` (Boolean, default: false)
- `timestamps`

### Product
- `name` (String, required)
- `description` (String, required)
- `price` (Number, required)
- `category` (String, required)
- `stock` (Number, default: 0)
- `image` (String)
- `rating` (Number, 0-5, default: 0)
- `timestamps`

### Order
- `user` (ObjectId, ref: User)
- `products` (Array of {product, quantity, price})
- `totalPrice` (Number, required)
- `status` (String: pending, confirmed, shipped, delivered, cancelled)
- `shippingAddress` (String, required)
- `paymentMethod` (String: credit_card, debit_card, cash_on_delivery)
- `timestamps`
