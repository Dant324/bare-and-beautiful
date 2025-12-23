import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  User,
  Shield,
  Truck,
  CreditCard
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export default function CartPage({ 
  onNavigate, 
  user, 
  cart, 
  onUpdateQuantity, 
  onRemoveItem 
}) {
  const subtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;
  const savings = cart.reduce((total, item) => {
    const originalPrice = item.product.originalPrice || item.product.price;
    return total + ((originalPrice - item.product.price) * item.quantity);
  }, 0);

  const handleCheckout = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    alert('Checkout feature would be implemented with payment processing');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('home')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-xl font-bold text-primary">Shopping Cart</h1>
              </div>

              <div className="flex items-center gap-3">
                {user ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('profile')}
                    className="hidden md:flex"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.name}
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('login')}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </p>
            <Button 
              size="lg"
              onClick={() => onNavigate('products')}
              className="bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
            >
              Start Shopping
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // rest of your cart rendering...
}
