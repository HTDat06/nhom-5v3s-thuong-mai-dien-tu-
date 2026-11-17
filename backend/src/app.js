const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();


const healthRoutes = require("./Routes/healthRoutes");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");

app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.get("/", (req, res) => {
  res.json({ message: "Ecommerce API is running!" });
});

app.use("/api/health", healthRoutes);
app.use("/api/health/db", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
module.exports = app;