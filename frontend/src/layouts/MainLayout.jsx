
import { useLocation } from "react-router-dom";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <div className="app">
            <div className="top-fixed">
                <Header />

                {!isAdminPage && <Navbar />}
            </div>

            <main className="main-content">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;
