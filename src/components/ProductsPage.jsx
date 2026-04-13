import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Star, ArrowLeft, Grid, List, Filter, X,Moon,Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { db } from './firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import useDarkMode from "./useDarkMode";

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'skincare', name: 'Skincare' },
  { id: 'fragrance', name: 'Fragrance' },
  { id: 'haircare', name: 'Hair Care' },
  { id: 'bodycare', name: 'Body Care' }
];

const skinTypes = ['All', 'Oily', 'Dry', 'Sensitive', 'Combination', 'Normal'];

export default function ProductsPage({
  onNavigate,
  user,
  onViewProduct,
  selectedCategory = 'all',
  onSelectCategory,
  cartItemCount,
  brand
}) {

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(brand || 'All Brands');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [colorTheme, setTheme] = useDarkMode();
  const isDark = colorTheme === "light";

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      onNavigate("products", { search: searchQuery });
    }
  };
   const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const uniqueBrands = ['All Brands', ...new Set(products.map(p => p.brand).filter(Boolean))];
  const popularBrands = uniqueBrands.slice(1, 6);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchLower) ||
      product.brand?.toLowerCase().includes(searchLower);

    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const matchesSkin = selectedSkinType === 'All' || product.skinType === selectedSkinType;

    return matchesCategory && matchesSearch && matchesBrand && matchesSkin;
  }); 

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'brand-az') return (a.brand || "").localeCompare(b.brand || "");
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60, 
    scale: 0.95 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.6
    }
  }
};


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.6, ease: "easeOut" }} 
    className="min-h-screen bg-background text-foreground transition-colors duration-500">

      {/* Header */}
<motion.header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
  <div className="container mx-auto px-4 py-3 grid grid-cols-3 items-center">

    {/* LEFT: BACK BUTTON */}
    <div className="flex items-center">
      <Button variant="ghost" size="sm" onClick={() => onNavigate('home')} className="hover:text-pink-600">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>
    </div>

    {/* MIDDLE: THE MONOGRAM LOGO */}
    <div className="flex justify-center">
      <img 
        src={isDark ? "/assets/blacklogo.png" : "/assets/whitelogo.png"}
        alt="Bare & Beautiful Logo"
       className="h-10 md:h-14 w-auto cursor-pointer object-contain"
        onClick={() => onNavigate("home")}
      />
    </div>

    {/* RIGHT SIDE: SEARCH & CART GROUPED TOGETHER */}
    <div className="flex items-center justify-center gap-1 md:gap-3">
      
    {/* 1. DARK MODE TOGGLE (Add this) */}
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => setTheme(colorTheme)}
    className="p-2 rounded-full cursor-pointer relative overflow-hidden flex items-center justify-center w-10 h-10 transition-colors"
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
          <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </motion.div>
      )}
    </AnimatePresence>
  </motion.button>

      {/* SEARCH BUTTON (Mobile & Desktop) */}
      <button 
        onClick={() => setShowMobileSearch(!showMobileSearch)}
        className="p-2 hover:text-pink-600 transition-colors"
      >
        <Search className="w-5 h-5 stroke-[1.5]" />
      </button>

      {/* CART BUTTON */}
      <button
        className="relative p-2 hover:text-pink-600 transition-colors"
        onClick={() => onNavigate('cart')}
      >
        <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
        {cartItemCount > 0 && (
          <span className="absolute top-1 right-1 bg-black text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
            {cartItemCount}
          </span>
        )}
      </button>

    </div>
  </div>

  {/* MOBILE SEARCH DROPDOWN */}
  <AnimatePresence>
    {showMobileSearch && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="absolute top-full left-0 right-0 bg-white border-b lg:hidden z-50"
      >
        <div className="px-6 py-4 flex gap-3 bg-white">
          <Input
            autoFocus
            placeholder="Search products..."
            className="h-12 rounded-full bg-slate-50 border-none focus:ring-1 focus:ring-pink-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <Button variant="ghost" onClick={() => setShowMobileSearch(false)} className="text-xs uppercase font-bold tracking-widest">
            Close
          </Button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.header>

      

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}

         <motion.aside
  initial={{ opacity: 0, x: -40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.4 }}
  className={`lg:w-64 space-y-8 bg-card text-card-foreground p-6 rounded-3xl h-fit border border-border ${isFilterOpen ? 'block' : 'hidden lg:block'}`}
