import React, { useState, useEffect } from 'react';
// Components
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import ProfilePage from './components/ProfilePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

// Firebase Config and Auth
import { db, auth } from './components/firebase/firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]); 
  const [featuredProducts, setFeaturedProducts] = useState([]); 
  const [wishlist, setWishlist] = useState([]);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  // --- Navigation ---
  const navigateToScreen = (screen) => {
    setCurrentScreen(screen);
  };

  // --- Logic Functions ---
  const toggleWishlist = (product) => {
    setWishlist((prev) => prev.find(i => i.id === product.id) 
      ? prev.filter(i => i.id !== product.id) : [...prev, product]);
  };

  const sendToWhatsApp = (cartItems, total, phone) => {
    const msg = `*New Order Alert!*%0A%0A*Customer:* ${user?.email}%0A*Items:*%0A${cartItems.map(i => `• ${i.product.name} (x${i.quantity})`).join('%0A')}%0A%0A*Total:* KSh ${total.toLocaleString()}`;
    window.open(`https://wa.me/2547281154?text=${msg}`, '_blank');
  };

  const viewProduct = (product) => { 
    setSelectedProduct(product); 
    setCurrentScreen('product-detail'); 
  };

    const handleLogout = () => {
  setUser(null); // Clear user data
  setCurrentScreen('home'); // Reset view to homepage
};

  const handleSignup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user); 
      alert("Signup successful! Please check your email to verify your account.");
      setCurrentScreen('login');
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    }
  };

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      return exists ? prev.map(i => i.product.id === product.id ? {...i, quantity: i.quantity + quantity} : i) : [...prev, {product, quantity}];
    });
  };

  // --- Fetch Products ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("name"));
        const snap = await getDocs(q);
        const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(all);
        setFeaturedProducts(all.filter(p => p.featured));
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

const updateProfile = (newData) => {
  setUser(prev => ({ ...prev, ...newData }));

};

  return (
    <div className="min-h-screen bg-background">
      {adminLoggedIn ? (
        <AdminPanel />
      ) : currentScreen === 'admin-login' ? (
        <AdminLogin onLoginSuccess={() => setAdminLoggedIn(true)} />
      ) : currentScreen === 'home' ? (
        <HomePage 
          onNavigate={navigateToScreen} 
          user={user} 
          onViewProduct={viewProduct} 
          featuredProducts={featuredProducts} 
          cartItemCount={cart.length} 
        />
      ) : currentScreen === 'products' ? (
        <ProductsPage 
          onNavigate={navigateToScreen} 
          user={user} 
          onViewProduct={viewProduct} 
          allProducts={products} 
          cartItemCount={cart.length} 
        />
      ) : currentScreen === 'product-detail' ? (
        <ProductDetailPage 
          onNavigate={navigateToScreen} 
          user={user} 
          product={selectedProduct} 
          onAddToCart={addToCart} 
          cartItemCount={cart.length} 
          toggleWishlist={toggleWishlist} 
          isFavorite={wishlist.some(p => p.id === selectedProduct?.id)} 
        />
      ) : currentScreen === 'cart' ? (
        <CartPage 
          onNavigate={navigateToScreen} 
          user={user} 
          cart={cart} 
          onUpdateQuantity={(id, q) => setCart(prev => prev.map(i => i.product.id === id ? {...i, quantity: q} : i))} 
          onRemoveItem={id => setCart(prev => prev.filter(i => i.product.id !== id))} 
          sendToWhatsApp={sendToWhatsApp} 
        />
      ) : currentScreen === 'profile' ? (
        <ProfilePage 
          onNavigate={navigateToScreen} 
          user={user} 
          onLogout={handleLogout}
          wishlist={wishlist} 
          onUpdateProfile={updateProfile}
          onViewProduct={viewProduct} 
        />
      ) : currentScreen === 'login' ? (
        <LoginScreen 
          onNavigate={navigateToScreen} 
          onLogin={u => {setUser({email: u, name: u.split('@')[0]}); setCurrentScreen('home');}} 
        />
      ) : currentScreen === 'signup' ? (
        <SignupScreen 
          onNavigate={navigateToScreen} 
          onSignup={handleSignup} 
        />
      ) : null}
    </div>
  );
}