import { Product } from "../types";
import { storage, STORAGE_KEYS } from "../utils/storage";
import { defaultProducts } from "../data/products";

// Initialize products in local storage if empty
const initProducts = () => {
  const existing = storage.get<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  if (existing.length === 0) {
    storage.set(STORAGE_KEYS.PRODUCTS, defaultProducts);
    return defaultProducts;
  }
  return existing;
};

export const productService = {
  async getProducts(): Promise<Product[]> {
    return initProducts();
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = initProducts();
    return products.find(p => p.slug === slug) || null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const products = initProducts();
    return products.find(p => p.id === id) || null;
  },

  async addProduct(product: Product): Promise<Product> {
    const products = initProducts();
    products.push(product);
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    return product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = initProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
    storage.set(STORAGE_KEYS.PRODUCTS, products);
    return products[index];
  },

  async deleteProduct(id: string): Promise<boolean> {
    const products = initProducts();
    const filtered = products.filter(p => p.id !== id);
    storage.set(STORAGE_KEYS.PRODUCTS, filtered);
    return true;
  },
  
  async searchProducts(query: string): Promise<Product[]> {
    const products = initProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
  }
};
