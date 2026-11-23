import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
    return (
        <div className="app">
            <div className="top-fixed">
            <Header />

            <Navbar />
            </div>

            <main className="main-content">
                {children}
            </main>

            <Footer />

        </div>
    );
}

export default MainLayout;
