import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  MessageCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import emailjs from '@emailjs/browser';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "./ui/dialog";

export default function CartPage({ 
  onNavigate, 
  user, 
  cart = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  sendToWhatsApp, 
  clearCart 
}) {
  const subtotal = cart.reduce((total, item) => total + ((item?.product?.price || 0) * item.quantity), 0);
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 200;
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

      // 2. Send Business Notification
      await emailjs.send(
        'gmail_mbr1o37', 
        'template_e9sjfr2', 
        templateParams, 
        'MjSbLT7eGDI_KfpOs'
      );

      alert('Order successful! A receipt has been sent to your email.');
      
      if (clearCart) clearCart();
      onNavigate('home');
      
    } catch (err) {
      console.error('EmailJS Error:', err);
      alert('Order processed, but there was an issue sending the emails.');
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
    <div className="min-h-screen bg-background pb-10">
      {Header}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4 flex gap-4">
                  <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-contain rounded bg-white" />
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
                      <span className="w-4 text-center">{item.quantity}</span>
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
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `KSh ${shipping}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Button onClick={handleCheckout} className="w-full bg-black text-white h-12 rounded-xl font-bold">
                    Complete Purchase (Email)
                  </Button>

                  {/* WhatsApp Popup Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 h-12 text-white flex items-center justify-center gap-2 rounded-xl font-bold"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Order via WhatsApp
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-green-600" />
                          WhatsApp Checkout
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col items-center py-6 text-center">
                        <div className="bg-green-50 p-4 rounded-full mb-4">
                          <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                          We will redirect you to WhatsApp with your order details. You can chat with us to confirm delivery and payment via M-Pesa.
                        </p>
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-11"
                          onClick={() => {
                            sendToWhatsApp(cart, total, user?.phone || "Not Provided");
                          }}
                        >
                          Send Order to WhatsApp
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}