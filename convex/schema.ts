import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  orders: defineTable({
    orderNumber: v.string(),
    customerId: v.optional(v.string()),
    customerEmail: v.string(),
    customerName: v.string(),
    customerPhone: v.string(),
    deliveryAddress: v.string(),
    deliveryLat: v.number(),
    deliveryLng: v.number(),
    items: v.array(
      v.object({
        itemId: v.string(),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    subtotal: v.number(),
    deliveryFee: v.number(),
    total: v.number(),
    paymentMethod: v.union(v.literal("upi"), v.literal("card"), v.literal("cod")),
    paymentId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("dispatched"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
    createdAt: v.number(),
  })
    .index("by_order_number", ["orderNumber"])
    .index("by_customer_email", ["customerEmail"])
    .index("by_created_at", ["createdAt"]),
  menuItems: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.union(
      v.literal("starters"),
      v.literal("mains"),
      v.literal("drinks"),
      v.literal("desserts"),
    ),
    imageUrl: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    isAvailable: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_availability", ["isAvailable"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    role: v.union(v.literal("customer"), v.literal("staff"), v.literal("admin")),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  settings: defineTable({
    deliveryFee: v.number(),
    kitchenOpen: v.boolean(),
    serviceAreaPolygon: v.array(v.array(v.number())),
    kitchenName: v.string(),
    kitchenAddress: v.string(),
    kitchenLat: v.number(),
    kitchenLng: v.number(),
    updatedAt: v.number(),
  }).index("by_updated_at", ["updatedAt"]),
});
