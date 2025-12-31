import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Heart, Star, ArrowLeft, User, Grid, List } from 'lucide-react';
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

const brands = ['All Brands', 'GlowSecrets', 'Bare and Beautiful', 'DerStore'];

const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under1000', label: 'Under KSh 1,000', min: 0, max: 1000 },
  { id: '1000-2000', label: 'KSh 1,000 - 2,000', min: 1000, max: 2000 },
  { id: '2000-3000', label: 'KSh 2,000 - 3,000', min: 2000, max: 3000 },
  { id: 'over3000', label: 'Over KSh 3,000', min: 3000, max: Infinity }
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
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const [products, setProducts] = useState([]);

  // Fetch products from Firestore
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
  if (!mounted) return null; // prevent SSR issues

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand;
    const priceRange = priceRanges.find(range => range.id === selectedPriceRange);
    const matchesPrice = priceRange ? 
      product.price >= priceRange.min && product.price <= priceRange.max : true;
    return matchesCategory && matchesSearch && matchesBrand && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return (b.rating || 0) - (a.rating || 0);
      case 'newest': return b.id.localeCompare(a.id);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-xl font-bold text-primary">Bare and Beautiful</h1>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 bg-input-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')} className="hidden md:flex">
                <User className="w-4 h-4 mr-2" />
                {user.name}
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => onNavigate('login')}>
                Sign In
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => onNavigate('cart')}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products</h2>
          <div className="flex gap-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

       <div className={viewMode === 'grid' 
  ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6' 
  : 'flex flex-col gap-4'}>
  
 {sortedProducts.map(product => {
  // 1. Calculate the dynamic discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Card 
      key={product.id} 
      className={`cursor-pointer hover:shadow-xl transition-all flex flex-col overflow-hidden rounded-2xl border-none shadow-sm ${
        viewMode === 'list' ? 'flex-row h-32 md:h-48' : 'h-full'
      }`}
      onClick={() => onViewProduct(product)}
    >
      <CardContent className={`p-0 flex ${viewMode === 'list' ? 'flex-row w-full' : 'flex-col h-full'}`}>
        
        {/* 2. Image Container: Consistent Scaling */}
        <div className={`relative bg-white flex items-center justify-center p-4 border-slate-50 ${
          viewMode === 'list' ? 'w-32 md:w-48 flex-shrink-0' : 'aspect-square border-b'
        }`}>
          <img
            src={product.image}
            alt={product.name}
            /* Object-contain prevents the "phone screenshot" stretching issue */
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
          />
          
          {/* 3. Dynamic Badge: Shows exact percentage off */}
          {discountPercentage && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-red font-bold text-[9px] px-2 py-0.5 rounded-full">
              {discountPercentage}% OFF
            </Badge>
          )}
        </div>

        {/* Info Container */}
        <div className="p-4 flex flex-col flex-grow justify-between bg-white">
          <div className="space-y-1">
            <p className="text-[10px] text-pink-600 font-bold uppercase tracking-widest">
              {product.brand}
            </p>
            {/* line-clamp-2 keeps row heights even if names are long */}
            <h4 className="font-bold text-sm md:text-base text-slate-800 leading-snug line-clamp-2">
              {product.name}
            </h4>
            <div className="flex items-center gap-1.5 pt-1">
               <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 border-none" />
               <span className="text-[11px] font-medium text-slate-500">{product.rating || '5.0'}</span>
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-bold text-slate-900 text-sm md:text-lg">
              KSh {product.price?.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] md:text-xs text-slate-400 line-through font-medium">
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
      </div>
    </div>
  );
}
