import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';

export default function ProfilePage({ onNavigate, user, onLogout }) {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    beautyTips: true,
    newsletter: false,
  });

  // If not logged in → show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your profile
          </p>
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

      {/* Page Body → You can plug back in Tabs, Cards, Orders, Favorites, Settings, etc. */}
      <div className="container mx-auto px-4 py-6">
        <p className="text-muted-foreground">Profile content goes here...</p>
      </div>
    </div>
  );
}
