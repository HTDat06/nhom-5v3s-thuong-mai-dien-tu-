import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { addToCartRequest, getCartRequest } from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const refreshCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setTotalQuantity(0);
            return;
        }

        try {
            const data = await getCartRequest(token);
            setCartItems(data.items || []);
            setTotalQuantity(data.totalQuantity || 0);
        } catch {
            setCartItems([]);
            setTotalQuantity(0);
        }
    }, [token]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId, qty = 1) => {
        if (!token) {
            throw new Error("UNAUTHORIZED");
        }
        const result = await addToCartRequest(token, productId, qty);
        await refreshCart();
        return result;
    };

    return (
        <CartContext.Provider value={{ cartItems, totalQuantity, addToCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}