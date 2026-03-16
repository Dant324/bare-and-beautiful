import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Star, ArrowLeft, Grid, List, Filter, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
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

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}

      <motion.header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
             <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            Bare and Beautiful
          </h1>
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

          {/* Sidebar */}

          <aside className={`lg:w-64 space-y-8 bg-white p-6 rounded-3xl h-fit border border-slate-100 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>

            <div className="flex items-center justify-between lg:hidden mb-4">
              <h3 className="font-bold">Filters</h3>
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
                        : 'hover:bg-slate-50 text-slate-600'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Types */}

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">
                Skin Concern
              </h4>

              <div className="flex flex-wrap gap-2">
                {skinTypes.map(type => (
                  <Badge
                    key={type}
                    onClick={() => setSelectedSkinType(type)}
                    className={`cursor-pointer px-3 py-1 rounded-full border shadow-none font-medium
                      ${selectedSkinType === type
                        ? 'bg-pink-600 text-black border-pink-600'
                        : 'bg-white text-slate-500 border-slate-200'
                      }`}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Brand Select */}

            <div>
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4">
                Boutique Brands
              </h4>

              <select
                className="w-full bg-slate-50 p-3 rounded-xl text-sm outline-none border border-slate-100 font-medium"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                {uniqueBrands.map(brand =>
                  <option key={brand} value={brand}>{brand}</option>
                )}
              </select>
            </div>

          </aside>

          {/* Main */}

           <main className="flex-1">

            {selectedBrand !== 'All Brands' && (

              <h2 className="text-lg font-bold mb-6">
                Showing {selectedBrand} products
              </h2>

            )}

            {/* Popular Brands (BUTTON VERSION) */}

            <section className="mb-8">

              <h3 className="text-center font-black uppercase tracking-widest text-[10px] text-slate-400 mb-5">
                Popular Brands
              </h3>

              <div className="flex flex-wrap justify-center gap-3">

                {popularBrands.map(brand => (

                  <motion.button
                    key={brand}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBrand(brand)}
                   className={`px-7 py-3.5 rounded-full text-base font-semibold shadow-sm hover:shadow-md
                    ${selectedBrand === brand
                        ? 'bg-pink-600 text- border-pink-600 shadow-md'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-pink-400 hover:text-pink-600'
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

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {sortedProducts.map(product => {

                const discount =
                  product.originalPrice && product.originalPrice > product.price
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : null;

                return (

                  <Card
                    key={product.id}
                    className="cursor-pointer group hover:shadow-2xl transition-all duration-500 border-none rounded-[2.5rem] shadow-sm overflow-hidden"
                    onClick={() => onViewProduct(product)}
                  >

                    <CardContent className="p-0 flex flex-col h-full">

                      <div className="relative bg-slate-50 flex items-center justify-center p-6 aspect-square">

                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        />

                        {discount && (
                          <Badge className="absolute top-6 left-6 bg-red-600 text-black font-black text-[10px] px-2.5 py-1 rounded-full border-none">
                            {discount}% OFF
                          </Badge>
                        )}

                      </div>

                      <div className="p-8 bg-white flex-grow flex flex-col justify-between">

                        <div>

                          <p className="text-[10px] text-[#8B4513] font-black uppercase tracking-[0.15em] mb-2">
                            {product.brand}
                          </p>

                          <h4 className="font-medium text-sm md:text-base text-slate-700 line-clamp-2 mb-2">
                            {product.name}
                          </h4>

                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-[11px] font-bold text-slate-400">
                              {product.rating || '5.0'}
                            </span>
                          </div>

                        </div>

                        <div className="mt-6 flex items-baseline gap-2">

                          <span className="font-black text-slate-900 text-lg">
                            KSh {product.price?.toLocaleString()}
                          </span>

                          {product.originalPrice && (
                            <span className="text-xs text-slate-300 line-through italic">
                              KSh {product.originalPrice.toLocaleString()}
                            </span>
                          )}

                        </div>

                      </div>

                    </CardContent>

                  </Card>

                )

              })}

            </div>

          </main>

        </div>
      </div>

    </div>
  );
}