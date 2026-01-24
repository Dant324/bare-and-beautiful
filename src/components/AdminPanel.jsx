// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase/firebase";
import { 
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy 
} from "firebase/firestore"; 
import { signOut } from "firebase/auth";
import { ArrowLeft, LayoutDashboard, Trash2, Edit3, LogOut, MessageSquare, Package } from "lucide-react";

export default function AdminPanel({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [view, setView] = useState('inventory'); // 'inventory' or 'reviews'
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    ingredients: "",
    benefits: "",
    featured: false,
    imagePath: "",
    skinType: "" 
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const productsRef = collection(db, "products");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const q = query(productsRef, orderBy("name"));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("fetchProducts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const snap = await getDocs(collection(db, "reviews"));
      setAllReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("fetchReviews:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchReviews();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm({
      name: "", brand: "", price: "", originalPrice: "",
      category: "", description: "", ingredients: "",
      benefits: "", featured: false, imagePath: "", skinType: ""
    });
    setEditingId(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      if (!form.name || !form.price) {
        alert("Please provide at least a name and price.");
        return;
      }

      // Convert comma separated string into an array 
      const imageArray = form.imagePath.split(",").map(i => i.trim()).filter(i => i !== "");

      const newProduct = {
        ...form,
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        ingredients: form.ingredients ? form.ingredients.split(",").map(i => i.trim()) : [],
        benefits: form.benefits ? form.benefits.split(",").map(i => i.trim()) : [],
        images: imageArray, // The gallery array for ProductDetailPage
        image: imageArray[0] || "", // Main image is the first one in the list
        rating: 5.0,
        reviewCount: 0
      };

      await addDoc(productsRef, newProduct);
      resetForm();
      fetchProducts();
      alert("Product added successfully with gallery!");
    } catch (err) {
      console.error("handleAddProduct:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    } catch (err) {
      console.error("handleDelete:", err);
    }
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", id));
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      ...p,
      // When editing, show all images in the box separated by commas
      imagePath: (Array.isArray(p.images) ? p.images.join(", ") : p.image) || "",
      ingredients: (Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients) || "",
      benefits: (Array.isArray(p.benefits) ? p.benefits.join(", ") : p.benefits) || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const imageArray = form.imagePath.split(",").map(i => i.trim()).filter(i => i !== "");
      const updateRef = doc(db, "products", editingId);
      
      await updateDoc(updateRef, {
        ...form,
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        ingredients: form.ingredients ? form.ingredients.split(",").map(i => i.trim()) : [],
        benefits: form.benefits ? form.benefits.split(",").map(i => i.trim()) : [],
        images: imageArray,
        image: imageArray[0] || ""
      });
      
      resetForm();
      fetchProducts();
      alert("Product updated!");
    } catch (err) {
      console.error("handleUpdate:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between mb-10 items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:text-pink-500 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-pink-500" /> Admin Dashboard
            </h1>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setView('inventory')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${view === 'inventory' ? 'bg-black text-white' : 'bg-white border'}`}>
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button onClick={() => setView('reviews')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${view === 'reviews' ? 'bg-black text-white' : 'bg-white border'}`}>
            <MessageSquare className="w-4 h-4" /> Reviews
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold border border-red-100"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {view === 'inventory' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <form onSubmit={editingId ? handleUpdate : handleAddProduct} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24 space-y-4">
                <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-slate-400 text-xs">{editingId ? "Edit Product" : "New Product"}</h2>
                <div className="space-y-3">
                  <input name="name" placeholder="Product Name" value={form.name} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  <input name="brand" placeholder="Brand Name" value={form.brand} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="price" type="number" placeholder="Price (KSh)" value={form.price} onChange={handleInputChange} className="p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                    <input name="originalPrice" type="number" placeholder="Old Price" value={form.originalPrice} onChange={handleInputChange} className="p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  </div>
                  <select name="skinType" value={form.skinType} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-medium text-slate-600">
                    <option value="">All Skin Types</option>
                    <option value="Oily">Oily</option>
                    <option value="Dry">Dry</option>
                    <option value="Sensitive">Sensitive</option>
                    <option value="Combination">Combination</option>
                    <option value="Normal">Normal</option>
                  </select>
                  <input name="category" placeholder="Category (e.g. skincare, fragrance)" value={form.category} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <input name="featured" type="checkbox" checked={form.featured} onChange={handleInputChange} className="w-5 h-5 accent-pink-500" />
                    <label className="text-sm font-bold text-slate-600">Feature on Homepage</label>
                  </div>
                  <textarea name="description" placeholder="Description (Tip: Use 'Key Features:' to bold section)" value={form.description} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none h-24" />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-wider">Image URLs (separate with commas)</label>
                    <input name="imagePath" placeholder="link1.jpg, link2.jpg, link3.jpg" value={form.imagePath} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button type="submit" className="w-full bg-slate-900 text-black p-4 rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-pink-600 transition-colors shadow-lg"> {editingId ? "Update Info" : "Save Product"} </button>
                  {editingId && <button type="button" onClick={resetForm} className="w-full bg-slate-100 text-slate-600 p-4 rounded-2xl font-black uppercase text-xs">Cancel</button>}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tighter italic underline decoration-pink-500 decoration-4 underline-offset-8">Inventory</h2>
                <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">{products.length} Items</span>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {products.map(product => (
                  <div key={product.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-[2rem] bg-slate-50 flex items-center justify-center p-6">
                      <img src={product.image || "/fallback.jpg"} alt={product.name} className="max-w-full max-h-full object-contain" />
                      {product.images?.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg border border-slate-100 text-[9px] font-bold">
                          {product.images.length} Pics
                        </div>
                      )}
                    </div>
                    <div className="px-2">
                      <p className="text-[10px] font-black text-[#8B4513] uppercase tracking-widest">{product.brand}</p>
                      <h4 className="font-bold text-slate-800 truncate">{product.name}</h4>
                      <p className="font-black text-lg text-slate-900">KSh {product.price?.toLocaleString()}</p>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                        <button onClick={() => startEdit(product)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 font-bold transition-colors"><Edit3 className="w-4 h-4" /> Edit</button>
                        <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 font-bold transition-colors"><Trash2 className="w-4 h-4" /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            <h2 className="text-2xl font-black mb-6">Manage Reviews</h2>
            {allReviews.length === 0 ? <p className="text-slate-400 italic">No reviews found.</p> : 
              allReviews.map(rev => (
                <div key={rev.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex justify-between items-start gap-4 shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black bg-yellow-400 px-2 py-0.5 rounded-full">{rev.rating}★</span>
                      <p className="font-bold">{rev.userName}</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Product ID: {rev.productId}</p>
                  </div>
                  <button onClick={() => deleteReview(rev.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}