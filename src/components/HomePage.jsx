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
  Moon,
  Sun,
  Instagram,
  Facebook,
 
} from "lucide-react";

import useDarkMode from "./useDarkMode";
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
  { name: "COSRX", image: "/brands/cosrx-logo.jpg" },
  { name: "SIMPLE", image: "/brands/simple-logo.png" },
  { name: "HADA LABO", image: "/brands/hadalabo-logo.jpg" },
  { name: "ANUA", image: "/brands/anua-logo.jpg" },
  { name: "EQQUALBERRY", image: "/brands/eqqualberry-logo.jpg" }
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
  const [colorTheme, setTheme] = useDarkMode();
  const isDark = colorTheme === "light";

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
  const interval = setInterval(() => {
    setCurrentHero((prev) => (prev + 1) % featuredProducts.length)
  }, 9000) // 9000ms = 9 seconds (slow)

  return () => clearInterval(interval)
}, [featuredProducts.length])

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
      orderBy("name"), // Different sorting so they don't match the Hero exactly
      limit(8)
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

const [activeSubMenu, setActiveSubMenu] = useState(null);

const menuData = {
    // We specifically grab brand.name for both id and name
    brands: popularBrands.map(brand => ({ id: brand.name, name: brand.name })), 
    skincare: [
      { id: "cleansers", name: "CLEANSERS" },
      { id: "toners", name: "TONERS" },
      { id: "serums", name: "SERUMS" },
      { id: "moisturizers", name: "MOISTURIZERS" },
      { id: "sunscreen", name: "SUNSCREEN" },
    ],
    skinType: [
      { id: "acne-prone", name: "ACNE-PRONE" },
      { id: "combination", name: "COMBINATION" },
      { id: "dry", name: "DRY SKIN" },
      { id: "dull", name: "DULL SKIN" },
      { id: "mature", name: "MATURE SKIN" },
      { id: "normal", name: "NORMAL SKIN" },
      { id: "oily", name: "OILY SKIN" },
    ],
    concern: [
      { id: "acne", name: "ACNE / BREAKOUTS" },
      { id: "anti-aging", name: "ANTI-AGING" },
      { id: "barrier-repair", name: "BARRIER REPAIR" },
      { id: "brightening", name: "BRIGHTENING / GLOW" },
      { id: "dark-circles", name: "DARK EYE CIRCLES" },
      { id: "dark-spots", name: "DARK SPOTS" },
      { id: "hydration", name: "DRYNESS / HYDRATION" },
      { id: "oil-control", name: "OIL CONTROL / PORES" },
    ]
  };

