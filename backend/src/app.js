const express = require("express");
const app = express();

const healthRoutes = require("./Routes/healthRoutes");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const cartRoutes = require('./Routes/cartRoutes');

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Ecommerce API is running!" });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/cart', cartRoutes);
module.exports = app;
