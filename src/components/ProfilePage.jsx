import React, { useState } from 'react';
import { motion } from 'framer-motion'; // fixed import
import { 
  ArrowLeft, 
  User, 
  ShoppingBag, 
  Heart, 
  LogOut,
  Package,
  Star,
  Calendar,
  CreditCard,
  Bell,
  Shield,
  HelpCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { ImageWithFallback } from './figma/ImageWithFallback';

const orderHistory = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'Delivered',
    total: 4200,
    items: [
      {
        name: 'Hydrating Vitamin C Serum',
        brand: 'GlowSecrets',
        image: 'https://images.unsplash.com/photo-1714041691623-35d1b8c5e28b?...',
        quantity: 1,
        price: 2800
      },
      {
        name: 'Night Repair Moisturizer',
        brand: 'GlowSecrets',
        image: 'https://images.unsplash.com/photo-1667242003558-e42942d2b911?...',
        quantity: 1,
        price: 3500
      }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-01-05',
    status: 'Processing',
    total: 1800,
    items: [
      {
        name: 'Flawless Foundation',
        brand: 'Bare and Beautiful',
        image: 'https://images.unsplash.com/photo-1632147340366-2756f13bfafc?...',
        quantity: 1,
        price: 1800
      }
    ]
  }
];

const favoriteProducts = [
  {
    id: '1',
    name: 'Hydrating Vitamin C Serum',
    brand: 'GlowSecrets',
    price: 2800,
    originalPrice: 3200,
    image: 'https://images.unsplash.com/photo-1714041691623-35d1b8c5e28b?...',
    rating: 4.8
  },
  {
    id: '5',
    name: 'Eyeshadow Palette Pro',
    brand: 'Bare and Beautiful',
    price: 2200,
    originalPrice: 2800,
    image: 'https://images.unsplash.com/photo-1594903696739-2551e8c2d0f1?...',
    rating: 4.9
  }
];

export default function ProfilePage({ onNavigate, user, onLogout }) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    beautyTips: true,
    newsletter: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile</p>
          <Button onClick={() => onNavigate('login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
              <h1 className="text-xl font-bold text-primary">My Profile</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Page Body (unchanged, your Tabs, Cards, Orders, etc.) */}
      {/* Keep your existing code from here down, since main bug fixes were: 
          - removed TypeScript annotations
          - fixed motion props
          - corrected notifications state 
      */}
    </div>
  );
}
