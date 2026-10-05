import { Order } from "@/types";

export const defaultOrders: Order[] = [
  {
    id: "DR-10284",
    userId: "admin-1",
    createdAt: "2026-10-05T09:30:00.000Z",
    orderStatus: "Delivered",
    deliveredAt: "2026-10-05T15:45:00.000Z",
    subtotal: 4990,
    shipping: 0,
    discount: 0,
    total: 4990,
    paymentMethod: "card",
    paymentStatus: "Paid",
    paymentDetails: {
      method: "Credit Card",
      cardLast4: "4242",
      status: "Paid",
      paidAt: "2026-10-05T09:31:12.000Z"
    },
    trackingNumber: "BD-DR-10284-IN",
    carrier: "BlueDart Apex Luxury",
    trackingCheckpoints: [
      {
        status: "Delivered",
        location: "Chennai, Tamil Nadu",
        timestamp: "2026-10-05T15:45:00.000Z",
        description: "Package handed directly to customer."
      },
      {
        status: "Out for Delivery",
        location: "Chennai Central Hub",
        timestamp: "2026-10-05T11:20:00.000Z",
        description: "Courier executive out for final delivery."
      },
      {
        status: "Shipped",
        location: "Bengaluru Logistics Centre",
        timestamp: "2026-10-05T03:00:00.000Z",
        description: "Dispatched via express air transport."
      },
      {
        status: "Packed",
        location: "DERRUME Atelier, Bengaluru",
        timestamp: "2026-10-04T18:15:00.000Z",
        description: "Sealed with signature wax ribbon."
      },
      {
        status: "Confirmed",
        location: "Order Desk",
        timestamp: "2026-10-04T12:00:00.000Z",
        description: "Verified and prepared for atelier fulfillment."
      },
      {
        status: "Placed",
        location: "DERRUME Online Store",
        timestamp: "2026-10-04T11:45:00.000Z",
        description: "Order received successfully."
      }
    ],
    items: [
      {
        productId: "1",
        name: "DERRUME Signature Silk Shirt",
        slug: "hydraglow-moisturizer",
        image: "/images/products/Hydraglow-Moisturizer.webp",
        size: "M",
        color: "Noir Black",
        quantity: 1,
        price: 4990
      }
    ],
    shippingAddress: {
      id: "addr-001",
      fullName: "Bhoopesh S",
      phone: "+91 98401 23456",
      address: "14/2 Khader Nawaz Khan Road, Nungambakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      country: "India",
      type: "home",
      isDefault: true
    },
    statusHistory: [
      { status: "Placed", timestamp: "2026-10-04T11:45:00.000Z" },
      { status: "Confirmed", timestamp: "2026-10-04T12:00:00.000Z" },
      { status: "Packed", timestamp: "2026-10-04T18:15:00.000Z" },
      { status: "Shipped", timestamp: "2026-10-05T03:00:00.000Z" },
      { status: "Out for Delivery", timestamp: "2026-10-05T11:20:00.000Z" },
      { status: "Delivered", timestamp: "2026-10-05T15:45:00.000Z" }
    ],
    returnStatus: "none"
  },
  {
    id: "DR-10283",
    userId: "admin-1",
    createdAt: "2026-10-03T11:20:00.000Z",
    orderStatus: "Shipped",
    estimatedDelivery: "2026-10-08T18:00:00.000Z",
    subtotal: 12450,
    shipping: 0,
    discount: 0,
    total: 12450,
    paymentMethod: "card",
    paymentStatus: "Paid",
    paymentDetails: {
      method: "Credit Card",
      cardLast4: "8821",
      status: "Paid",
      paidAt: "2026-10-03T11:21:40.000Z"
    },
    trackingNumber: "DLV-DR-10283-EX",
    carrier: "Delhivery Luxury Air",
    trackingCheckpoints: [
      {
        status: "Shipped",
        location: "Bengaluru Logistics Terminal",
        timestamp: "2026-10-04T16:30:00.000Z",
        description: "En route to destination hub."
      },
      {
        status: "Packed",
        location: "DERRUME Atelier",
        timestamp: "2026-10-04T10:00:00.000Z",
        description: "Secure packaging with botanical protective wrap."
      },
      {
        status: "Confirmed",
        location: "Order Desk",
        timestamp: "2026-10-03T14:00:00.000Z",
        description: "Order confirmed."
      },
      {
        status: "Placed",
        location: "DERRUME Online Store",
        timestamp: "2026-10-03T11:20:00.000Z",
        description: "Order placed."
      }
    ],
    items: [
      {
        productId: "2",
        name: "Botanical Face Wash",
        slug: "botanical-face-wash",
        image: "/images/products/Botanical-Face-Wash.webp",
        size: "100ml",
        color: "Pure Neem",
        quantity: 2,
        price: 549
      },
      {
        productId: "4",
        name: "Herbal Hair Oil",
        slug: "herbal-hair-oil",
        image: "/images/products/Herbal-Hair-Oil.webp",
        size: "200ml",
        color: "Cold-Pressed",
        quantity: 1,
        price: 699
      },
      {
        productId: "6",
        name: "Skin & Hair Care Combo",
        slug: "skin-hair-care-combo",
        image: "/images/products/Natural-Skin-&-Hair-Care-Combo.webp",
        size: "Complete Ritual",
        color: "Atelier Edition",
        quantity: 5,
        price: 2130.6
      }
    ],
    shippingAddress: {
      id: "addr-001",
      fullName: "Bhoopesh S",
      phone: "+91 98401 23456",
      address: "14/2 Khader Nawaz Khan Road, Nungambakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      country: "India",
      type: "home",
      isDefault: true
    },
    statusHistory: [
      { status: "Placed", timestamp: "2026-10-03T11:20:00.000Z" },
      { status: "Confirmed", timestamp: "2026-10-03T14:00:00.000Z" },
      { status: "Packed", timestamp: "2026-10-04T10:00:00.000Z" },
      { status: "Shipped", timestamp: "2026-10-04T16:30:00.000Z" }
    ],
    returnStatus: "none"
  },
  {
    id: "DR-10282",
    userId: "admin-1",
    createdAt: "2026-10-04T16:45:00.000Z",
    orderStatus: "Confirmed",
    estimatedDelivery: "2026-10-10T18:00:00.000Z",
    subtotal: 1897,
    shipping: 0,
    discount: 0,
    total: 1897,
    paymentMethod: "upi",
    paymentStatus: "Paid",
    paymentDetails: {
      method: "UPI",
      status: "Paid",
      paidAt: "2026-10-04T16:46:10.000Z"
    },
    trackingNumber: "EXP-DR-10282-PENDING",
    carrier: "Express Courier Logistics",
    items: [
      {
        productId: "3",
        name: "Rose Water Face Mist",
        slug: "rose-water-face-mist",
        image: "/images/products/Rose-Water-Face-Mist.webp",
        size: "100ml",
        quantity: 2,
        price: 499
      },
      {
        productId: "1",
        name: "Hydraglow Moisturizer",
        slug: "hydraglow-moisturizer",
        image: "/images/products/Hydraglow-Moisturizer.webp",
        size: "50ml",
        quantity: 1,
        price: 899
      }
    ],
    shippingAddress: {
      id: "addr-001",
      fullName: "Bhoopesh S",
      phone: "+91 98401 23456",
      address: "14/2 Khader Nawaz Khan Road, Nungambakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      country: "India",
      type: "home",
      isDefault: true
    },
    statusHistory: [
      { status: "Placed", timestamp: "2026-10-04T16:45:00.000Z" },
      { status: "Confirmed", timestamp: "2026-10-04T17:30:00.000Z" }
    ],
    returnStatus: "none"
  },
  {
    id: "DR-10281",
    userId: "admin-1",
    createdAt: "2026-10-05T08:15:00.000Z",
    orderStatus: "Placed",
    estimatedDelivery: "2026-10-11T18:00:00.000Z",
    subtotal: 749,
    shipping: 0,
    discount: 0,
    total: 749,
    paymentMethod: "card",
    paymentStatus: "Paid",
    paymentDetails: {
      method: "Credit Card",
      cardLast4: "1104",
      status: "Paid",
      paidAt: "2026-10-05T08:16:00.000Z"
    },
    items: [
      {
        productId: "5",
        name: "Nourishing Herbal Shampoo",
        slug: "nourishing-herbal-shampoo",
        image: "/images/products/NOURISHING-HERBAL-SHAMPOO.webp",
        size: "250ml",
        quantity: 1,
        price: 749
      }
    ],
    shippingAddress: {
      id: "addr-001",
      fullName: "Bhoopesh S",
      phone: "+91 98401 23456",
      address: "14/2 Khader Nawaz Khan Road, Nungambakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      country: "India",
      type: "home",
      isDefault: true
    },
    statusHistory: [
      { status: "Placed", timestamp: "2026-10-05T08:15:00.000Z" }
    ],
    returnStatus: "none"
  },
  {
    id: "DR-10279",
    userId: "admin-1",
    createdAt: "2026-09-28T14:10:00.000Z",
    orderStatus: "Cancelled",
    cancelledAt: "2026-09-28T16:30:00.000Z",
    cancelReason: "Cancelled upon customer request prior to fulfillment dispatch.",
    subtotal: 1899,
    shipping: 0,
    discount: 0,
    total: 1899,
    paymentMethod: "card",
    paymentStatus: "Paid",
    paymentDetails: {
      method: "Credit Card",
      cardLast4: "4242",
      status: "Refunded",
      paidAt: "2026-09-28T14:12:00.000Z"
    },
    items: [
      {
        productId: "6",
        name: "Natural Skin & Hair Care Combo",
        slug: "skin-hair-care-combo",
        image: "/images/products/Natural-Skin-&-Hair-Care-Combo.webp",
        size: "Signature Pack",
        quantity: 1,
        price: 1899
      }
    ],
    shippingAddress: {
      id: "addr-001",
      fullName: "Bhoopesh S",
      phone: "+91 98401 23456",
      address: "14/2 Khader Nawaz Khan Road, Nungambakkam",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600006",
      country: "India",
      type: "home",
      isDefault: true
    },
    statusHistory: [
      { status: "Placed", timestamp: "2026-09-28T14:10:00.000Z" },
      { status: "Cancelled", timestamp: "2026-09-28T16:30:00.000Z", note: "Customer requested cancellation." }
    ],
    returnStatus: "none"
  }
];
