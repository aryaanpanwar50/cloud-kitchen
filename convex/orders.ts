import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const createOrder = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db.query("orders").collect();
    const sequence = orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `ORD-${year}-${String(sequence).padStart(3, "0")}`;

    await ctx.db.insert("orders", {
      ...args,
      orderNumber,
      status: "pending",
      createdAt: Date.now(),
    });

    return orderNumber;
  },
});

export const getByOrderNumber = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
      .unique();
  },
});

export const listByCustomer = query({
  args: { customerEmail: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_customer_email", (q) => q.eq("customerEmail", args.customerEmail))
      .order("desc")
      .collect();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").withIndex("by_created_at").order("desc").collect();
    return orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  },
});

export const listToday = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const orders = await ctx.db.query("orders").withIndex("by_created_at").order("desc").collect();
    return orders.filter((order) => {
      const matchesToday = order.createdAt >= startOfDay.getTime();
      const matchesStatus = args.status ? order.status === args.status : true;
      return matchesToday && matchesStatus;
    });
  },
});

export const updateStatus = mutation({
  args: {
    orderNumber: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("ready"),
      v.literal("dispatched"),
      v.literal("delivered"),
      v.literal("cancelled"),
    ),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
      .unique();

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(order._id, { status: args.status });
  },
});