>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Filters</h3>
              <X className="cursor-pointer" onClick={() => setIsFilterOpen(false)} />
            </div>

            {/* Categories */}

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">
                Shop Categories
              </h4>

              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => onSelectCategory(cat.id)}
                    className={`block text-sm w-full text-left px-3 py-2 rounded-xl transition-all
                      ${selectedCategory === cat.id
                        ? 'bg-pink-50 text-pink-600 font-bold'
                        : 'hover:bg-muted text-muted-foreground'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Types */}

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-900 mb-4">
                Skin Concern
              </h4>

              <div className="flex flex-wrap gap-2">
                {skinTypes.map(type => (
                  <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.85 }}
>
<Badge
    onClick={() => setSelectedSkinType(type)}
    className={`cursor-pointer px-3 py-1 rounded-full border shadow-none font-medium
      ${selectedSkinType === type
        ? ' border-pink-600'
        : 'bg-muted text-muted-foreground border-border hover:bg-accent'
      }`}
  >
    {type}
  </Badge>
  
</motion.div>
  
                ))}
              </div>
            </div>

            {/* Brand Select */}

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">
                Boutique Brands
              </h4>

              <select
                className="w-full bg-muted p-3 rounded-xl text-sm outline-none border border-border text-foreground font-medium transition-colors cursor-pointer"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {uniqueBrands.map(brand =>
                  <option key={brand} value={brand}>{brand}</option>
                )}
              </select>
            </div>

          </motion.aside>

          {/* Main */}

           <main className="flex-1">

            {selectedBrand !== 'All Brands' && (

              <h2 className="text-lg font-bold mb-6">
                Showing {selectedBrand} products
              </h2>

            )}

            {/* Popular Brands (BUTTON VERSION) */}

            <section className="mb-12">

              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center text-foreground mb-8">
    Popular Brands
  </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

                {popularBrands.map(brand => (

                  <motion.button
                   key={brand}
                   whileHover={{ scale: 1.1 }}
                   whileTap={{ scale: 0.9 }}
                   transition={{ type: "spring", stiffness: 400, damping: 10 }}
                   onClick={() => setSelectedBrand(brand)}
                   className={`px-7 py-3.5 rounded-full text-base font-semibold shadow-sm hover:shadow-md
                    ${selectedBrand === brand
                       ? 'bg-pink-600 text-slate-900 border-pink-600 shadow-lg' 
            : 'bg-card text-foreground border-border hover:bg-muted'
          }`}
                  >
                    {brand}
                  </motion.button>

                ))}
                   {selectedBrand !== 'All Brands' && (
                  <button 
                    onClick={() => setSelectedBrand('All Brands')}
                    className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-50 border border-pink-100"
                  >
                    Reset Filter
                  </button>
                  )}
              </div>
              
            </section>

            {/* Sort */}

            <div className="flex items-center justify-between mb-8">

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="lg:hidden rounded-full h-10 px-6"
                  onClick={() => setIsFilterOpen(true)}
                >
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>

                <h2 className="text-xl font-bold tracking-tight">
                  {filteredProducts.length} Results
                </h2>
              </div>

              <select
                className="bg-transparent font-bold text-sm outline-none cursor-pointer text-slate-600"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="brand-az">Sort by: Brand (A-Z)</option>
                <option value="price-low">Sort by: Price (Low)</option>
                <option value="price-high">Sort by: Price (High)</option>
              </select>

            </div>

            {/* Products */}

            <motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
>
              {sortedProducts.map(product => {

                const discount =
                  product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                return (

                  <motion.div variants={itemVariants}
                   whileHover={{ scale: 1.05, y: -10 }} >
  <Card 
  className="cursor-pointer group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-card border border-border shadow-sm" 
  onClick={() => onViewProduct(product)}
>
  <CardContent className="p-0 flex flex-col h-full">
    
    {/* 1. IMAGE CONTAINER: Perfectly Square & Adaptable */}
    <div className="relative aspect-square w-full bg-muted flex items-center justify-center p-6 overflow-hidden transition-colors duration-500">
      <img 
        src={product.image} 
        alt={product.name} 
        /* object-contain ensures tall or wide bottles never stretch or get cropped */
        className="max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-110" 
      />
      
      {/* Discount Badge */}
      {product.originalPrice && product.originalPrice > product.price && (
        <Badge className="absolute top-4 left-4 md:top-6 md:left-6 bg-red-600 text-white font-black px-2.5 py-1 rounded-full text-[10px] shadow-lg border-none">
          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
        </Badge>
      )}
    </div>

    {/* 2. TEXT CONTENT: Flex-Grow ensures bottoms always align perfectly */}
    <div className="p-6 md:p-8 flex flex-col flex-grow justify-between bg-card transition-colors duration-500">
      
      {/* Top Half of Text: Brand, Name, Rating */}
      <div>
        <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-2">
          {product.brand}
        </p>
        
        {/* line-clamp-2 forces the title to take up exactly 2 lines max, keeping heights uniform */}
        <h4 className="font-bold text-sm md:text-base lg:text-lg text-foreground line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
          {product.name}
        </h4>

        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-[11px] font-bold text-muted-foreground">
            {product.rating || '5.0'}
          </span>
        </div>
      </div>
      
      {/* Bottom Half of Text: Price (Pushed to bottom by flex-grow) */}
      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-black text-foreground text-lg md:text-xl">
          KSh {product.price?.toLocaleString()}
        </span>

        {product.originalPrice && (
          <span className="text-xs text-muted-foreground line-through italic">
            KSh {product.originalPrice.toLocaleString()}
          </span>
        )}
      </div>

    </div>
  </CardContent>
</Card>

                  </motion.div>

                )

              })}

            </motion.div>

          </main>

        </div>
      </div>

    </motion.div>
  );
}