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
// Combine imports to avoid "already been declared" errors
import { db, auth } from './components/firebase/firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]); 
  const [featuredProducts, setFeaturedProducts] = useState([]); 
  const [adminLoggedIn, setAdminLoggedIn] = useState(false); 

  const navigateToScreen = (screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (email) => {
    setUser({ email, name: email.split('@')[0] });
    setCurrentScreen('home');
  };

  const handleSignup = async (email, password) => {
    try {
      // Ensure 'auth' is correctly imported above
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user); 
      alert("Signup successful! Please check your email to verify your account.");
    } catch (error) {
      console.error("Signup error:", error.message);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('home');
  };

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
  };

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), orderBy("name"));
        const snapshot = await getDocs(q);
        const allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(allProducts);
        
        const featured = allProducts.filter(p => p.featured);
        setFeaturedProducts(featured);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

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
          onSelectCategory={setSelectedCategory}
          cartItemCount={cartItemCount}
          featuredProducts={featuredProducts} 
        />
      ) : currentScreen === 'login' ? (
        <LoginScreen onNavigate={navigateToScreen} onLogin={handleLogin} />
      ) : currentScreen === 'signup' ? (
        <SignupScreen onNavigate={navigateToScreen} onSignup={handleSignup} />
      ) : currentScreen === 'products' ? (
        <ProductsPage
          onNavigate={navigateToScreen}
          user={user}
          onViewProduct={viewProduct}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          cartItemCount={cartItemCount}
          allProducts={products} 
        />
      ) : currentScreen === 'product-detail' && selectedProduct ? (
        <ProductDetailPage
          onNavigate={navigateToScreen}
          user={user}
          product={selectedProduct}
          onAddToCart={addToCart}
          cartItemCount={cartItemCount}
        />
      ) : currentScreen === 'cart' ? (
        <CartPage
          onNavigate={navigateToScreen}
          user={user}
          cart={cart}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeFromCart} 
        />
      ) : currentScreen === 'profile' ? (
        <ProfilePage
          onNavigate={navigateToScreen}
          user={user}
          onLogout={handleLogout}
        />
      ) : null}
    </div>
  );
}