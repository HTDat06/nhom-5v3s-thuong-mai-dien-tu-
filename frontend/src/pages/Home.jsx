import ProductCard from "../components/ProductCard";
import { products } from "../data/product";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

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
                <h2>Sản phẩm nổi bật</h2>

                <div className="product-list">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;