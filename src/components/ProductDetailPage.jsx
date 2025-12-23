import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Heart, 
  Star, 
  Minus, 
  Plus, 
  Shield, 
  Truck, 
  RotateCcw,
  User,
  Share2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Sample reviews
const reviews = [
  {
    id: '1',
    user: 'Sarah M.',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Amazing product! My skin has never looked better. Highly recommend!',
    verified: true
  },
  {
    id: '2',
    user: 'Mercy K.',
    rating: 4,
    date: '1 month ago',
    comment: 'Great quality and fast delivery. Will definitely purchase again.',
    verified: true
  },
  {
    id: '3',
    user: 'Jane W.',
    rating: 5,
    date: '1 month ago',
    comment: 'Perfect! Exactly what I was looking for. The packaging is beautiful too.',
    verified: false
  }
];

export default function ProductDetailPage({ 
  onNavigate, 
  user, 
  product, 
  onAddToCart, 
  cartItemCount 
}) {
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

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
            <Button variant="ghost" size="sm" onClick={() => onNavigate('products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-bold text-primary">Bare and Beautiful</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>

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

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-muted/30">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-96 lg:h-[500px] object-cover"
              />
              
              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-4 right-4 bg-white/80 hover:bg-white ${isFavorite ? 'text-red-500' : ''}`}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>

              {discountPercentage && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Brand, Name, Rating */}
            <div className="space-y-2">
              <p className="text-muted-foreground">{product.brand}</p>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl md:text-3xl font-bold">
                  KSh {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-green-600">
                  You save KSh {(product.originalPrice - product.price).toLocaleString()}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Benefits */}
            {product.benefits && (
              <div>
                <h3 className="font-medium mb-3">Key Benefits</h3>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((benefit, index) => (
                    <Badge key={index} variant="secondary">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Cart Buttons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="px-3">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="sm:w-auto">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Free Delivery</p>
                <p className="text-xs font-medium">Orders over KSh 2,000</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
                <p className="text-xs font-medium">30-day policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Authentic</p>
                <p className="text-xs font-medium">100% Genuine</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs (Description, Ingredients, Reviews) */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Product Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Key Ingredients</h3>
                  {product.ingredients ? (
                    <div className="space-y-3">
                      {product.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <p className="font-medium">{ingredient}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Full ingredient list available on packaging.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold">{product.rating}</div>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
                      </div>
                    </div>
                    <Button className="w-full">Write a Review</Button>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
