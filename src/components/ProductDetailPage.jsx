import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, ArrowLeft, Heart, Star, Minus, Plus, 
  Shield, Truck, RotateCcw, User, Share2, CheckCircle2 
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

const reviews = [
  { id: '1', user: 'Sarah M.', rating: 5, date: '2 weeks ago', comment: 'Amazing product! My skin has never looked better.', verified: true },
  { id: '2', user: 'Mercy K.', rating: 4, date: '1 month ago', comment: 'Great quality and fast delivery.', verified: true },
  { id: '3', user: 'Jane W.', rating: 5, date: '1 month ago', comment: 'Perfect! Exactly what I was looking for.', verified: false }
];

export default function ProductDetailPage({ 
  onNavigate, user, product, onAddToCart, cartItemCount, toggleWishlist, isFavorite 
}) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => onAddToCart(product, quantity);
  const handleBuyNow = () => { onAddToCart(product, quantity); onNavigate('cart'); };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-10">
      <motion.header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('products')}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
            <h1 className="text-xl font-bold text-primary hidden md:block">Bare and Beautiful</h1>
            <h1 className="text-sm font-bold text-primary md:hidden truncate max-w-[120px]">{product.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm"><Share2 className="w-4 h-4" /></Button>
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')} className="hidden md:flex"><User className="w-4 h-4 mr-2" />{user.name}</Button>
            ) : <Button variant="ghost" size="sm" onClick={() => onNavigate('login')}>Sign In</Button>}
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

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative">
            <div className="relative overflow-hidden rounded-2xl bg-white border shadow-sm flex items-center justify-center p-4">
              <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-contain transition-transform duration-700 hover:scale-110" />
              <Button 
                variant="secondary" 
                size="icon" 
                className={`absolute top-4 right-4 rounded-full shadow-md transition-all ${isFavorite ? 'bg-black text-pink-400 hover:bg-slate-800' : 'bg-white text-slate-400'}`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              {discountPercentage && <Badge className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1">{discountPercentage}% OFF</Badge>}
            </div>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">{product.brand}</p>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">{product.name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="font-bold text-sm">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground underline">{product.reviewCount} reviews</span>
                <span className="text-xs text-green-600 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3" /> In Stock</span>
              </div>
            </div>
            <div className="flex items-center gap-4 border-b pb-6">
              <span className="text-3xl font-bold text-primary">KSh {product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through opacity-50">KSh {product.originalPrice.toLocaleString()}</span>}
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{product.description}</p>
            <div className="hidden md:block space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-bold">Quantity:</span>
                <div className="flex items-center border rounded-xl overflow-hidden bg-muted/20">
                  <Button variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 px-4"><Minus className="w-4 h-4" /></Button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <Button variant="ghost" onClick={() => setQuantity(quantity + 1)} className="h-10 px-4"><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 bg-black text-white h-14 rounded-xl" onClick={handleAddToCart}>Add to Cart</Button>
                <Button size="lg" variant="outline" className="flex-1 h-14 rounded-xl border-2" onClick={handleBuyNow}>Buy Now</Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-6 border-t">
              <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1"><Truck className="w-5 h-5 mx-auto text-slate-600" /><p className="text-[10px] font-bold">Free Delivery</p></div>
              <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1"><Shield className="w-5 h-5 mx-auto text-slate-600" /><p className="text-[10px] font-bold">Authentic</p></div>
              <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1"><RotateCcw className="w-5 h-5 mx-auto text-slate-600" /><p className="text-[10px] font-bold">Easy Returns</p></div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t p-4 flex items-center gap-3 z-50 md:hidden">
        <div className="flex items-center border rounded-xl bg-muted/30 h-12">
          <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-3 h-3" /></Button>
          <span className="w-6 text-center text-sm font-bold">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="w-3 h-3" /></Button>
        </div>
        <Button onClick={handleAddToCart} className="flex-1 h-12 bg-black text-white rounded-xl font-bold text-sm">Add to Cart</Button>
        <Button onClick={handleBuyNow} className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-sm">Buy Now</Button>
      </motion.div>
    </div>
  );
}