import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

export const listAvailable = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();

    return await Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.imageStorageId
          ? (await ctx.storage.getUrl(item.imageStorageId)) ?? item.imageUrl
          : item.imageUrl,
      })),
    );
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("menuItems").order("desc").collect();
    return await Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.imageStorageId
          ? (await ctx.storage.getUrl(item.imageStorageId)) ?? item.imageUrl
          : item.imageUrl,
      })),
    );
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("menuItems"),
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
    previousImageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { id, previousImageStorageId, ...rest } = args;
    const existing = await ctx.db.get(id);

    if (!existing) {
      throw new Error("Menu item not found");
    }

    await ctx.db.patch(id, rest);

    if (
      previousImageStorageId &&
      existing.imageStorageId &&
      previousImageStorageId !== args.imageStorageId
    ) {
      await ctx.storage.delete(previousImageStorageId);
    }
  },
});

export const toggleAvailability = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Menu item not found");
    }
    await ctx.db.patch(args.id, { isAvailable: !item.isAvailable });
  },
});

export const remove = mutation({
  args: {
    id: v.id("menuItems"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Menu item not found");
    }

    if (item.imageStorageId) {
      await ctx.storage.delete(item.imageStorageId);
    }

    await ctx.db.delete(args.id);
  },
});
