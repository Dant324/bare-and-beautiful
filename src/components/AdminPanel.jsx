// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase/firebase";
import { 
  collection, addDoc, getDocs, doc, deleteDoc, updateDoc, query, orderBy 
} from "firebase/firestore"; 
import { signOut } from "firebase/auth";
import { ArrowLeft, LayoutDashboard, Plus, Trash2, Edit3, LogOut } from "lucide-react";

export default function AdminPanel({ onNavigate }) {
  const [products, setProducts] = useState([]);
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
    imagePath: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const productsRef = collection(db, "products");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Added ordering by name for a better list experience
      const q = query(productsRef, orderBy("name"));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("fetchProducts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm({
      name: "", brand: "", price: "", originalPrice: "",
      category: "", description: "", ingredients: "",
      benefits: "", featured: false, imagePath: ""
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

      const newProduct = {
        name: form.name,
        brand: form.brand || "",
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || null,
        category: form.category || "",
        description: form.description || "",
        ingredients: form.ingredients ? form.ingredients.split(",").map(i => i.trim()) : [],
        benefits: form.benefits ? form.benefits.split(",").map(i => i.trim()) : [],
        featured: !!form.featured,
        image: form.imagePath || "",
        rating: 5.0,
        reviewCount: 0
      };

      await addDoc(productsRef, newProduct);
      resetForm();
      fetchProducts();
      alert("Product added successfully!");
    } catch (err) {
      console.error("handleAddProduct:", err);
      alert("Error adding product.");
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

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      brand: p.brand || "",
      price: p.price || "",
      originalPrice: p.originalPrice || "",
      category: p.category || "",
      description: p.description || "",
      ingredients: (Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients) || "",
      benefits: (Array.isArray(p.benefits) ? p.benefits.join(", ") : p.benefits) || "",
      featured: !!p.featured,
      imagePath: p.image || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      const updateRef = doc(db, "products", editingId);
      await updateDoc(updateRef, {
        name: form.name,
        brand: form.brand,
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || null,
        category: form.category,
        description: form.description,
        ingredients: form.ingredients ? form.ingredients.split(",").map(i => i.trim()) : [],
        benefits: form.benefits ? form.benefits.split(",").map(i => i.trim()) : [],
        featured: !!form.featured,
        image: form.imagePath || ""
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
        
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-pink-500" /> Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage your boutique inventory</p>
          </div>
        </div>

        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-colors border border-red-100"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* FORM SECTION */}
        <div className="lg:col-span-1">
          <form 
            onSubmit={editingId ? handleUpdate : handleAddProduct} 
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24 space-y-4"
          >
            <h2 className="text-xl font-black mb-4 uppercase tracking-widest text-slate-400 text-xs">
              {editingId ? "Edit Product" : "New Product"}
            </h2>
            
            <div className="space-y-3">
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
              <input name="brand" placeholder="Brand Name" value={form.brand} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
              
              <div className="grid grid-cols-2 gap-3">
                <input name="price" type="number" placeholder="Price (KSh)" value={form.price} onChange={handleInputChange} className="p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                <input name="originalPrice" type="number" placeholder="Old Price" value={form.originalPrice} onChange={handleInputChange} className="p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
              
              <input name="category" placeholder="Category" value={form.category} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <input name="featured" type="checkbox" checked={form.featured} onChange={handleInputChange} className="w-5 h-5 accent-pink-500" />
                <label className="text-sm font-bold text-slate-600">Feature on Homepage</label>
              </div>

              <textarea name="description" placeholder="Description" value={form.description} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none h-24" />
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Image URL</label>
                <input name="imagePath" placeholder="/products/image.jpg" value={form.imagePath} onChange={handleInputChange} className="w-full p-3 border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black tracking-widest uppercase text-xs hover:bg-pink-600 transition-colors shadow-lg shadow-slate-200">
                {editingId ? "Update Info" : "Save Product"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="w-full bg-slate-100 text-slate-600 p-4 rounded-2xl font-black uppercase text-xs">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black tracking-tighter italic underline decoration-pink-500 decoration-4 underline-offset-8">Inventory</h2>
            <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
              {products.length} Items Total
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
                  <div className="relative aspect-square mb-4 overflow-hidden rounded-[2rem] bg-slate-50 flex items-center justify-center p-6">
                    <img 
                      src={product.image || "/fallback.jpg"} 
                      alt={product.name} 
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      onError={(e)=>{e.currentTarget.src='/fallback.jpg'}} 
                    />
                  </div>
                  <div className="px-2">
                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{product.brand}</p>
                    <h4 className="font-bold text-slate-800 truncate">{product.name}</h4>
                    <p className="font-black text-lg mt-1 text-slate-900">KSh {product.price?.toLocaleString()}</p>
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                      <button onClick={() => startEdit(product)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-bold transition-colors">
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 font-bold transition-colors">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}