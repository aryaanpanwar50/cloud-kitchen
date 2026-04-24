import type { menuCategories, orderStatuses, paymentMethods, roles } from "@/lib/constants";

export type MenuCategory = (typeof menuCategories)[number];
export type PaymentMethod = (typeof paymentMethods)[number];
export type OrderStatus = (typeof orderStatuses)[number];
export type Role = (typeof roles)[number];

export type CartLine = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type MenuItemView = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  imageUrl: string;
  imageStorageId?: string;
  isAvailable: boolean;
  createdAt: number;
};

export type PublicSettings = {
  kitchenName: string;
  kitchenAddress: string;
  kitchenLat: number;
  kitchenLng: number;
  deliveryFee: number;
  kitchenOpen: boolean;
  serviceAreaPolygon: [number, number][];
};

export type AddressFormValues = {
  deliveryAddress: string;
};
