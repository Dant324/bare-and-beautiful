import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Heart, Star, ArrowRight, User, ChevronLeft, ChevronRight } from 'lucide-react';
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
  
  // Ref for horizontal scroll container
  const scrollRef = useRef(null);

  const handleCategoryClick = (categoryId) => {
    onSelectCategory(categoryId);
    onNavigate('products');
  };

  // Scroll logic for buttons
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pQuery = query(collection(db, "products"), where("featured", "==", true));
        const pSnapshot = await getDocs(pQuery);
        setFeaturedProducts(pSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

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
            <h1 className="text-xl font-bold text-primary cursor-pointer" onClick={() => onNavigate('home')}>
              Bare and Beautiful Skincare
            </h1>

            <div className="hidden md:block max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search for products..." className="pl-10 bg-input-background h-10 rounded-full border-none shadow-sm" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')} className="hidden md:flex">
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
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
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs rounded-full">
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
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
              Discover Your <br /> <span className="text-pink-600 italic">Natural Glow</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed">
              Premium skincare, fragrance, and hair care products curated for your beauty. Shop top brands with expert recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-slate-900 text-black hover:bg-slate-800 rounded-full px-10 h-14 font-bold"
                onClick={() => onNavigate('products')}
              >
                Shop Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full px-10 h-14 font-bold">
                View Tips
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1625499554890-687b49f24259"
              alt="Glowing skin skincare"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-[3rem] shadow-2xl"
            />
          </motion.div>
        </div>
      </motion.section>
      
      {/* FEATURED PRODUCTS - SCROLL BUTTONS & HOVER POP */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="py-16 bg-white overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h3 className="text-3xl font-bold tracking-tight">Featured Essentials</h3>
              <p className="text-muted-foreground mt-1 font-medium italic">Hand-picked boutique favorites</p>
            </div>
            <div className="flex items-center gap-4">
               {/* Button to Products Page */}
              <Button 
                variant="link" 
                className="text-pink-600 font-bold hidden sm:flex items-center gap-2 hover:no-underline hover:text-pink-700"
                onClick={() => onNavigate('products')}
              >
                View Full Catalog <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full border-slate-200 hover:bg-pink-50 hover:text-pink-600"
                  onClick={() => scroll('left')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full border-slate-200 hover:bg-pink-50 hover:text-pink-600"
                  onClick={() => scroll('right')}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
               {[1,2,3,4].map(i => <div key={i} className="min-w-[280px] h-[420px] bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
            </div>
          ) : (
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar scroll-smooth"
            >
              {featuredProducts.map((product) => {
                const discount = product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

                return (
                  <motion.div 
                    key={product.id} 
                    className="min-w-[280px] md:min-w-[320px] snap-start"
                    whileHover={{ scale: 1.05, y: -10 }} // Hover Pop logic
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Card 
                      className="cursor-pointer group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden rounded-[2.5rem] border-slate-100 shadow-sm"
                      onClick={() => onViewProduct(product)}
                    >
                      <CardContent className="p-0 flex flex-col h-full bg-white">
                        {/* CONSISTENT SIZE CONTAINER - FIXED STRETCHING */}
                        <div className="relative aspect-square w-48 bg-white flex items-center justify-center p-6 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            /* object-contain ensures the image fits inside the square without stretching */
                            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
                          />
                          {discount && (
                            <Badge className="absolute top-6 left-6 bg-red-600 text-black font-black px-2.5 py-1 rounded-full text-[10px] shadow-lg border-none">
                              {discount}% OFF
                            </Badge>
                          )}
                        </div>

                        <div className="p-8 flex flex-col flex-grow justify-between bg-white">
                          <div className="space-y-3">
                            {/* Boutique Brown Brand */}
                            <p className="text-[11px] text-[#8B4513] font-black uppercase tracking-[0.15em]">
                              {product.brand}
                            </p>
                            <h4 className="font-bold text-xl text-slate-800 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
                              {product.name}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 mt-8">
                            <span className="font-black text-slate-900 text-2xl tracking-tighter">
                              KSh {product.price?.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-slate-300 line-through font-medium italic">
                                KSh {product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
          
          {/* Mobile view catalog button */}
          <div className="mt-4 sm:hidden">
            <Button 
              className="w-full rounded-2xl h-14 bg-pink-50 text-pink-600 font-bold border-none"
              onClick={() => onNavigate('products')}
            >
              Shop All Products <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Community Section */}
      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-pink-100 text-pink-600 border-none mb-4 px-4 py-1.5 rounded-full font-bold">Community feedback</Badge>
            <h3 className="text-4xl font-bold mb-4 tracking-tight">Our Glowing Customers</h3>
            <p className="text-muted-foreground text-lg italic">Real results from our premium skincare boutique</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {latestReviews.map((rev) => (
              <motion.div 
                key={rev.id} 
                className="p-8 bg-white rounded-[2.5rem] text-left border border-slate-100 shadow-sm"
                whileHover={{ y: -8, shadow: "0 10px 30px rgba(0,0,0,0.05)" }}
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400 border-none' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-8 leading-relaxed text-sm">"{rev.comment}"</p>
                <div className="flex items-center gap-3">
                   <div className="w-8 h-[1px] bg-slate-200" />
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{rev.userName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Boutique Newsletter */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[4rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent" />
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Stay Radiantly Updated</h3>
            <p className="text-slate-400 mb-12 max-w-lg mx-auto text-lg leading-relaxed">Join our boutique circle for first access to product launches and beauty secrets.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative z-10">
              <Input placeholder="Enter your email" className="bg-slate-800 border-none h-16 rounded-2xl text-white px-6 placeholder:text-slate-500 focus-visible:ring-pink-500" />
              <Button className="bg-pink-600 hover:bg-pink-700 text-white h-16 rounded-2xl px-12 font-black uppercase text-xs tracking-widest shadow-xl shadow-pink-900/20 transition-all active:scale-95">Subscribe</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold mb-8 text-2xl tracking-tighter text-slate-900 italic underline decoration-pink-500 decoration-4 underline-offset-8">Bare and Beautiful</h4>
              <p className="text-sm text-muted-foreground leading-loose">
                Premium destination for curated skincare and fragrance. We believe in beauty crafted for your natural radiance.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h5 className="font-black mb-2 text-slate-900 uppercase text-[10px] tracking-[0.2em] opacity-50">Shop Categories</h5>
              <ul className="space-y-4 text-sm text-muted-foreground font-bold">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button onClick={() => handleCategoryClick(cat.id)} className="hover:text-pink-600 transition-colors">{cat.name}</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h5 className="font-black mb-2 text-slate-900 uppercase text-[10px] tracking-[0.2em] opacity-50">Boutique Support</h5>
              <ul className="space-y-4 text-sm text-muted-foreground font-bold">
                <li><button onClick={() => onNavigate('contact')} className="hover:text-pink-600 transition-colors">Contact Us</button></li>
                <li><button onClick={() => onNavigate('faq')} className="hover:text-pink-600 transition-colors">Boutique Help</button></li>
                <li><button onClick={() => onNavigate('returns')} className="hover:text-pink-600 transition-colors">Returns</button></li>
                <li><button onClick={() => onNavigate('shipping')} className="hover:text-pink-600 transition-colors">Shipping</button></li>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h5 className="font-black mb-2 text-slate-900 uppercase text-[10px] tracking-[0.2em] opacity-50">Follow Radiance</h5>
              <ul className="space-y-4 text-sm text-muted-foreground font-bold">
                <li><a href="#" className="hover:text-pink-600 transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-pink-600 transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>

          <div
            className="mt-20 pt-10 border-t border-slate-100 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] cursor-pointer hover:text-slate-900 transition-colors"
            onClick={() => onNavigate('admin-login')}
          >
            © 2024 Bare and Beautiful Boutique. Radiance, Redefined.
          </div>
        </div>
      </footer>
    </div>
  );
}