const handleSubMenuSelection = (filterType, value) => {
    if (filterType === 'brands') {
      onNavigate("products", { brand: value });
    } else {
      onSelectCategory(value);
      onNavigate("products");
    }
    setShowSidebar(false);
    setActiveSubMenu(null); // Reset for next time
  };

  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const HERO_HEIGHT = "clamp(420px, 55vh, 650px)";// change this whenever you want
  const heroTextColor = featuredProducts[currentHero]?.themeColor || "white";
 const HERO_CONFIG = {
  dotsRight: 20,
  dotsBottom: 10,
  buttonBottom:50,
  buttonRight:20,
  dotSize: 10
};

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 ease-in-out">
     <header 
  style={{ 
    backgroundColor: 'var(--bg-card)', 
    borderColor: 'var(--border-subtle)',
    color: 'var(--text-primary)' 
  }}
  className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-500">
  <div className="container mx-auto px-6 py-5 flex items-center justify-between">

    {/* LEFT: MENU + LOGO */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#f8fafc" }} // slate-50
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded-full hover:text-pink-600 transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
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
          className="pl-11 h-10 w-48 focus:w-72 transition-all duration-500 rounded-full bg-muted border-transparent focus:bg-background text-foreground"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearchSubmit}
        />
      </div>

      {/* MOBILE SEARCH BUTTON */}
      <motion.button 
        whileHover={{ scale: 1.1, backgroundColor: "#fdf2f8", color: "#db2777" }} // Pink-50 bg, Pink-600 text
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="lg:hidden p-2.5 rounded-full text-slate-700 transition-colors cursor-pointer"
      >
        <Search className="w-5 h-5" />
      </motion.button>

      {/* ACTION ICONS */}
      <div className="flex items-center gap-2 md:gap-4"> 
        {/* Note: Gap reduced slightly because we are adding padding to the buttons */}
         <motion.button
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => setTheme(colorTheme)}
          className="p-2.5 rounded-full cursor-pointer relative overflow-hidden flex items-center justify-center w-10 h-10 transition-colors"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Sun className="w-5 h-5 text-orange-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Moon className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* USER ICON */}
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: "#fdf2f8", color: "#db2777" }} // Pink-50 bg, Pink-600 text
          whileTap={{ scale: 0.9 }}
          onClick={() => user ? onNavigate("profile") : onNavigate("login")}
          className="p-2.5 rounded-full text-slate-700 transition-colors cursor-pointer"
        >
          <User className="w-5 h-5" />
        </motion.button>

        {/* WISHLIST (HEART) ICON */}
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: "#fdf2f8", color: "#db2777" }} 
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate("profile")} // Update this to your wishlist route when ready
          className="p-2.5 rounded-full text-slate-700 transition-colors cursor-pointer group"
        >
          <Heart className="w-5 h-5 group-hover:fill-pink-100 transition-colors duration-300" />
        </motion.button>

        {/* CART ICON */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#fdf2f8", color: "#db2777" }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate("cart")}
          className="p-2.5 rounded-full relative text-slate-700 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          
          {/* Animated Cart Badge */}
          <AnimatePresence>
            {cartItemCount > 0 && (
              <motion.span 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, type: "spring", stiffness: 500, damping: 15 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-0 right-0 bg-pink-600 text-white text-[9px] font-black w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm"
              >
                {cartItemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

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
            className="h-12 rounded-full bg-muted text-foreground border-transparent"
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
          initial={{ opacity: 0, }}
          animate={{ opacity: 1, }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowSidebar(false);
            setActiveSubMenu(null); // Reset menu when clicking outside
          }}
          className="fixed inset-0 bg-black/40 z-40 cursor-pointer"
        />

        {/* PANEL */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 h-full w-72 md:w-80 bg-white z-50 shadow-2xl p-6 flex flex-col overflow-hidden"
        >


          {/* SLIDING MENU CONTENT */}
          <div className="flex-1 overflow-y-auto no-scrollbar -mx-6 px-6">
            <AnimatePresence mode="wait">
              
              {!activeSubMenu ? (
                /* --- MAIN MENU --- */
                <motion.div
                  key="main-menu"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col text-sm font-semibold mt-2"
                >
                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#fdf2f8" }} // slight right slide & pink-50 bg
                    onClick={() => setActiveSubMenu("brands")} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-800 hover:text-pink-600 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Brands 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#fdf2f8" }}
                    onClick={() => setActiveSubMenu("skincare")} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-800 hover:text-pink-600 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Skincare 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#fdf2f8" }}
                    onClick={() => setActiveSubMenu("skinType")} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-800 hover:text-pink-600 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Shop by Skin Type 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#fdf2f8" }}
                    onClick={() => setActiveSubMenu("concern")} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-800 hover:text-pink-600 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Shop by Concern 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pink-600 group-hover:translate-x-1 transition-all duration-300" />
                  </motion.button>

                  <div className="h-px bg-slate-100 my-2 -mx-2" /> {/* Visual Divider */}

                  {/* Static Links */}
                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#f8fafc" }} // slate-50 bg for non-categories
                    onClick={() => { onNavigate("perfume"); setShowSidebar(false); }} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-500 hover:text-slate-900 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Perfume 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#f8fafc" }}
                    onClick={() => { onNavigate("delivery"); setShowSidebar(false); }} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-500 hover:text-slate-900 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Order Delivery 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#f8fafc" }}
                    onClick={() => { onNavigate("faqs"); setShowSidebar(false); }} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-500 hover:text-slate-900 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    FAQs 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </motion.button>

                  <motion.button 
                    whileHover={{ x: 6, backgroundColor: "#f8fafc" }}
                    onClick={() => { onNavigate("contact"); setShowSidebar(false); }} 
                    className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-slate-500 hover:text-slate-900 uppercase tracking-widest text-[11px] font-black cursor-pointer group transition-colors"
                  >
                    Contact Us 
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </motion.button>
                </motion.div>

              ) : (
                /* --- SUB MENU --- */
                <motion.div
                  key="sub-menu"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col text-sm font-semibold mt-2" // Removed divide-y for the clean hover background
                >
                  {/* Back Button - Slides Left! */}
                  <motion.button 
                    whileHover={{ x: -6, backgroundColor: "#f8fafc" }} // slate-50 bg
                    onClick={() => setActiveSubMenu(null)} 
                    className="py-3 px-4 -mx-4 rounded-xl flex items-center gap-3 hover:text-slate-900 uppercase tracking-widest text-[10px] font-black text-slate-400 mb-4 transition-colors cursor-pointer group"
                  >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" /> 
                    BACK TO MENU
                  </motion.button>

                  <div className="h-px bg-slate-100 mb-2 -mx-2" /> {/* Visual Divider */}

                  {/* Dynamic List Items - Slide Right */}
                  {menuData[activeSubMenu].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 6, backgroundColor: "#fdf2f8" }} // pink-50 bg
                      onClick={() => handleSubMenuSelection(activeSubMenu, item.id)}
                      className="py-4 px-4 -mx-4 rounded-xl flex justify-between items-center text-left hover:text-pink-600 uppercase tracking-widest text-[11px] font-bold text-slate-700 transition-colors cursor-pointer group"
                    >
                      {item.name}
                      {/* Optional subtle arrow that appears on hover, you can remove this span if you just want text! */}
                      <span className="opacity-0 group-hover:opacity-100 text-pink-600 transition-opacity duration-300">
                         <ChevronRight className="w-3 h-3" />
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
</header>


{/* FULL-SCREEN HERO SLIDESHOW */}

     <section
  style={{ height: HERO_HEIGHT }}
  className="relative w-full max-w-7xl mx-auto mt-10 overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] shadow-xl"
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
className="absolute inset-0 overflow-hidden"
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
alt={product.name}
className="absolute top-1/2 left-1/2 min-w-full min-h-full max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
/>

<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 md:bg-black/30" />

</motion.div>
)

})}

</div>


{/* HERO TEXT */}
<div className="relative z-10 text-center px-6 max-w-[900px] mx-auto">

<motion.div
key={currentHero}
initial={{ opacity:0, y:30 }}
animate={{ opacity:1, y:0 }}
transition={{ duration:0.6 }}
className="space-y-6"
>

{/* Add hero title/description here if needed */}

</motion.div>

</div>


{/* FIXED CONTROL ANCHOR - BOTTOM RIGHT */}
<div 
  className="absolute z-40 flex flex-col items-center md:items-end gap-6"
  style={{ 
    right: 'clamp(20px, 5vw, 60px)',
    bottom: `${HERO_CONFIG.dotsBottom}px` 
  }}
>

<motion.button
whileHover={{ scale: 1.05,}}
whileTap={{ scale: 0.95 }}
onClick={() => onViewProduct(featuredProducts[currentHero])}
className="border border-white/40 backdrop-blur-md text-black px-8 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
>
Explore the Edit
</motion.button>


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
? "bg-black"
: "bg-slate-300 hover:bg-slate-400"
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
                   className="relative py-32 lg:py-48 overflow-hidden z-30 transition-colors duration-500"
                   style={{ backgroundColor: 'var(--bg-main)' }}
>
                   <div className="container mx-auto px-6">
                     <div className="text-center mb-16">
                       {/* FEATURED ESSENTIALS HEADER - NOW CENTERED */}
<div className="flex flex-col items-center text-center">
  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground uppercase">
    Featured Essentials
  </h3>

  <div className="w-20 h-1 bg-pink-600 mt-4 mb-2 rounded-full" />

  <p className="text-muted-foreground font-medium italic text-lg">
    Hand-picked boutique favorites
  </p>
</div>
                       <div className="flex items-center gap-4">
                         
                      <div className="mt-16 flex justify-center">
  <motion.button                   
    onClick={() => onNavigate('products')}
    whileHover={{ scale: 1.05, }} // pink-700
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-3 bg-pink-600 text-slate-900 px-5 py-5 rounded-full text-sm font-black shadow-2xl transition-all duration-300 uppercase tracking-[0.2em] cursor-pointer"
  >
    Shop Full Collection
    <ArrowRight className="w-5 h-5" />
  </motion.button>
</div>
                  
                        {/*<div className="flex gap-2">
                           <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-pink-50 hover:text-pink-600" onClick={() => scroll('left')}>
                             <ChevronLeft className="w-5 h-5" />
                           </Button>
                           <Button variant="outline" size="icon" className="rounded-full border-slate-200 hover:bg-pink-50 hover:text-pink-600" onClick={() => scroll('right')}>
                             <ChevronRight className="w-5 h-5" />
                           </Button>
                         </div>*/}

                       </div>
                     </div>
           
                     {loading ? (
                       <div className="flex gap-6 overflow-hidden">
                          {[1,2,3,4].map(i => <div key={i} className="min-w-[280px] h-[420px] bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
                       </div>
                     ) : (
                       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 overflow-hidden">
                         {gridProducts.map((product) => {
                           const discount = product.originalPrice && product.originalPrice > product.price
                             ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                             : null;
           
                           return (
                             <motion.div 
                               key={product.id} 
                               className="w-full h-full"
                               whileHover={{ scale: 1.05, y: -10 }} 
                               transition={{ type: "spring", stiffness: 400, damping: 17 }}
                             >
                               <Card 
                                 className="cursor-pointer group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden rounded-[2.5rem] border-slate-100 shadow-sm"
                                 onClick={() => onViewProduct(product)}
                               >
                                 <CardContent className="p-0 flex flex-col h-full bg-card text-card-foreground">
  {/* Image Container */}
  <div className="relative aspect-[4/5] bg-[#f8f8f8] dark:bg-muted/30 flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-w-full max-h-full object-contain" 
        />
        
        {/* 2. FLOATING ACTIONS (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
        </div>
      </div>

  {/* Text Content */}
  <div className="p-4 flex flex-col flex-grow bg-card transition-colors duration-500">
        {/* Product Name */}
        <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1 leading-tight min-h-[2.5rem]">
          {product.name}
        </h4>
        
        {/* Brand Name (Uppercase & Gray) */}
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">
          {product.brand}
        </p>

        {/* Rating Section */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground font-bold">(45)</span>
        </div>

    <div className="flex items-center gap-3 mt-8">
      <span className="font-black text-foreground text-2xl tracking-tighter">
        KSh {product.price?.toLocaleString()}
      </span>
      {product.originalPrice && (
        <span className="text-sm text-muted-foreground line-through font-medium italic">
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
<section className="py-24 bg-background transition-colors duration-500">
  <div className="container mx-auto px-4">
    {/* Section Title */}
    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center text-foreground mb-20 uppercase">
      Shop by Brand
    </h3>

    {/* Circular Grid Container */}
    <div className="grid grid-cols-2 md:grid-cols-2 gap-y-16 gap-x-12 justify-items-center max-w-3xl mx-auto">
      {popularBrands.map((brand) => (
        <div key={brand.name} className="flex flex-col items-center group">
          {/* Circular Image Background */}
          <motion.button
            whileHover={{ scale: 1.25 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate("products", { brand: brand.name })}
            /* Styling to match the screenshot:
               - rounded-full: Perfect circle
               - border-2: Thin outline like Lintons
               - p-8: Keeps the logo from touching the border
            */
            className="relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-2 border-border bg-card shadow-sm transition-all duration-500 flex items-center justify-center p-8 md:p-12 overflow-hidden cursor-pointer"
          >
            {brand.image ? (
              <img 
                src={brand.image} 
                alt={brand.name} 
                className="w-full h-full object-contain filter dark:brightness-0 dark:invert transition-all duration-500 group-hover:scale-110" 
              />
            ) : (
              <span className="font-black text-sm md:text-base text-foreground uppercase tracking-tighter">
                {brand.name}
              </span>
            )}
          </motion.button>
          
          {/* Label centered below the circle */}
          <span className="mt-6 text-sm md:text-base font-bold text-foreground uppercase tracking-widest group-hover:text-pink-600 transition-colors">
            {brand.name}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>
      
      {/* REVIEWS */}
            <section className="py-20 bg-muted transition-colors duration-500">
              <div className="container mx-auto px-4 text-center">
                <h3 className="text-4xl font-bold mb-12">
                  Our Glowing Customers
                </h3>
      
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {latestReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-8 bg-card border border-border rounded-3xl shadow-sm transition-colors duration-500"
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
<footer className="py-20 bg-card border-t border-border transition-colors duration-500">
  {/* Container: centers content and prevents over-stretching on wide monitors */}
  <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
      
      {/* 1. BRANDING: Centered on mobile, left-aligned on desktop */}
      <div className="space-y-6 text-center md:text-left">
        <h2 className="text-2xl font-bold tracking-tighter text-pink-600">
          Bare & Beautiful
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
          Premium destination for curated skincare and fragrance. We believe in beauty crafted for your natural radiance.
        </p>
      </div>

      {/* 2. QUICK LINKS: Stacks neatly on mobile, spreads on desktop */}
      <div className="grid grid-cols-2 gap-8 md:col-span-1 lg:col-span-2">
        
        {/* Customer Care Column */}
        <div className="space-y-5">
          <h5 className="font-black uppercase text-[10px] tracking-[0.2em] text-foreground ">
            Customer Care
          </h5>
          <ul className="space-y-3 text-sm font-bold text-muted-foreground">
            <li><button onClick={() => onNavigate('contact')} className="hover:text-pink-600 transition-colors text-left">Contact Us</button></li>
            <li><button onClick={() => onNavigate('help')} className="hover:text-pink-600 transition-colors text-left">Boutique Help</button></li>
            <li><button onClick={() => onNavigate('returns')} className="hover:text-pink-600 transition-colors text-left">Returns</button></li>
            <li><button onClick={() => onNavigate('shipping')} className="hover:text-pink-600 transition-colors text-left">Shipping</button></li>
          </ul>
        </div>

        {/* Information Column */}
        <div className="space-y-5">
          <h5 className="font-bold uppercase text-[10px] tracking-[0.2em] text-foreground">
            Information
          </h5>
          <ul className="space-y-3 text-sm font-bold text-muted-foreground">
            <li><button className="hover:text-pink-600 transition-colors text-left">Privacy Policy</button></li>
            <li><button className="hover:text-pink-600 transition-colors text-left">Terms of Service</button></li>
            <li><button className="hover:text-pink-600 transition-colors text-left">Store Locator</button></li>
          </ul>
        </div>
      </div>

      {/* 3. SOCIALS: Updated with official brand icons */}
      <div className="space-y-6 text-center md:text-left">
        <h5 className="font-bold uppercase text-[10px] tracking-[0.2em] text-foreground ">
          Follow Radiance
        </h5>
        <div className="flex justify-center md:justify-start gap-4">
          
          {/* INSTAGRAM */}
          <a 
            href="https://www.instagram.com/bareandbeautifulskincare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-muted hover:bg-pink-100 dark:hover:bg-pink-900/30 text-muted-foreground hover:text-pink-600 transition-all duration-300 shadow-sm"
          >
            <Instagram className="w-5 h-5" />
            <span className="sr-only">Instagram</span>
          </a>

          {/* TIKTOK (Custom SVG) */}
          <a 
            href="https://www.tiktok.com/@bareandbeautifulskincare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-muted hover:bg-pink-100 dark:hover:bg-pink-900/30 text-muted-foreground hover:text-pink-600 transition-all duration-300 shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
            </svg>
            <span className="sr-only">TikTok</span>
          </a>

          {/* FACEBOOK */}
          <a 
            href="https://www.facebook.com/bareandbeautifulskincare" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-muted hover:bg-pink-100 dark:hover:bg-pink-900/30 text-muted-foreground hover:text-pink-600 transition-all duration-300 shadow-sm"
          >
            <Facebook className="w-5 h-5" />
            <span className="sr-only">Facebook</span>
          </a>
        </div>
      </div>

    </div>

    {/* 4. BOTTOM BAR: Copyright and Payment Info */}
    <div onClick={() => onNavigate('admin-login')} className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">
        © 2026 Bare & Beautiful. All rights reserved.
      </p>
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
        <span>Curating Radiance</span>
        <span>Secure Payment</span>
      </div>
    </div>
  </div>
</footer>

    </div>
  );
}