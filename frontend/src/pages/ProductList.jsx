
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../styles/ProductList.css";

const API_URL = "http://localhost:5000/api";

function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 12
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Lấy sản phẩm theo danh mục và trang trên URL
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

                setProducts(
                    Array.isArray(result.data) ? result.data : []
                );

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

    // Chuyển trang, giữ nguyên danh mục đang chọn
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

            {/* Tiêu đề danh sách sản phẩm */}
            <div className="product-list-toolbar">
                <h2>Tất cả sản phẩm</h2>
                <span>{pagination.totalProducts} sản phẩm</span>
            </div>

            {/* Danh sách sản phẩm */}
            {loading ? (
                <p className="product-message">
                    Đang tải sản phẩm...
                </p>
            ) : error ? (
                <p className="product-message error">
                    {error}
                </p>
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
