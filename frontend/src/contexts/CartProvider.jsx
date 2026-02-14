import { useEffect, useState } from "react";
import CartContext from "./CartContext";


export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        // Load from localStorage at startup
        const saved = localStorage.getItem("cart_items");
        return saved ? JSON.parse(saved) : [];
    });


    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);


    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem("cart_items", JSON.stringify(items));
    }, [items]);


    function addToCart(product) {
        setItems(prev => {
            const exists = prev.find(item => item._id === product._id);
            console.log(product);
            if (exists) {
                return prev.map(item =>
                    item._id === product._id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                );
            }
            return [...prev,{...product, qty: 1 }];

        });
    }

    function removeFromCart(id) {
        setItems(prev => prev.filter(item => item._id !== id));
    }


    function clearCart() {
        setItems([]);
    }

    function updateQty(product, quantity) {
        setItems(prev => {
            return prev.map(item =>
                item._id === product._id
                    ? { ...item, qty:  quantity }
                    : item
            );
        }
        );
    }
    return (
        <CartContext.Provider value={{ items, total, addToCart, removeFromCart, clearCart, updateQty }}>
            {children}
        </CartContext.Provider>
    );

}