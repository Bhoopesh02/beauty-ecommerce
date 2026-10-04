'use client';

import React, { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { productService } from "@/services/productService";
import { Product } from "@/types";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProductById(id).then(p => {
      setProduct(p || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div style={{padding: '100px 0', textAlign: 'center'}}>Loading product...</div>;
  }

  if (!product) {
    return notFound();
  }

  return (
    <div>
      <ProductForm initialData={product} />
    </div>
  );
}
