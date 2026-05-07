const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
});

const Product = mongoose.model("Product", productSchema);

// Sample Products
const products = [
  { name: "Laptop", price: 1200, category: "Electronics", stock: 5 },
  { name: "Phone", price: 800, category: "Electronics", stock: 10 },
  { name: "Headphones", price: 150, category: "Accessories", stock: 15 },
  { name: "Keyboard", price: 70, category: "Accessories", stock: 20 },
  { name: "Mouse", price: 40, category: "Accessories", stock: 25 },
  { name: "Monitor", price: 300, category: "Electronics", stock: 7 },
  { name: "Chair", price: 180, category: "Furniture", stock: 6 },
  { name: "Desk", price: 250, category: "Furniture", stock: 4 },
  { name: "Tablet", price: 500, category: "Electronics", stock: 8 },
  { name: "Smart Watch", price: 220, category: "Wearables", stock: 12 },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await Product.deleteMany();
    console.log("Old products removed");

    await Product.insertMany(products);
    console.log("Sample products inserted");

    mongoose.connection.close();
  })
  .catch((err) => console.log(err));