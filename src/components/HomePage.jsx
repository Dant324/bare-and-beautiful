import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Star,
  ArrowRight,
  User,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

import { db } from "./firebase/firebase";
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";

const categories = [
  { id: "skincare", name: "SKINCARE", icon: Sparkles },
  { id: "moisturizers", name: "MOISTURIZERS", icon: Sparkles },
  { id: "sunscreen", name: "SUNSCREEN", icon: Sparkles },
  { id: "cleansers", name: "CLEANSERS", icon: Sparkles },
];

const popularBrands = [
  "COSRX",
  "JUMISO",
  "INNISFREE",
  "LANEIGE",
  "ETUDE",
  "BEAUTY OF JOSEON",
  "EQUABERRY",
];

export default function HomePage({
  onNavigate,
  user,
  onViewProduct,
  onSelectCategory,
  cartItemCount,
}) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollRef = useRef(null);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onNavigate("products", { search: searchQuery });
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;

      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const pQuery = query(collection(db, "products"), where("featured", "==", true));
        const pSnapshot = await getDocs(pQuery);

        setFeaturedProducts(pSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        const rQuery = query(
          collection(db, "reviews"),
          where("rating", ">=", 4),
          orderBy("date", "desc"),
          limit(4)
        );

        const rSnapshot = await getDocs(rQuery);
        setLatestReviews(rSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            Bare and Beautiful
          </h1>

          <div className="hidden md:block max-w-md flex-1 mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" onClick={() => onNavigate("profile")}>
                <User className="w-4 h-4 mr-2" />
                {user.name}
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => onNavigate("login")}>
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              className="relative"
              onClick={() => onNavigate("cart")}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 text-xs rounded-full">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* SIMPLE NAV BAR */}
        <div className="border-t bg-white">
          <div className="container mx-auto px-4 py-3 flex justify-center gap-8 text-sm font-semibold text-slate-600">
            <button onClick={() => onNavigate("products")} className="hover:text-pink-600">
              Shop
            </button>

            <button onClick={() => onNavigate("discover")} className="hover:text-pink-600">
              Discover
            </button>

            <button onClick={() => onNavigate("about")} className="hover:text-pink-600">
              About Us
            </button>

            <button onClick={() => onNavigate("contact")} className="hover:text-pink-600">
              Contact
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Discover Your <br />
              <span className="text-pink-600 italic">Natural Glow</span>
            </h2>

            <Button size="lg" className="rounded-full" onClick={() => onNavigate("products")}>
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* MOVING PRODUCTS */}
          <div className="relative h-72 md:h-96 flex items-center overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-20%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="flex gap-8"
            >
              {[...featuredProducts, ...featuredProducts].map((product, index) => (
                <div
                  key={index}
                  className="w-40 h-40 md:w-56 md:h-56 bg-white rounded-3xl shadow-lg overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

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
                         <Button 
                           variant="link" 
                           className="text-pink-600 font-bold hidden sm:flex items-center gap-2 hover:no-underline hover:text-pink-700"
                           onClick={() => onNavigate('products')}
                         >
                           View Full Catalog <ArrowRight className="w-4 h-4" />
                         </Button>
                         <div className="flex gap-2">
                           <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-pink-50 hover:text-pink-600" onClick={() => scroll('left')}>
                             <ChevronLeft className="w-5 h-5" />
                           </Button>
                           <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-pink-50 hover:text-pink-600" onClick={() => scroll('right')}>
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
                       <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-10 snap-x snap-mandatory no-scrollbar scroll-smooth">
                         {featuredProducts.map((product) => {
                           const discount = product.originalPrice && product.originalPrice > product.price
                             ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                             : null;
           
                           return (
                             <motion.div 
                               key={product.id} 
                               className="min-w-[280px] md:min-w-[320px] snap-start"
                               whileHover={{ scale: 1.05, y: -10 }} 
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
                                       <p className="text-[11px] text-[#8B4513] font-black uppercase tracking-[0.15em]">
                                         {product.brand}
                                       </p>
                                       {/* Standardized Font size for Product Name */}
                                       <h4 className="font-medium text-base md:text-lg text-slate-800 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors">
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
                   </div>
                 </motion.section>

      {/* SHOP BY BRAND */}
<section className="py-14 bg-white">
  <div className="container mx-auto px-4">
    <h3 className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400 mb-10">
      Popular Brands
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
      {popularBrands.map((brand) => (
        <motion.button
          key={brand}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate("products", { brand })}
          className="
            h-20 md:h-24
            rounded-2xl
            bg-gradient-to-br from-slate-50 to-white
            border border-slate-200
            shadow-sm
            hover:shadow-lg
            hover:border-slate-300
            transition-all
            flex items-center justify-center
            font-bold
            text-sm md:text-base
            tracking-wide
            text-slate-800
          "
        >
          {brand}
        </motion.button>
      ))}
    </div>
  </div>
</section>
      
      {/* REVIEWS */}
            <section className="py-20 bg-slate-50">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-4xl font-bold mb-12">
                  Our Glowing Customers
                </h3>
      
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {latestReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-8 bg-white rounded-3xl shadow-sm"
                    >
                      <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="italic text-sm mb-4">
                        "{rev.comment}"
                      </p>
                      <p className="text-xs font-bold uppercase">
                        — {rev.userName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
    {/* Footer */}
      <footer className="py-16 bg-gradient-to-br from-pink-50 to-orange-50">
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
              <ul className="space-y-4 text-sm text-muted-foreground font-bold">
                <div className="flex flex-col gap-6">
  <h5 className="font-black mb-2 text-slate-900 uppercase text-[10px] tracking-[0.2em] opacity-50">Follow Radiance</h5>
  <ul className="space-y-4 text-sm text-muted-foreground font-bold">
    <li>
      <a 
        href="https://www.instagram.com/bareandbeautifulskincare" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-pink-600 transition-colors"
      >
        Instagram
      </a>
    </li>
    <li>
      <a 
        href="https://www.facebook.com/bareandbeautifulskincare" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-pink-600 transition-colors"
      >
        Facebook
      </a>
    </li>
    <li>
      <a 
        href="https://www.tiktok.com/@bareandbeautifulskincare" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="hover:text-pink-600 transition-colors"
      >
        TikTok
      </a>
    </li>
  </ul>
</div>
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