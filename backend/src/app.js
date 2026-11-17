
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Cấu hình CORS cho React Vite
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Hiển thị ảnh từ thư mục uploads
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "../uploads")
    )
);

// Trang kiểm tra Backend
app.get("/", (req, res) => {
    res.json({ message: "Ecommerce API is running!" });
});

// Import Routes
const healthRoutes = require("./Routes/healthRoutes");
const authRoutes = require("./Routes/authRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const categoryRoutes = require("./Routes/categoryRoutes");
const productRoutes = require("./Routes/productRoutes");

// Khai báo API
app.use("/api/health", healthRoutes);
app.use("/api/health/db", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin/categories", categoryRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
