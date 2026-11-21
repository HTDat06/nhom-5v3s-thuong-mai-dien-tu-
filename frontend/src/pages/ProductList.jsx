import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/ProductList.css";

const API_URL = "http://localhost:5000/api";

function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 12
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lấy danh mục từ Backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/categories`);
                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(result.message || "Không thể tải danh mục.");
                }

                setCategories(Array.isArray(result.data) ? result.data : []);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };

        fetchCategories();
    }, []);

    // Lấy sản phẩm theo điều kiện trên URL
    const queryString = searchParams.toString();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams(queryString);

                if (!params.get("page")) {
                    params.set("page", "1");
                }

                // Backend quy định 12 sản phẩm mỗi trang
                params.set("limit", "12");

                const response = await fetch(
                    `${API_URL}/products?${params.toString()}`
                );

                const result = await response.json();

                if (!response.ok || result.success === false) {
                    throw new Error(
                        result.message || "Không thể tải danh sách sản phẩm."
                    );
                }

                setProducts(Array.isArray(result.data) ? result.data : []);

                setPagination(
                    result.pagination || {
                        currentPage: 1,
                        totalPages: 1,
                        totalProducts: 0,
                        limit: 12
                    }
                );
            } catch (error) {
                console.error("Lỗi tải sản phẩm:", error);
                setError(error.message || "Đã xảy ra lỗi khi tải sản phẩm.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [queryString]);

    // Cập nhật bộ lọc và quay về trang 1
    const updateFilter = (key, value) => {
        const newParams = new URLSearchParams(searchParams);

        if (value === "") {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }

        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    // Chuyển trang, giữ nguyên các bộ lọc
    const changePage = (page) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("page", String(page));
        setSearchParams(newParams);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const currentPage = Number(searchParams.get("page")) || 1;

    return (
        <div className="product-list-page">
            <div className="product-list-heading"></div>

            {/* Bộ lọc sản phẩm */}
            <div className="product-filter">
                <div className="filter-item">
                    <label htmlFor="category">Danh mục</label>
                    <select
                        id="category"
                        value={searchParams.get("category_id") || ""}
                        onChange={(e) =>
                            updateFilter("category_id", e.target.value)
                        }
                    >
                        <option value="">Tất cả danh mục</option>

                        {categories.map((category) => (
                            <option
                                key={category.category_id}
                                value={category.category_id}
                            >
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label htmlFor="minPrice">Giá thấp nhất</label>
                    <input
                        id="minPrice"
                        type="number"
                        min="0"
                        placeholder="Từ giá"
                        value={searchParams.get("min_price") || ""}
                        onChange={(e) =>
                            updateFilter("min_price", e.target.value)
                        }
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="maxPrice">Giá cao nhất</label>
                    <input
                        id="maxPrice"
                        type="number"
                        min="0"
                        placeholder="Đến giá"
                        value={searchParams.get("max_price") || ""}
                        onChange={(e) =>
                            updateFilter("max_price", e.target.value)
                        }
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="sort">Sắp xếp</label>
                    <select
                        id="sort"
                        value={searchParams.get("sort") || ""}
                        onChange={(e) =>
                            updateFilter("sort", e.target.value)
                        }
                    >
                        <option value="">Mặc định</option>
                        <option value="price_asc">Giá tăng dần</option>
                        <option value="price_desc">Giá giảm dần</option>
                        <option value="newest">Mới nhất</option>
                    </select>
                </div>

                <button
                    type="button"
                    className="reset-filter-btn"
                    onClick={() => setSearchParams({})}
                >
                    Xóa bộ lọc
                </button>
            </div>

            <div className="product-list-toolbar">
                <h2>Tất cả sản phẩm</h2>
                <span>{pagination.totalProducts} sản phẩm</span>
            </div>

            {/* Danh sách sản phẩm */}
            {loading ? (
                <p className="product-message">Đang tải sản phẩm...</p>
            ) : error ? (
                <p className="product-message error">{error}</p>
            ) : products.length === 0 ? (
                <p className="product-message">
                    Không tìm thấy sản phẩm phù hợp.
                </p>
            ) : (
                <div className="product-list-grid">
                    {products.map((product) => (
                        <ProductCard
                            key={product.product_id ?? product.id}
                            product={product}
                        />
                    ))}
                </div>
            )}

            {/* Phân trang */}
            {!loading && !error && pagination.totalPages > 1 && (
                <div className="product-pagination">
                    <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => changePage(currentPage - 1)}
                    >
                        Trang trước
                    </button>

                    {Array.from(
                        { length: pagination.totalPages },
                        (_, index) => index + 1
                    ).map((page) => (
                        <button
                            type="button"
                            key={page}
                            className={
                                currentPage === page ? "active" : ""
                            }
                            onClick={() => changePage(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={currentPage >= pagination.totalPages}
                        onClick={() => changePage(currentPage + 1)}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductList;