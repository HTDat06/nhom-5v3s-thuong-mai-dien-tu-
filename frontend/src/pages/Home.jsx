
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/products",
                    {
                        params: {
                            page: 1,
                            limit: 8
                        }
                    }
                );

                console.log("Dữ liệu sản phẩm:", response.data);

                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error(
                    "Lỗi lấy sản phẩm:",
                    error.response?.data || error.message
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="home-container">

            <section className="banner">
                <h1>Chào mừng đến với PC Store</h1>
                <p>Khám phá các linh kiện máy tính chất lượng</p>
                <button onClick={() => navigate("/products")}>
                    Xem sản phẩm
                </button>
            </section>

            <section className="products-section">
                <h2>Sản phẩm mới nhất</h2>

                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : products.length === 0 ? (
                    <p>Chưa có sản phẩm nào.</p>
                ) : (
                    <div className="product-list">
                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}

export default Home;
