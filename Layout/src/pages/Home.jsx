function Home() {
    const products = [
    {
        id: 1,
        name: "RTX 4060",
        category: "VGA",
        price: "7.500.000đ",
        image: "https://placehold.co/300x220?text=RTX+4060"
    },
    {
        id: 2,
        name: "Corsair Vengeance DDR5",
        category: "RAM",
        price: "2.200.000đ",
        image: "https://placehold.co/300x220?text=RAM+DDR5"
    },
    {
        id: 3,
        name: "AMD Ryzen 5 7600",
        category: "CPU",
        price: "4.500.000đ",
        image: "https://placehold.co/300x220?text=Ryzen+5"
    }
];
    return (
        <div className="home-container">

            <section className="banner">
                <h1>Chào mừng đến với MyShop</h1>
                <p>Khám phá các sản phẩm công nghệ mới nhất</p>
                <button>Xem sản phẩm</button>
            </section>

            <section className="products-section">
                <h2>Sản phẩm nổi bật</h2>

                <div className="product-list">
                    {products.map((product) => (
                        <div className="product-card" key={product.id}>

                            <img
                                src={product.image}
                                alt={product.name}
                            />

                            <h3>{product.name}</h3>

                            <p className="price">
                                {product.price}
                            </p>

                            <button>Xem chi tiết</button>

                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}

export default Home;