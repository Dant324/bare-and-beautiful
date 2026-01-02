import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Heart, Star, ArrowRight, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

import { db } from "./firebase/firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";

const categories = [
  { id: 'skincare', name: 'Skincare', icon: '✨' },
  { id: 'fragrance', name: 'Fragrance', icon: '🌸' },
  { id: 'haircare', name: 'Hair Care', icon: '💆‍♀️' },
  { id: 'bodycare', name: 'Body Care', icon: '🌿' },
];

export default function HomePage({ onNavigate, user, onViewProduct, onSelectCategory, cartItemCount }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    onNavigate('products');
  };

  useEffect(() => {
    // Fetch products and reviews directly from Firestore
    const fetchData = async () => {
      try {
        setLoading(true);
        // Products query
        const pQuery = query(collection(db, "products"), where("featured", "==", true));
        const pSnapshot = await getDocs(pQuery);
        setFeaturedProducts(pSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Latest high-rated reviews query
        const rQuery = query(
          collection(db, "reviews"), 
          where("rating", ">=", 4), 
          orderBy("date", "desc"), 
          limit(4)
        );
        const rSnapshot = await getDocs(rQuery);
        setLatestReviews(rSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">Bare and Beautiful Skincare</h1>

            <div className="hidden md:block max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search for products..." className="pl-10 bg-input-background" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')} className="hidden md:flex">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                  <Button variant="ghost" size="sm" className="md:hidden" onClick={() => onNavigate('profile')}>
                    <User className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
              )}

              <Button variant="ghost" size="sm" className="relative" onClick={() => onNavigate('cart')}>
                <ShoppingBag className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

     {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative py-16 md:py-24 bg-gradient-to-br from-pink-50 to-orange-50"
      >
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Discover Your <span className="text-pink-600">Glow</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-md">
              Premium skincare, fragrance, and hair care products to enhance your natural beauty. Shop from top brands with expert recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
                onClick={() => onNavigate('products')}
              >
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Beauty Tips
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1625499554890-687b49f24259"
              alt="Beautiful woman with glowing skin"
              className="w-full h-80 md:h-96 object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="py-16 bg-muted/30"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold">Featured Products</h3>
            <Button variant="outline" onClick={() => onNavigate('products')}>
              View All
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading products...</p>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">No featured products available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
{featuredProducts.map((product) => {
  // Calculate the actual percentage discount
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Card 
      key={product.id} 
      className="cursor-pointer hover:shadow-lg transition-all flex flex-col h-full overflow-hidden rounded-2xl border-none shadow-sm"
      onClick={() => onViewProduct(product)}
    >
      <CardContent className="p-0 flex flex-col h-full">
        {/* Aspect-square ensures consistency across all screen sizes */}
        <div className="relative aspect-square bg-white flex items-center justify-center p-4 overflow-hidden border-b border-slate-50">
          <img
            src={product.image}
            alt={product.name}
            /* Object-contain prevents image stretching on mobile */
            className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
          />
          
          {/* Dynamic Badge: Displays calculated percentage */}
          {discountPercentage && (
            <Badge className="absolute top-4 left-3 bg-red-600 text-black font-bold px-2 py-1 rounded-full text-[10px]">
              {discountPercentage}% OFF
            </Badge>
          )}
          
        </div>

        <div className="p-4 flex flex-col flex-grow justify-between bg-white">
          <div>
            <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest mb-1">
              {product.brand}
            </p>
            <h4 className="font-bold text-sm text-slate-800 line-clamp-2 leading-tight">
              {product.name}
            </h4>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="font-bold text-slate-900 text-base">
              KSh {product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 line-through">
                KSh {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
})}
</div>
          )}
        </div>
      </motion.section>

      {/* Dynamic Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">What Our Customers Say</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestReviews.map((rev) => (
              <div key={rev.id} className="p-6 bg-pink-50/50 rounded-[2rem] text-left border border-pink-100">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-pink-500 text-pink-500' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-sm italic mb-4">"{rev.comment}"</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">— {rev.userName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <motion.section initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }} className="py-16 bg-gradient-to-r from-pink-600 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Stay Updated with Beauty Tips</h3>
          <p className="text-pink-100 mb-6 max-w-md mx-auto">Get the latest beauty trends, product launches, and exclusive offers delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Enter your email" className="bg-white border-0" />
            <Button className="bg-white text-pink-600 hover:bg-pink-50">Subscribe</Button>
          </div>
        </div>
      </motion.section>

{/* Footer */}
<footer className="py-8 border-t border-border">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-4 gap-6">
      <div>
        <h4 className="font-bold mb-3">Bare and Beautiful</h4>
        <p className="text-sm text-muted-foreground">
          Your trusted partner for premium skincare, bodycare fragrance, and hair care products.
        </p>
      </div>

      <div>
        <h5 className="font-medium mb-3">Categories</h5>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {
                  onSelectCategory(cat.id);
                  onNavigate('products');
                }}
                className="hover:underline text-left w-full"
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-medium mb-3">Support</h5>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><button onClick={() => onNavigate('contact')} className="hover:underline w-full text-left">Contact Us</button></li>
          <li><button onClick={() => onNavigate('faq')} className="hover:underline w-full text-left">FAQ</button></li>
          <li><button onClick={() => onNavigate('returns')} className="hover:underline w-full text-left">Returns</button></li>
          <li><button onClick={() => onNavigate('shipping')} className="hover:underline w-full text-left">Shipping</button></li>
        </ul>
      </div>

      <div>
        <h5 className="font-medium mb-3">Connect</h5>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="https://instagram.com/bareandbeautifulskincare" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
          <li><a href="https://facebook.com/bareandbeautifulskincare" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
          <li><a href="https://tiktok.com/@bareandbeautifulskincare" target="_blank" rel="noopener noreferrer" className="hover:underline">TikTok</a></li>
        </ul>
      </div>
    </div>

   <div
  className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground cursor-pointer select-none"
  onClick={() => onNavigate('admin-login')}
  title="Secret Admin Access"
>
  © 2024 Bare and Beautiful. All rights reserved.
</div>

  </div>
</footer>
    </div>
  );
}