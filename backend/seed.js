const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  description: String,
  rating: Number,
});

const Product = mongoose.model("Product", productSchema);

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