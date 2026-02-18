import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Star, ArrowLeft, Grid, List, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { db } from './firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  cartItemCount 
}) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Extract unique brands for the filter
  const uniqueBrands = ['All Brands', ...new Set(products.map(p => p.brand).filter(Boolean))];

  // FIXED SEARCH ENGINE
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    // Search both Name and Brand strings for accuracy
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (product.name?.toLowerCase().includes(searchLower)) ||
                          (product.brand?.toLowerCase().includes(searchLower));
                          
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const matchesSkin = selectedSkinType === 'All' || product.skinType === selectedSkinType;
    
    return matchesCategory && matchesSearch && matchesBrand && matchesSkin;
  });

  // UPDATED SORTING LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'brand-az') return (a.brand || "").localeCompare(b.brand || ""); // NEW: Sort by Brand Name
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <motion.header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-xl font-bold text-primary hidden md:block">Bare and Beautiful</h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input 
                placeholder="Search brands or products..." 
                className="pl-10 bg-slate-100 border-none rounded-full h-10 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative" onClick={() => onNavigate('cart')}>
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-pink-600 text-white border-none min-w-[20px] h-5 flex items-center justify-center p-1 rounded-full text-[10px]">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 space-y-8 bg-white p-6 rounded-3xl h-fit border border-slate-100 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between lg:hidden mb-4">
               <h3 className="font-bold">Filters</h3>
               <X className="cursor-pointer" onClick={() => setIsFilterOpen(false)} />
            </div>

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Shop Categories</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat.id)}
                    className={`block text-sm w-full text-left px-3 py-2 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-pink-50 text-pink-600 font-bold' : 'hover:bg-slate-50 text-slate-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Skin Concern</h4>
              <div className="flex flex-wrap gap-2">
                {skinTypes.map(type => (
                  <Badge 
                    key={type}
                    onClick={() => setSelectedSkinType(type)}
                    className={`cursor-pointer px-3 py-1 rounded-full border shadow-none font-medium transition-all ${selectedSkinType === type ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-500 border-slate-200'}`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">Boutique Brands</h4>
              <select 
                className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none border border-slate-100 font-medium"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="lg:hidden rounded-full h-10 px-6" onClick={() => setIsFilterOpen(true)}>
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
                <h2 className="text-xl font-bold tracking-tight">{filteredProducts.length} Results</h2>
              </div>
              <div className="flex items-center gap-4">
                {/* NEW: Updated Sort Selector including Brand A-Z */}
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
                <div className="hidden md:flex bg-white p-1 rounded-xl border border-slate-100">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-lg"><Grid className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-lg"><List className="w-4 h-4" /></Button>
                </div>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {sortedProducts.map(product => {
                const discount = product.originalPrice && product.originalPrice > product.price
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : null;

                return (
                  <Card 
                    key={product.id} 
                    className={`cursor-pointer group hover:shadow-2xl transition-all duration-500 border-none rounded-[2.5rem] shadow-sm overflow-hidden ${viewMode === 'list' ? 'flex-row h-48' : 'h-full flex flex-col'}`}
                    onClick={() => onViewProduct(product)}
                  >
                    <CardContent className={`p-0 flex ${viewMode === 'list' ? 'flex-row w-full' : 'flex-col h-full'}`}>
                      <div className={`relative bg-slate-50/50 flex items-center justify-center p-6 ${viewMode === 'list' ? 'w-48' : 'aspect-square'}`}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                        {discount && (
                          <Badge className="absolute top-6 left-6 bg-red-600 text-black font-black text-[10px] px-2.5 py-1 rounded-full shadow-lg border-none">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>

                      <div className="p-8 bg-white flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-[#8B4513] font-black uppercase tracking-[0.15em] mb-2">{product.brand}</p>
                          
                          {/* REDUCED FONT FOR PRODUCT NAME */}
                          <h4 className="font-medium text-sm md:text-base text-slate-700 line-clamp-2 leading-tight h-10 mb-2">
                            {product.name}
                          </h4>
                          
                          <div className="flex items-center gap-1.5">
                             <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 border-none" />
                             <span className="text-[11px] font-bold text-slate-400">{product.rating || '5.0'}</span>
                          </div>
                        </div>
                        <div className="mt-6 flex items-baseline gap-2">
                          <span className="font-black text-slate-900 text-lg">KSh {product.price?.toLocaleString()}</span>
                          {product.originalPrice && <span className="text-xs text-slate-300 line-through font-medium italic">KSh {product.originalPrice.toLocaleString()}</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 