import React, {  useEffect, useState, useRef } from "react";
import { motion,AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Star,
  Menu, 
  X,
  ArrowRight,
  Heart,
  User,
  ChevronLeft,
  ChevronDown,
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
  "SIMPLE",
  "HADA LABO",
  "ANUA",
  "EQQUALBERRY",
];

export default function HomePage({
  onNavigate,
  user,
  onViewProduct,
  onSelectCategory,
  cartItemCount,
}) {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestReviews, setLatestReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentHero, setCurrentHero] = useState(0);

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

  const [gridProducts, setGridProducts] = useState([]);
  useEffect(() => {
  const fetchData = async () => {
  try {
    setLoading(true);

    // 1. HERO QUERY: Latest 5 for the big slider
    const heroQ = query(
      collection(db, "products"),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const heroSnap = await getDocs(heroQ);
    setFeaturedProducts(heroSnap.docs.map(d => ({ id: d.id, ...d.data() })));

    // 2. FEATURED SECTION: Random or "Featured" items (Different from Hero)
    // Here we query products where "featured" is true but NOT limited to 5
    const featuredQ = query(
      collection(db, "products"),
      where("featured", "==", true),
      orderBy("name") // Different sorting so they don't match the Hero exactly
    );
    const featSnap = await getDocs(featuredQ);
    
    // Set a different state for the horizontal scroll section
    setGridProducts(featSnap.docs.map(d => ({ id: d.id, ...d.data() })));

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  fetchData();
}, []);



  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const HERO_HEIGHT = "50vh"; // change this whenever you want
  const heroTextColor = featuredProducts[currentHero]?.themeColor || "white";
 const HERO_CONFIG = {
  dotsRight: 20,
  dotsBottom: 10,
  buttonBottom:50,
  buttonRight:20,
  dotSize: 10
};

  return (
    <div className="min-h-screen bg-background">
     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
  <div className="container mx-auto px-6 py-5 flex items-center justify-between">

    {/* LEFT: MENU + LOGO */}
    <div className="flex items-center gap-4">
      <button
        onClick={() => setShowSidebar(true)}
        className="p-2 hover:text-pink-600 transition"
      >
        <Menu className="w-6 h-6 " />
      </button>

    </div>

{/* MIDDLE: THE NEW MONOGRAM LOGO */}
    <div className="flex justify-center">
      <img 
        src="/assets/whitelogo.png" 
        alt="Bare & Beautiful Logo"
        className="h-12 md:h-16 w-auto cursor-pointer object-contain hover:opacity-80 transition-opacity"
        onClick={() => onNavigate("home")}
      />
    </div>
    
    {/* RIGHT SIDE */}
    <div className="flex items-center gap-8 md:gap-10">

      {/* SEARCH DESKTOP */}
      <div className="hidden lg:block relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-pink-600" />
        <Input
          placeholder="Search products..."
          className="pl-11 h-10 w-48 focus:w-72 transition-all duration-500 rounded-full bg-slate-100 border-transparent focus:bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      </div>

      {/* MOBILE SEARCH BUTTON */}
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="lg:hidden p-2"
      >
        <Search className="w-5 cursor-pointer h-5" />
      </button>

      {/* ACTION ICONS */}
      <div className="flex items-center gap-6 md:gap-8">

        <button 
          onClick={() => user ? onNavigate("profile") : onNavigate("login")}
          className="hover:text-pink-600 cursor-pointer"
        >
          <User className="w-5 h-5" />
        </button>

        <button onClick={() => onNavigate("profile")}>
          <Heart className="w-5 h-5 cursor-pointer" />
        </button>

        <button
          className="relative"
          onClick={() => onNavigate("cart")}
        >
          <ShoppingBag className="w-5 h-5 cursor-pointer" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

      </div>
    </div>
  </div>

  {/* MOBILE SEARCH DROPDOWN (UNCHANGED) */}
  <AnimatePresence>
    {showMobileSearch && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="absolute top-full left-0 right-0 bg-white border-b lg:hidden"
      >
        <div className="px-6 py-4 flex gap-3">
          <Input
            autoFocus
            placeholder="Search..."
            className="h-12 rounded-full bg-slate-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <button onClick={() => setShowMobileSearch(false)}>Close</button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* SIDEBAR */}
  <AnimatePresence>
    {showSidebar && (
<>
      
        {/* OVERLAY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowSidebar(false)}
          className="fixed  inset-0 bg-black/40 z-40 cursor-pointer"
        />

        {/* PANEL */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0  left-0 h-full w-72 bg-white z-50 shadow-2xl p-6 flex flex-col"
        >
          {/* CLOSE */}
          <div className="flex  justify-between items-center mb-10">
          
            <button onClick={() => setShowSidebar(false)}>
              <X className="w-5 cursor-pointer h-5" />
            </button>
          </div>

          {/* LINKS */}
<div className="flex flex-col gap-6 text-sm font-semibold overflow-hidden">

  {/* MAIN SHOP BUTTON WITH FLIP/REVEAL ANIMATION */}
  <div className="flex flex-col border-b border-slate-100 pb-4">
    <button
      onClick={() => setShowCategoryMenu(!showCategoryMenu)}
      className="flex justify-between items-center text-left cursor-pointer hover:text-pink-600 transition-all uppercase tracking-widest text-[11px] font-black"
    >
      Shop by Category
      <motion.div
        animate={{ rotate: showCategoryMenu ? 180 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <ChevronDown className="w-4 h-4 opacity-50" />
      </motion.div>
    </button>

    {/* AESTHETIC REVEAL AREA */}
    <AnimatePresence>
      {showCategoryMenu && (
        <motion.div
          initial={{ rotateX: -90, opacity: 0, height: 0 }}
          animate={{ rotateX: 0, opacity: 1, height: "auto" }}
          exit={{ rotateX: -90, opacity: 0, height: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
          style={{ transformOrigin: "top" }}
          className="flex flex-col gap-4 mt-6 pl-4 border-l border-pink-100"
        >
          {['Skincare', 'Fragrance', 'Hair Care', 'Body Care'].map((item) => (
            <motion.button
              key={item}
              whileHover={{ x: 5, color: "#db2777" }}
              onClick={() => {
                const categoryId=(item.toLowerCase().replace(' ', ''));
                onSelectCategory(categoryId);
                onNavigate("products");
                setShowSidebar(false);
              }}
              className="text-left text-xs text-slate-400 font-bold uppercase tracking-[0.2em] transition-colors"
            >
              {item}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  </div>

  {/* REMAINING LINKS */}
  <button
    onClick={() => { onNavigate("discover"); setShowSidebar(false); }}
    className="text-left cursor-pointer hover:text-pink-600 uppercase tracking-widest text-[11px] font-black"
  >
    Discover
  </button>

  <button
    onClick={() => { onNavigate("contact"); setShowSidebar(false); }}
    className="text-left cursor-pointer hover:text-pink-600 uppercase tracking-widest text-[11px] font-black"
  >
    Contact
  </button>
</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</header>


{/* FULL-SCREEN HERO SLIDESHOW */}

<section
  style={{ height: HERO_HEIGHT }}
  className="relative w-full overflow-hidden flex items-center justify-center"
>

{loading ? (
<div className="absolute inset-0 flex items-center justify-center bg-[#fdfcfb]">
<motion.p
animate={{ opacity:[0.4,1,0.4] }}
transition={{ repeat:Infinity, duration:2 }}
className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-300"
>
Curating Radiance...
</motion.p>
</div>
) : (
<>

{/* BACKGROUND SLIDES */}
<div className="absolute inset-0">

{featuredProducts.map((product,index)=>{

const active = index === currentHero

return(
<motion.div
key={product.id}
className="absolute inset-0"
initial={{ opacity:0 }}
animate={{ opacity: active ? 1 : 0 }}
transition={{ duration:1 }}
drag="x"
dragConstraints={{ left:0, right:0 }}
onDragEnd={(e,info)=>{

if(info.offset.x < -80){
setCurrentHero((prev)=>(prev+1)%featuredProducts.length)
}

if(info.offset.x > 80){
setCurrentHero((prev)=> prev===0 ? featuredProducts.length-1 : prev-1)
}

}}
>

<img
src={product.image}
className="w-full h-full object-cover object-center md:object-top lg:object-center"
alt={product.name}
/>

<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 md:bg-black/30" />

</motion.div>
)

})}

</div>


{/* HERO TEXT */}
<div className="relative z-10 text-center px-6 max-w-[900px]">

<motion.div
key={currentHero}
initial={{ opacity:0, y:30 }}
animate={{ opacity:1, y:0 }}
transition={{ duration:0.6 }}
className="space-y-6"
>





</motion.div>

</div>


{/* FIXED CONTROL ANCHOR - BOTTOM RIGHT */}
<div 
  className="absolute z-40 flex flex-col items-center md:items-end gap-6"
  style={{ 
    right: 'clamp(20px, 5vw, 60px)', // Adaptive spacing from right
    bottom: `${HERO_CONFIG.dotsBottom}px` 
  }}
>
  {/* EXPLORE BUTTON - Sits above dots */}
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onViewProduct(featuredProducts[currentHero])}
    className="border border-white/40 backdrop-blur-md text-black px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
  >
    Explore the Edit
  </motion.button>

  {/* NAVIGATION DOTS - Grayscale Logic */}
  <div className="flex gap-3 px-2 py-1">
    {featuredProducts.map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentHero(index)}
        style={{ 
          width: currentHero === index ? '24px' : `${HERO_CONFIG.dotSize}px`, 
          height: `${HERO_CONFIG.dotSize}px` 
        }}
        className={`rounded-full transition-all duration-500 shadow-sm border border-black/5
          ${currentHero === index 
            ? "bg-black"               // Active: Solid Black
            : "bg-slate-300 hover:bg-slate-400" // Inactive: Grey
          }`}
      />
    ))}
  </div>
</div>

</>
)}

</section>


     {/* FEATURED PRODUCTS - SCROLL BUTTONS & HOVER POP */}
                 <motion.section
                   initial={{ y: 50, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ duration: 0.6, delay: 0.4 }}
                   className="relative py-32 lg:py-48 bg-white overflow-hidden z-30"
                 >
                   <div className="container mx-auto px-6">
                     <div className="flex justify-between items-end mb-10">
                       <div>
                         <h3 className="text-3xl font-bold tracking-tight">Featured Essentials</h3>
                         <p className="text-muted-foreground mt-1 font-medium italic">Hand-picked boutique favorites</p>
                       </div>
                       <div className="flex items-center gap-4">
                         <motion.button
  onClick={() => onNavigate('products')}
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.95 }}
  className="items-center gap-2 bg-pink-600 text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-pink-700 transition-all"
>
  Shop Now <ArrowRight className="w-4 h-4" />
</motion.button>
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
                         {gridProducts.map((product) => {
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

    <div className="grid  grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
      {popularBrands.map((brandName) => (
        <motion.button
          key={brandName}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            // 1. Tell App.jsx which brand we want (if you passed a setter prop)
            // Or use the navigate function if you updated it to handle objects
            onNavigate("products", { brand: brandName }); 
          }}
          className="h-20 cursor-pointer md:h-24 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all flex items-center justify-center font-bold text-sm md:text-base tracking-wide text-slate-800"
        >
          {brandName}
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
            className="mt-20 pt-10 border-t border-slate-100 text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
            onClick={() => onNavigate('admin-login')}
          >
            © 2024 Bare and Beautiful Boutique. Radiance, Redefined.
          </div>
        </div>
      </footer>
    </div>
  );
}