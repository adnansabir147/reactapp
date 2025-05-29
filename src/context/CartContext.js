import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // ✅ Real-time sync cart when user changes
  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, "Users", user.uid, "Cart"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCartItems(items);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // ✅ Safe addToCart
  const addToCart = async (product, quantity = 1) => {
    console.log("addToCart called, user:", user);

    if (!user) {
      console.warn("Cannot add to cart: user not logged in.");
      return;
    }

    const existing = cartItems.find((item) => item.productId === product.id);

    const cartRef = collection(db, "Users", user.uid, "Cart");

    if (existing) {
      const ref = doc(cartRef, existing.id);
      await updateDoc(ref, { quantity: existing.quantity + quantity });
    } else {
      await addDoc(cartRef, {
        productId: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity,
        stock: product.stock,
      });
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!user) return;
    const ref = doc(db, "Users", user.uid, "Cart", itemId);
    await updateDoc(ref, { quantity });
  };

  const removeFromCart = async (itemId) => {
    if (!user) return;
    const ref = doc(db, "Users", user.uid, "Cart", itemId);
    await deleteDoc(ref);
  };

  const clearCart = async () => {
    if (!user) return;
    const snapshot = await getDocs(
      collection(db, "Users", user.uid, "Cart")
    );
    snapshot.forEach(async (docSnap) => {
      await deleteDoc(docSnap.ref);
    });
  };

  const placeOrder = async () => {
    if (!user || cartItems.length === 0) {
      return { success: false, message: "User not logged in or cart is empty." };
    }
  
    try {
      const orderRef = collection(db, "Users", user.uid, "Orders");
      await addDoc(orderRef, {
        items: cartItems,
        createdAt: new Date().toISOString(),
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: "pending",
      });
  
      // Clear cart after order is placed
      await clearCart();
  
      return { success: true, message: "Order placed successfully!" };
    } catch (error) {
      console.error("Order placement failed:", error);
      return { success: false, message: "Failed to place order." };
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        placeOrder, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
