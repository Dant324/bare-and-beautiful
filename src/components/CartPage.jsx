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
import emailjs from '@emailjs/browser';

export default function CartPage({ 
  onNavigate, 
  user, 
  cart = [], 
  onUpdateQuantity, 
  onRemoveItem 
}) {
  const subtotal = cart.reduce((total, item) => total + ((item?.product?.price || 0) * item.quantity), 0);
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    const templateParams = {
      user_email: user.email, 
      user_name: user.name || user.email, 
      order_id: `BB-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart.map(item => `• ${item.product.name} (x${item.quantity})`).join('\n'),
      total_price: `KSh ${total.toLocaleString()}`
    };

    try {
      // 1. Send Customer Receipt
      await emailjs.send(
        'gmail_mbr1o37', 
        'template_0w0xp35', 
        templateParams, 
        'MjSbLT7eGDI_KfpOs'
      );

      // 2. Send Business Notification (Updated Template ID)
      await emailjs.send(
        'gmail_mbr1o37', 
        'template_e9sjfr2', 
        templateParams, 
        'MjSbLT7eGDI_KfpOs'
      );

      alert('Order successful! A receipt has been sent to your email and the business has been notified.');
      
      // Optional: If you want to clear the cart after success, 
      // you would typically call a function from props here.
      
    } catch (err) {
      console.error('EmailJS Error:', err);
      alert('Order processed, but there was an issue sending the confirmation emails. Please contact support.');
    }
  };
  const Header = (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-xl font-bold text-primary">Shopping Cart</h1>
        </div>
        {user && <span className="text-sm font-medium">{user.name}</span>}
      </div>
    </motion.header>
  );

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {Header}
        <div className="container mx-auto px-4 py-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <Button onClick={() => onNavigate('products')} className="mt-4">Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {Header}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4 flex gap-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-bold">{item.product.name}</h3>
                      <Button variant="ghost" size="sm" onClick={() => onRemoveItem(item.product.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                    <p className="text-pink-600 font-medium">KSh {item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>-</Button>
                      <span>{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>+</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `KSh ${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full bg-gradient-to-r from-pink-600 to-orange-600 h-12 text-white">
                  Complete Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}