"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.css";
import { productService } from "@/services/productService";

interface ProductFormProps {
  initialData?: any;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category: initialData?.category || "",
    type: initialData?.type || initialData?.productType || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    comparePrice: initialData?.comparePrice || "",
    stock: initialData?.stock || "",
    sku: initialData?.sku || "",
    size: initialData?.size || "",
    ingredients: initialData?.ingredients || "",
    benefits: initialData?.benefits || "",
    howToUse: initialData?.howToUse || "",
    featured: initialData?.featured || false,
    bestseller: initialData?.bestseller || false,
    active: initialData?.active ?? true,
  });

  // Mock Images State
  const [images, setImages] = useState<string[]>(
    initialData?.images || (initialData?.image ? [initialData.image] : [])
  );
  
  const [imageError, setImageError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const productPayload: any = {
      name: formData.name,
      category: formData.category,
      productType: formData.type,
      type: formData.type,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      images: images,
      image: images[0] || "",
      ingredients: formData.ingredients,
      benefits: formData.benefits,
      howToUse: formData.howToUse,
      featured: formData.featured,
      bestseller: formData.bestseller,
      slug: initialData?.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    try {
      if (initialData?.id) {
        await productService.updateProduct(initialData.id, productPayload);
      } else {
        productPayload.id = `PROD-${Date.now()}`;
        await productService.addProduct(productPayload);
      }
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setImageError("Please upload only valid image files.");
          return null;
        }
        // Validate file size (e.g. 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          setImageError("Image size must be less than 5MB.");
          return null;
        }
        return URL.createObjectURL(file);
      }).filter(Boolean) as string[];

      if (newImages.length > 0) {
        setImages(prev => [...prev, ...newImages]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleMakePrimary = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const newArr = [...prev];
      const selected = newArr.splice(index, 1)[0];
      newArr.unshift(selected);
      return newArr;
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2>{initialData ? "Edit Product" : "Add New Product"}</h2>
        <div className={styles.headerActions}>
          <button type="button" onClick={() => router.back()} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          {/* Basic Info */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Basic Information</h3>
            <div className={styles.formGroup}>
              <label>Product Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Hair Care">Hair Care</option>
                  <option value="Body Care">Body Care</option>
                  <option value="Makeup">Makeup</option>
                  <option value="Fragrance">Fragrance</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Product Type *</label>
                <input name="type" value={formData.type} onChange={handleChange} placeholder="e.g. Moisturizer" required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={4} required></textarea>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Pricing & Inventory</h3>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Price (₹) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" />
              </div>
              <div className={styles.formGroup}>
                <label>Compare at Price (₹)</label>
                <input type="number" name="comparePrice" value={formData.comparePrice} onChange={handleChange} min="0" step="0.01" />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label>Stock Quantity *</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
              </div>
              <div className={styles.formGroup}>
                <label>SKU *</label>
                <input name="sku" value={formData.sku} onChange={handleChange} required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Size / Variant</label>
              <input name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 50ml" />
            </div>
          </div>

          {/* Detailed Info */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Detailed Information</h3>
            <div className={styles.formGroup}>
              <label>Ingredients</label>
              <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>Benefits</label>
              <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows={3}></textarea>
            </div>
            <div className={styles.formGroup}>
              <label>How To Use</label>
              <textarea name="howToUse" value={formData.howToUse} onChange={handleChange} rows={3}></textarea>
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className={styles.sideColumn}>
          {/* Images */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Product Images</h3>
            {imageError && <div className={styles.errorText}>{imageError}</div>}
            
            <div className={styles.imageUploadArea} onClick={() => fileInputRef.current?.click()}>
              <div className={styles.uploadIcon}>📷</div>
              <p>Click to upload images</p>
              <span>Supports JPG, PNG, WEBP</span>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*"
                className={styles.hiddenInput}
              />
            </div>
            
            {images.length > 0 && (
              <div className={styles.imageGallery}>
                {images.map((img, index) => (
                  <div key={index} className={styles.imageItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Product ${index}`} className={styles.previewImg} />
                    <div className={styles.imageOverlay}>
                      {index !== 0 && (
                        <button type="button" onClick={() => handleMakePrimary(index)} className={styles.imgActionBtn} title="Make Primary">
                          ⭐
                        </button>
                      )}
                      <button type="button" onClick={() => handleRemoveImage(index)} className={styles.imgActionBtn} title="Remove">
                        🗑️
                      </button>
                    </div>
                    {index === 0 && <span className={styles.primaryBadge}>Primary</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibility & Status */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Status & Visibility</h3>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
                <span>Active (Visible on store)</span>
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                <span>Featured Product</span>
              </label>
            </div>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="bestseller" checked={formData.bestseller} onChange={handleChange} />
                <span>Bestseller</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
