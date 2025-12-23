// src/components/AdminPanel.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase/firebase";
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function AdminPanel() {
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
    imagePath: "" // <-- use this (e.g. /products/shampoo1.jpg)
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const productsRef = collection(db, "products");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(productsRef);
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
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      // basic validation
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
        image: form.imagePath || "", // store the path (public) here
        rating: 0,
        reviewCount: 0
      };

      await addDoc(productsRef, newProduct);
      setForm({
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
      fetchProducts();
    } catch (err) {
      console.error("handleAddProduct:", err);
      alert("Error adding product — check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
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
      setEditingId(null);
      setForm({
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
      fetchProducts();
    } catch (err) {
      console.error("handleUpdate:", err);
      alert("Error updating product — check console.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
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
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };


  
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center gap-3">
          {editingId ? (
            <button onClick={cancelEdit} className="px-3 py-2 rounded border">Cancel Edit</button>
          ) : null}
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </div>

      <form onSubmit={editingId ? handleUpdate : handleAddProduct} className="bg-card p-6 rounded shadow mb-8 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleInputChange} className="p-2 border rounded bg-input" />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleInputChange} className="p-2 border rounded bg-input" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleInputChange} className="p-2 border rounded bg-input" />
          <input name="originalPrice" type="number" placeholder="Original Price" value={form.originalPrice} onChange={handleInputChange} className="p-2 border rounded bg-input" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleInputChange} className="p-2 border rounded bg-input" />
          <input name="featured" type="checkbox" checked={form.featured} onChange={handleInputChange} className="self-center" />
        </div>

        <input name="description" placeholder="Description" value={form.description} onChange={handleInputChange} className="p-2 border rounded w-full bg-input" />
        <input name="ingredients" placeholder="Ingredients (comma separated)" value={form.ingredients} onChange={handleInputChange} className="p-2 border rounded w-full bg-input" />
        <input name="benefits" placeholder="Benefits (comma separated)" value={form.benefits} onChange={handleInputChange} className="p-2 border rounded w-full bg-input" />

        <div className="space-y-2">
          <label className="block text-sm">Image path (use `/products/your-file.jpg` for files in public/products):</label>
          <input name="imagePath" placeholder="/products/your-file.jpg" value={form.imagePath} onChange={handleInputChange} className="p-2 border rounded w-full bg-input" />
          {form.imagePath && (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground mb-1">Preview:</div>
              <img src={form.imagePath} alt="preview" onError={(e)=>{e.currentTarget.src='/fallback.jpg'}} className="w-48 h-48 object-cover rounded border" />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
            {editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded border">Cancel</button>}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-4">All Products</h2>
      {loading ? <p>Loading…</p> : (
        <div className="grid md:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-card p-4 rounded shadow">
              <div className="h-40 mb-3 overflow-hidden rounded">
                <img src={product.image || "/fallback.jpg"} alt={product.name} className="w-full h-full object-cover" onError={(e)=>{e.currentTarget.src='/fallback.jpg'}} />
              </div>
              <h4 className="font-bold">{product.name}</h4>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <p className="mt-1 font-semibold">KSh {product.price}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => startEdit(product)} className="px-2 py-1 border rounded">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}