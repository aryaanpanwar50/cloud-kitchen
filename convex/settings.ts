import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";
import { defaultDeliveryFee } from "@/lib/constants";
import { envDefaults } from "@/lib/env";

export const getPublic = query({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("settings").order("desc").first();

    if (existing) {
      return existing;
    }

    return {
      deliveryFee: defaultDeliveryFee,
      kitchenOpen: true,
      serviceAreaPolygon: envDefaults.serviceAreaPolygon,
      kitchenName: envDefaults.kitchenName,
      kitchenAddress: envDefaults.kitchenAddress,
      kitchenLat: envDefaults.kitchenLat,
      kitchenLng: envDefaults.kitchenLng,
      updatedAt: Date.now(),
    };
  },
});

export const getAdmin = query({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("settings").order("desc").first();

    if (existing) {
      return existing;
    }

    return {
      deliveryFee: defaultDeliveryFee,
      kitchenOpen: true,
      serviceAreaPolygon: envDefaults.serviceAreaPolygon,
      kitchenName: envDefaults.kitchenName,
      kitchenAddress: envDefaults.kitchenAddress,
      kitchenLat: envDefaults.kitchenLat,
      kitchenLng: envDefaults.kitchenLng,
      updatedAt: Date.now(),
    };
  },
});

export const update = mutation({
  args: {
    deliveryFee: v.number(),
    kitchenOpen: v.boolean(),
    serviceAreaPolygon: v.array(v.array(v.number())),
    kitchenName: v.string(),
    kitchenAddress: v.string(),
    kitchenLat: v.number(),
    kitchenLng: v.number(),
  },
  handler: async (ctx, args) => {
    let settings = await ctx.db.query("settings").order("desc").first();
    if (!settings) {
      const id = await ctx.db.insert("settings", {
        deliveryFee: defaultDeliveryFee,
        kitchenOpen: true,
        serviceAreaPolygon: envDefaults.serviceAreaPolygon,
        kitchenName: envDefaults.kitchenName,
        kitchenAddress: envDefaults.kitchenAddress,
        kitchenLat: envDefaults.kitchenLat,
        kitchenLng: envDefaults.kitchenLng,
        updatedAt: Date.now(),
      });
      settings = await ctx.db.get(id);
    }

    if (!settings) {
      throw new Error("Settings not found");
    }

    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});
