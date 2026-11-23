
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
    getProductsRequest,
    getCategoriesRequest,
    createProductRequest,
    updateProductRequest,
    deleteProductRequest,
} from "../services/adminCatalogService";

const IMAGE_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

const EMPTY_FORM = {
    product_name: "",
    price: "",
    stock: "",
    category_id: "",
    description: "",
    image: null,
};

export default function AdminProductManager() {
    const { token } = useAuth();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getProductsRequest({ page });
            setProducts(result.products);
            setPagination(result.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page]);

    const loadCategories = useCallback(async () => {
        try {
            const data = await getCategoriesRequest();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    function changeField(e) {
        const { name, value, files } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: name === "image" ? files?.[0] || null : value,
        }));
    }

    function resetForm() {
        setForm(EMPTY_FORM);
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (editingId === null && !form.image) {
            setError("Vui lòng chọn ảnh sản phẩm.");
            return;
        }

        try {
            if (editingId !== null) {
                await updateProductRequest(token, editingId, form);
                setMessage("Cập nhật sản phẩm thành công.");
            } else {
                await createProductRequest(token, form);
                setMessage("Thêm sản phẩm thành công.");
                setPage(1);
            }

            resetForm();
            await loadProducts();
        } catch (err) {
            setError(err.message);
        }
    }

    function handleEdit(product) {
        setEditingId(product.product_id);
        setForm({
            product_name: product.product_name || "",
            price: String(product.price ?? ""),
            stock: String(product.stock ?? ""),
            category_id: String(product.category_id ?? ""),
            description: product.description || "",
            image: null,
        });

        setMessage("");
        setError("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

        try {
            setError("");
            setMessage("");
            await deleteProductRequest(token, id);
            setMessage("Xóa sản phẩm thành công.");
            await loadProducts();
        } catch (err) {
            setError(err.message);
        }
    }

    function getImageUrl(image) {
        if (!image) return "";
        if (image.startsWith("http")) return image;
        return `${IMAGE_BASE_URL}${image}`;
    }

    return (
        <section className="catalog-manager">
            <h2>Quản lý sản phẩm</h2>

            <form className="catalog-form" onSubmit={handleSubmit}>
                <label>Tên sản phẩm</label>
                <input
                    name="product_name"
                    value={form.product_name}
                    onChange={changeField}
                    required
                    maxLength={225}
                    placeholder="Nhập tên sản phẩm"
                />

                <div className="form-grid">
                    <div>
                        <label>Giá (VNĐ)</label>
                        <input
                            type="number"
                            name="price"
                            min="0.01"
                            step="0.01"
                            value={form.price}
                            onChange={changeField}
                            required
                        />
                    </div>

                    <div>
                        <label>Số lượng tồn kho</label>
                        <input
                            type="number"
                            name="stock"
                            min="0"
                            step="1"
                            value={form.stock}
                            onChange={changeField}
                            required
                        />
                    </div>
                </div>

                <label>Danh mục</label>
                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={changeField}
                    required
                >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((category) => (
                        <option
                            key={category.category_id}
                            value={category.category_id}
                        >
                            {category.category_name}
                        </option>
                    ))}
                </select>

                <label>Mô tả</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={changeField}
                    rows={3}
                    placeholder="Mô tả sản phẩm"
                />

                <label>
                    Ảnh sản phẩm {editingId !== null && "(không chọn nếu giữ ảnh cũ)"}
                </label>
                <input
                    type="file"
                    name="image"
                    accept="image/png,image/jpeg"
                    onChange={changeField}
                />
                <small>Chỉ nhận JPG/PNG, dung lượng tối đa 2 MB.</small>

                <div className="catalog-actions">
                    <button type="submit" disabled={!token}>
                        {editingId !== null ? "Lưu thay đổi" : "Thêm sản phẩm"}
                    </button>

                    {editingId !== null && (
                        <button type="button" className="secondary-btn" onClick={resetForm}>
                            Hủy sửa
                        </button>
                    )}
                </div>
            </form>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <h3>Danh sách sản phẩm</h3>

            {loading ? (
                <p>Đang tải sản phẩm...</p>
            ) : (
                <div className="catalog-table-wrap">
                    <table className="catalog-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Danh mục</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7">Chưa có sản phẩm.</td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.product_id}>
                                    <td>{product.product_id}</td>
                                    <td>
                                        {product.image ? (
                                            <img
                                                className="product-admin-image"
                                                src={getImageUrl(product.image)}
                                                alt={product.product_name}
                                            />
                                        ) : "Chưa có ảnh"}
                                    </td>
                                    <td>{product.product_name}</td>
                                    <td>
                                        {Number(product.price).toLocaleString("vi-VN")} ₫
                                    </td>
                                    <td>{product.stock}</td>
                                    <td>
                                        {product.categories?.category_name ||
                                            product.category_name ||
                                            product.category_id}
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(product)}>
                                            Sửa
                                        </button>
                                        <button
                                            className="danger-btn"
                                            onClick={() => handleDelete(product.product_id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="pagination">
                <button
                    disabled={page <= 1}
                    onClick={() => setPage((current) => current - 1)}
                >
                    Trang trước
                </button>

                <span>
                    Trang {pagination.currentPage || page} / {pagination.totalPages || 1}
                </span>

                <button
                    disabled={page >= (pagination.totalPages || 1)}
                    onClick={() => setPage((current) => current + 1)}
                >
                    Trang sau
                </button>
            </div>
        </section>
    );
}
