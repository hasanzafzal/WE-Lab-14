const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ecommerceDB")
  .then(async () => {
    try {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash("admin123", salt);

      const existingAdmin = await User.findOne({ email: "admin@autostore.com" });
      if (!existingAdmin) {
        await User.insertOne({
          name: "Admin User",
          email: "admin@autostore.com",
          password: hashedPassword,
          isAdmin: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log("✅ Admin user created!");
      } else {
        console.log("ℹ️ Admin exists!");
      }
      console.log("📧 Email: admin@autostore.com");
      console.log("🔑 Password: admin123");
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      mongoose.connection.close();
    }
  });
