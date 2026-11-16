
import ProductCard from "../components/ProductCard";
import { products } from "../data/product";
import "../styles/ProductList.css";

function ProductList() {
    return (
        <div className="product-list-page">
            <div className="product-list-heading">
                <h1>Danh sách linh kiện máy tính</h1>
                <p>Khám phá các linh kiện máy tính chất lượng.</p>
            </div>

            <div className="product-list-toolbar">
                <h2>Tất cả sản phẩm</h2>
                <span>{products.length} sản phẩm</span>
            </div>

            <div className="product-list-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProductList;
