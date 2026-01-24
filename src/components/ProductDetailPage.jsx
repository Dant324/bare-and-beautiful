import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, ArrowLeft, Heart, Star, Minus, Plus, 
  Shield, Truck, RotateCcw, User, Share2, CheckCircle2 
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

// ADDED MISSING IMPORTS
import { ImageWithFallback } from './figma/ImageWithFallback';
import { db } from "./firebase/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from "firebase/firestore";

export default function ProductDetailPage({ 
  onNavigate, user, product, onAddToCart, cartItemCount, toggleWishlist, isFavorite 
}) {
  const [quantity, setQuantity] = useState(1);
  const [reviewsList, setReviewsList] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(null);
  const [activeImg, setActiveImg] = useState(product?.image); // Track gallery state

  // Fetch reviews and handle user state
  const fetchReviews = async () => {
    if (!product?.id) return;
    try {
      const q = query(
        collection(db, "reviews"), 
        where("productId", "==", product.id), 
        orderBy("date", "desc")
      );
      const snap = await getDocs(q);
      const fetchedReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviewsList(fetchedReviews);

      if (user) {
        const existingReview = fetchedReviews.find(r => r.userEmail === user.email);
        if (existingReview) {
          setHasReviewed(existingReview.id);
          setNewComment(existingReview.comment);
          setNewRating(existingReview.rating);
        } else {
          setHasReviewed(null);
          setNewComment("");
          setNewRating(5);
        }
      } else {
        setHasReviewed(null);
        setNewComment("");
        setNewRating(5);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => { 
    fetchReviews();
    if (product) setActiveImg(product.image); // Initialize gallery
  }, [product?.id, user]);

  if (!product) return null;

  // Helper to format description with spacing and bold headings
  const renderFormattedDescription = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const isHeading = line.includes(':');
      return (
        <p key={i} className={`mb-3 leading-relaxed ${isHeading ? 'font-bold text-slate-900 mt-4' : 'text-slate-600'}`}>
          {line}
        </p>
      );
    });
  };

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be signed in to submit a verified review!");
      onNavigate('login');
      return;
    }
    if (!newComment.trim()) return alert("Please write a comment");

    setSubmitting(true);
    try {
      if (hasReviewed) {
        const reviewRef = doc(db, "reviews", hasReviewed);
        await updateDoc(reviewRef, {
          rating: Number(newRating),
          comment: newComment,
          date: new Date()
        });
        alert("Review updated successfully!");
      } else {
        await addDoc(collection(db, "reviews"), {
          productId: product.id,
          userEmail: user.email,
          userName: user.name || user.email.split('@')[0],
          rating: Number(newRating),
          comment: newComment,
          date: new Date()
        });
        alert("Review posted successfully!");
      }
      fetchReviews();
    } catch (err) { 
      console.error("Error handling review:", err); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleAddToCart = () => onAddToCart(product, quantity);
  const handleBuyNow = () => { onAddToCart(product, quantity); onNavigate('cart'); };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  const displayRating = reviewsList.length > 0 
    ? (reviewsList.reduce((acc, item) => acc + item.rating, 0) / reviewsList.length).toFixed(1) 
    : product.rating || "0";

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
            <Button variant="ghost" size="sm" className="relative" onClick={() => onNavigate('cart')}>
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-primary text-primary-foreground text-xs">{cartItemCount}</Badge>
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* MULTI-IMAGE GALLERY */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
            <div className="relative rounded-[2.5rem] bg-white border shadow-sm flex items-center justify-center p-6 aspect-square">
              <img src={activeImg} alt={product.name} className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105" />
              <Button 
                variant="secondary" 
                size="icon" 
                className={`absolute top-2 right-2 rounded-full shadow-md transition-all ${isFavorite ? 'bg-black text-pink-400' : 'bg-white'}`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              {discountPercentage && <Badge className="absolute top-6 left-6 bg-red-600 text-white px-3 py-1 shadow-lg">{discountPercentage}% OFF</Badge>}
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {[product.image, ...(product.images || [])].filter(Boolean).map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImg(img)}
                  className={`w-20 h-20 rounded-2xl border-2 shrink-0 overflow-hidden transition-all ${activeImg === img ? 'border-pink-500 bg-pink-50' : 'border-slate-100 bg-white'}`}
                >
                  <img src={img} className="w-full h-full object-contain p-2" />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <div className="space-y-2">
              {/* Brown Brand Color */}
              <p className="text-[#8B4513] font-black uppercase tracking-widest text-xs">{product.brand}</p>
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">{product.name}</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-sm">{displayRating}</span>
                </div>
                <span className="text-sm text-muted-foreground underline">{reviewsList.length} reviews</span>
                <Badge variant="outline" className="text-green-600 border-green-100 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1" /> In Stock</Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4 border-b pb-6">
              <span className="text-3xl font-bold text-primary">KSh {product.price.toLocaleString()}</span>
              {product.originalPrice && <span className="text-xl text-muted-foreground line-through opacity-50">KSh {product.originalPrice.toLocaleString()}</span>}
            </div>

            {/* Formatted Description */}
            <div className="text-sm md:text-base border-b pb-6">
              {renderFormattedDescription(product.description)}
            </div>
            
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

            <div className="grid grid-cols-3 gap-2 pt-6">
              <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1"><Truck className="w-5 h-5 mx-auto text-slate-600" /><p className="text-[10px] font-bold">On-time Delivery</p></div>
              <div className="p-3 rounded-2xl bg-slate-50 text-center space-y-1"><Shield className="w-5 h-5 mx-auto text-slate-600" /><p className="text-[10px] font-bold">Authentic</p></div>
            </div>

            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4 tracking-tight">{hasReviewed ? "Update Your Review" : "Write a Review"}</h3>
              <form onSubmit={handlePostReview} className="space-y-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none transition-transform active:scale-90">
                      <Star className={`w-6 h-6 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-4 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-pink-500 outline-none h-24 text-sm"
                />
                <Button disabled={submitting} type="submit" className="w-full h-12 rounded-xl bg-black text-white font-bold uppercase text-xs tracking-widest">
                  {submitting ? "Processing..." : hasReviewed ? "Update Review" : "Post Review"}
                </Button>
              </form>

              <h3 className="text-xl font-bold mt-12 mb-6">Customer Reviews ({reviewsList.length})</h3>
              <div className="space-y-4">
                {reviewsList.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  reviewsList.map((rev) => (
                    <div key={rev.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-400">— {rev.userName}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
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