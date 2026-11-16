
const express = require("express");
const cors = require("cors");
const app = express();

const healthRoutes = require("./Routes/healthRoutes");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Ecommerce API is running!" });
});

app.use("/api/health", healthRoutes);
app.use("/api/health/db", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", categoryRoutes);

module.exports = app;
