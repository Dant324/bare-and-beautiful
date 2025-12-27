import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, ShoppingBag, Heart, LogOut, Package, 
  Settings, Phone, Mail, ShieldCheck 
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Input } from './ui/input';

export default function ProfilePage({ 
  onNavigate, 
  user, 
  onLogout, 
  wishlist = [], // FIXED: Now correctly receives wishlist array from App.jsx
  onViewProduct,  // Added: To allow clicking wishlist items to view details
  onUpdateProfile
}) {
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const handleSaveName = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ name }); // Pass the new name to a function in App.jsx
    }
    setIsEditingName(false);
  };

  const handleSavePhone = () => {
    if (onUpdateProfile) {
      onUpdateProfile({ phone }); 
    }
    setIsEditingPhone(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <div>
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <Button onClick={() => onNavigate('login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-xl font-bold">My Account</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-red-600">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8">
          
          {/* 1. User Info Card */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-6 bg-white">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                  <User className="w-12 h-12" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-1">
                  
                  {/* Name Editing Section */}
                  {isEditingName ? (
                    <div className="flex justify-center md:justify-start gap-2 items-center mb-2">
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="h-9 w-full max-w-[200px]" 
                      />
                      <Button size="sm" onClick={handleSaveName}>Save</Button>
                    </div>
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                      {user.name || 'User'} 
                      <Button variant="link" size="sm" className="text-pink-600 p-0 h-auto" onClick={() => setIsEditingName(true)}>Edit</Button>
                    </h2>
                  )}

                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" /> {user.email}
                  </p>

                  {/* Phone Editing Section - FIXED VARIABLE NAMES HERE */}
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {isEditingPhone ? (
                      <div className="flex gap-2">
                        <Input 
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07..."
                          className="h-8 w-40"
                        />
                        <Button size="sm" onClick={handleSavePhone}>Save</Button>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-700">
                        {phone || 'No phone added'} 
                        <Button variant="link" size="sm" className="text-pink-600 p-0 ml-2 h-auto" onClick={() => setIsEditingPhone(true)}>Edit</Button>
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified Member
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 2. Tabs Section */}
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-200/50 p-1">
              <TabsTrigger value="orders" className="data-[state=active]:bg-white">Order History</TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-white">Wishlist ({wishlist.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <div className="space-y-4">
                <Card className="border-none shadow-sm">
                  <CardHeader><CardTitle className="text-lg">Recent Orders</CardTitle></CardHeader>
                  <CardContent className="text-center py-10 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No recent orders found.</p>
                    <Button variant="outline" className="mt-4 border-pink-200 text-pink-600 hover:bg-pink-50" onClick={() => onNavigate('products')}>
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="py-2">
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlist.map(product => (
                    <Card 
                      key={product.id} 
                      className="cursor-pointer hover:shadow-md transition-all overflow-hidden border-none shadow-sm"
                      onClick={() => onViewProduct(product)}
                    >
                      <div className="aspect-square bg-white flex items-center justify-center p-4">
                        <img src={product.image} className="max-w-full max-h-full object-contain" alt={product.name} />
                      </div>
                      <div className="p-3 bg-white border-t">
                         <p className="text-sm font-bold truncate text-slate-800">{product.name}</p>
                         <p className="text-xs font-bold text-pink-600 mt-1">KSh {product.price?.toLocaleString()}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-none shadow-sm p-12 text-center">
                  <Heart className="w-12 h-12 mx-auto mb-2 text-slate-200" />
                  <p className="text-muted-foreground">Your wishlist is empty.</p>
                  <Button variant="link" onClick={() => onNavigate('products')} className="text-pink-600">Browse Products</Button>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}