import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { products } from "@/data/products";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    notFound();
  }

  // Map the frontend mock product format to the form format
  const initialData = {
    ...product,
    stock: 50, // mock stock
    sku: `SKU-${product.id}`,
    comparePrice: product.price * 1.2, // mock compare price
  };

  return (
    <div>
      <ProductForm initialData={initialData} />
    </div>
  );
}
