import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Star, ArrowLeft, User, Grid, List, Filter, X } from 'lucide-react';
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

const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under1000', label: 'Under KSh 1,000', min: 0, max: 1000 },
  { id: '1000-2000', label: 'KSh 1,000 - 2,000', min: 1000, max: 2000 },
  { id: 'over2000', label: 'Over KSh 2,000', min: 2000, max: Infinity }
];

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
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // For mobile filter toggle

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

  // Advanced Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const matchesSkin = selectedSkinType === 'All' || product.skinType === selectedSkinType;
    
    const priceRange = priceRanges.find(range => range.id === selectedPriceRange);
    const matchesPrice = priceRange ? 
      product.price >= priceRange.min && product.price <= priceRange.max : true;
      
    return matchesCategory && matchesSearch && matchesBrand && matchesPrice && matchesSkin;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
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
                placeholder="Search products..." 
                className="pl-10 bg-slate-100 border-none rounded-full h-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative" onClick={() => onNavigate('cart')}>
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-pink-600 text-white">{cartItemCount}</Badge>
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
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Categories</h4>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => onSelectCategory(cat.id)}
                    className={`block text-sm w-full text-left px-3 py-2 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-pink-50 text-pink-600 font-bold' : 'hover:bg-slate-50'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Skin Type</h4>
              <div className="flex flex-wrap gap-2">
                {skinTypes.map(type => (
                  <Badge 
                    key={type}
                    onClick={() => setSelectedSkinType(type)}
                    className={`cursor-pointer px-3 py-1 rounded-full border ${selectedSkinType === type ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-600 border-slate-200'}`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Brands</h4>
              <select 
                className="w-full bg-slate-50 p-2 rounded-xl text-sm outline-none border border-slate-100"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" className="lg:hidden" onClick={() => setIsFilterOpen(true)}>
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
                <h2 className="text-xl font-bold">{filteredProducts.length} Products Found</h2>
              </div>
              <div className="flex items-center gap-4">
                <select 
                  className="bg-transparent font-bold text-sm outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Sort by Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="hidden md:flex bg-white p-1 rounded-xl border border-slate-100">
                  <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}><Grid className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}><List className="w-4 h-4" /></Button>
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
                    className={`cursor-pointer hover:shadow-2xl transition-all duration-300 border-none rounded-[2rem] shadow-sm overflow-hidden ${viewMode === 'list' ? 'flex-row h-48' : 'h-full flex flex-col'}`}
                    onClick={() => onViewProduct(product)}
                  >
                    <CardContent className={`p-0 flex ${viewMode === 'list' ? 'flex-row w-full' : 'flex-col h-full'}`}>
                      <div className={`relative bg-white flex items-center justify-center p-6 ${viewMode === 'list' ? 'w-48' : 'aspect-square'}`}>
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" />
                        {discount && (
                          <Badge className="absolute top-4 left-4 bg-red-600 text-white font-black text-[10px] px-2 py-1 rounded-full shadow-lg">
                            {discount}% OFF
                          </Badge>
                        )}
                      </div>

                      <div className="p-6 bg-white flex-grow flex flex-col justify-between">
                        <div>
                          <p className="text-[11px] text-[#8B4513] font-black uppercase tracking-widest mb-2">{product.brand}</p>
                          <h4 className="font-bold text-slate-800 text-base line-clamp-2 leading-tight mb-2">{product.name}</h4>
                          <div className="flex items-center gap-1">
                             <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                             <span className="text-xs font-bold text-slate-500">{product.rating || '5.0'}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                          <span className="font-black text-pink-600 text-lg">KSh {product.price?.toLocaleString()}</span>
                          {product.originalPrice && <span className="text-xs text-slate-300 line-through">KSh {product.originalPrice.toLocaleString()}</span>}
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