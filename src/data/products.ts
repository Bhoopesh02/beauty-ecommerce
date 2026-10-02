export type Product = {
  id: string;
  name: string;
  type: string;
  category: string;
  concerns: string[];
  price: number;
  image: string;
  slug: string;
  featured: boolean;
  bestseller: boolean;
  /** Average star rating, e.g. 4.5 */
  averageRating?: number;
  /** Total number of reviews */
  reviewCount?: number;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Hydraglow Moisturizer",
    type: "Moisturizer",
    category: "Skin Care",
    concerns: ["Dryness", "Dullness"],
    price: 899,
    image: "/images/products/Hydraglow-Moisturizer.webp",
    slug: "hydraglow-moisturizer",
    featured: true,
    bestseller: true,
  },
  {
    id: "2",
    name: "Botanical Face Wash",
    type: "Cleanser",
    category: "Skin Care",
    concerns: ["Acne", "Oiliness"],
    price: 549,
    image: "/images/products/Botanical-Face-Wash.webp",
    slug: "botanical-face-wash",
    featured: true,
    bestseller: true,
  },
  {
    id: "3",
    name: "Rose Water Face Mist",
    type: "Toner",
    category: "Skin Care",
    concerns: ["Dryness", "Redness"],
    price: 499,
    image: "/images/products/Rose-Water-Face-Mist.webp",
    slug: "rose-water-face-mist",
    featured: true,
    bestseller: false,
  },
  {
    id: "4",
    name: "Herbal Hair Oil",
    type: "Hair Oil",
    category: "Hair Care",
    concerns: ["Hair Fall", "Dandruff"],
    price: 699,
    image: "/images/products/Herbal-Hair-Oil.webp",
    slug: "herbal-hair-oil",
    featured: true,
    bestseller: true,
  },
  {
    id: "5",
    name: "Nourishing Herbal Shampoo",
    type: "Shampoo",
    category: "Hair Care",
    concerns: ["Hair Fall", "Dry Scalp"],
    price: 749,
    image: "/images/products/NOURISHING-HERBAL-SHAMPOO.webp",
    slug: "nourishing-herbal-shampoo",
    featured: false,
    bestseller: true,
  },
  {
    id: "6",
    name: "Skin & Hair Care Combo",
    type: "Combo",
    category: "Body Care",
    concerns: ["Overall Health"],
    price: 1899,
    image: "/images/products/Natural-Skin-&-Hair-Care-Combo.webp",
    slug: "skin-hair-care-combo",
    featured: false,
    bestseller: true,
  }
];
