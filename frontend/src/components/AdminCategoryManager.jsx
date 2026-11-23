
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
    getCategoriesRequest,
    createCategoryRequest,
    updateCategoryRequest,
    deleteCategoryRequest,
} from "../services/adminCatalogService";

export default function AdminCategoryManager() {
    const { token } = useAuth();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getCategoriesRequest();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    function resetForm() {
        setName("");
        setDescription("");
        setEditingId(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        const data = {
            category_name: name.trim(),
            description: description.trim(),
        };

        try {
            if (editingId !== null) {
                await updateCategoryRequest(token, editingId, data);
                setMessage("Cập nhật danh mục thành công.");
            } else {
                await createCategoryRequest(token, data);
                setMessage("Thêm danh mục thành công.");
            }

            resetForm();
            await loadCategories();
        } catch (err) {
            setError(err.message);
        }
    }

    function handleEdit(category) {
        setEditingId(category.category_id);
        setName(category.category_name || "");
        setDescription(category.description || "");
        setMessage("");
        setError("");
    }

    async function handleDelete(id) {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;

        try {
            setError("");
            setMessage("");
            await deleteCategoryRequest(token, id);
            setMessage("Xóa danh mục thành công.");

            if (editingId === id) resetForm();
            await loadCategories();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <section className="catalog-manager">
            <h2>Quản lý danh mục</h2>

            <form className="catalog-form" onSubmit={handleSubmit}>
                <label>Tên danh mục</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên danh mục"
                    required
                    maxLength={225}
                />

                <label>Mô tả</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả danh mục"
                    rows={3}
                />

                <div className="catalog-actions">
                    <button type="submit" disabled={!token}>
                        {editingId !== null ? "Lưu thay đổi" : "Thêm danh mục"}
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

            <div className="catalog-table-wrap">
                {loading ? (
                    <p>Đang tải danh mục...</p>
                ) : (
                    <table className="catalog-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên danh mục</th>
                                <th>Mô tả</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="4">Chưa có danh mục.</td>
                                </tr>
                            ) : categories.map((category) => (
                                <tr key={category.category_id}>
                                    <td>{category.category_id}</td>
                                    <td>{category.category_name}</td>
                                    <td>{category.description || "—"}</td>
                                    <td>
                                        <button onClick={() => handleEdit(category)}>
                                            Sửa
                                        </button>
                                        <button
                                            className="danger-btn"
                                            onClick={() => handleDelete(category.category_id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}
