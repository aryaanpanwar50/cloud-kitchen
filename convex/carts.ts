import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

const cartLine = v.object({
  itemId: v.string(),
  name: v.string(),
  price: v.number(),
  quantity: v.number(),
  imageUrl: v.optional(v.string()),
});

export const getByCustomerId = query({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("carts")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .unique();
  },
});

export const setCart = mutation({
  args: {
    customerId: v.string(),
    items: v.array(cartLine),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("carts")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        items: args.items,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("carts", {
      customerId: args.customerId,
      items: args.items,
      updatedAt: Date.now(),
    });
  },
});

export const clearCart = mutation({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("carts")
      .withIndex("by_customer_id", (q) => q.eq("customerId", args.customerId))
      .unique();

    if (!existing) {
      return null;
    }

    await ctx.db.delete(existing._id);
    return existing._id;
  },
});
