import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
    addToCartRequest,
    getCartRequest,
    removeCartItemRequest,
    updateCartItemRequest,
} from "../services/cartService";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { token } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const refreshCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setTotalQuantity(0);
            setTotalAmount(0);
            return;
        }

        try {
            const data = await getCartRequest(token);
            const items = data.items || [];
            setCartItems(items);
            setTotalQuantity(data.totalQuantity || 0);
            const calculatedTotal =
                data.totalAmount ??
                items.reduce(
                    (sum, item) => sum + Number(item.products?.price || 0) * item.quantity,
                    0
                );
            setTotalAmount(calculatedTotal);
        } catch {
            setCartItems([]);
            setTotalQuantity(0);
            setTotalAmount(0);
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

    const updateQuantity = async (cartItemId, qty) => {
        if (!token) {
            throw new Error("UNAUTHORIZED");
        }
        const result = await updateCartItemRequest(token, cartItemId, qty);
        await refreshCart();
        return result;
    };

    const removeFromCart = async (cartItemId) => {
        if (!token) {
            throw new Error("UNAUTHORIZED");
        }
        const result = await removeCartItemRequest(token, cartItemId);
        await refreshCart();
        return result;
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                totalQuantity,
                totalAmount,
                addToCart,
                updateQuantity,
                removeFromCart,
                refreshCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}