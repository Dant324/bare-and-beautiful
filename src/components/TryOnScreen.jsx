import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Download, 
  RotateCcw, 
  LogOut, 
  User, 
  Sparkles 
} from 'lucide-react';

const hairstyles = [
  { id: 1, name: 'Classic Bob', category: 'Short', popularity: 'Trending' },
  { id: 2, name: 'Long Waves', category: 'Long', popularity: 'Popular' },
  { id: 3, name: 'Pixie Cut', category: 'Short', popularity: 'New' },
  { id: 4, name: 'Beach Curls', category: 'Medium', popularity: 'Hot' },
  { id: 5, name: 'Straight Lob', category: 'Medium', popularity: 'Classic' },
  { id: 6, name: 'Afro Style', category: 'Textured', popularity: 'Trending' },
];

export default function TryOnScreen({ onNavigate, onLogout }) {
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [liked, setLiked] = useState([]);

  const toggleLike = (styleId) => {
    setLiked((prev) =>
      prev.includes(styleId)
        ? prev.filter((id) => id !== styleId)
        : [...prev, styleId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('camera')}
          className="text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retake
        </Button>
        <h1 className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Try-On Results
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* 3D Avatar Display */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            key={selectedStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Mock 3D Avatar */}
            <div className="w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center relative">
                <User className="w-32 h-32 text-white" />
                
                {/* Hairstyle Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-orange-300/20 to-yellow-300/20 rounded-full"
                />
              </div>

              {/* Style Name Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              >
                <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-lg px-4 py-2">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {hairstyles[selectedStyle].name}
                </Badge>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleLike(hairstyles[selectedStyle].id)}
                className={`w-10 h-10 rounded-full ${
                  liked.includes(hairstyles[selectedStyle].id) 
                    ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                    : 'bg-white/80 hover:bg-white'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    liked.includes(hairstyles[selectedStyle].id) ? 'fill-current' : ''
                  }`}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="w-10 h-10 rounded-full bg-white/80 hover:bg-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Style Selector */}
        <div className="w-full lg:w-96 p-6 bg-white/50 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl mb-2">Choose Your Style</h2>
            <p className="text-sm text-muted-foreground">
              Swipe or click to try different hairstyles
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {hairstyles.map((style, index) => (
              <motion.div
                key={style.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:bg-white/80 ${
                    selectedStyle === index
                      ? 'ring-2 ring-purple-500 bg-purple-50'
                      : ''
                  }`}
                  onClick={() => setSelectedStyle(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{style.name}</h3>
                        <p className="text-sm text-muted-foreground">{style.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={style.popularity === 'Trending' ? 'default' : 'secondary'}
                          className={
                            style.popularity === 'Trending'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                              : ''
                          }
                        >
                          {style.popularity}
                        </Badge>
                        {liked.includes(style.id) && (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Save This Look
            </Button>
            <Button
              variant="outline"
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
              onClick={() => onNavigate('camera-prep')}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Another Style
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
