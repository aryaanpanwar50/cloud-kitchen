import { mutationGeneric as mutation } from "convex/server";

const demoMenuItems = [
  {
    name: "Smoked Chili Paneer Bowl",
    description: "Charred paneer, roasted peppers, saffron rice, and garlic yogurt.",
    price: 259,
    category: "mains" as const,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Butter Chicken Rice Pot",
    description: "Creamy tomato gravy, tender chicken, and fragrant basmati rice.",
    price: 329,
    category: "mains" as const,
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Tandoori Mushroom Tacos",
    description: "Soft tacos loaded with smoky mushrooms, onions, and mint crema.",
    price: 219,
    category: "starters" as const,
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38174c4a6f96?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Korean Crunch Burger",
    description: "Crispy fried chicken, kimchi slaw, and gochujang mayo in a brioche bun.",
    price: 289,
    category: "mains" as const,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Coconut Matcha Cooler",
    description: "Iced ceremonial matcha with tender coconut water and lime.",
    price: 149,
    category: "drinks" as const,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Cold Coffee Float",
    description: "Dark roast cold coffee finished with vanilla cream foam.",
    price: 139,
    category: "drinks" as const,
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Rose Tres Leches Jar",
    description: "Soft sponge soaked in rose milk and topped with pistachio cream.",
    price: 179,
    category: "desserts" as const,
    imageUrl: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=900&q=80",
    isAvailable: true,
  },
  {
    name: "Churro Cheesecake Bites",
    description: "Cinnamon sugar bites with baked cheesecake filling and caramel drizzle.",
    price: 189,
    category: "desserts" as const,
    imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=900&q=80",
    isAvailable: true,
  },
];

export const resetMenuAndSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const menuItems = await ctx.db.query("menuItems").collect();
    for (const item of menuItems) {
      if (item.imageStorageId) {
        await ctx.storage.delete(item.imageStorageId);
      }
      await ctx.db.delete(item._id);
    }

    const settingsDocs = await ctx.db.query("settings").collect();
    for (const settings of settingsDocs) {
      await ctx.db.delete(settings._id);
    }

    await ctx.db.insert("settings", {
      deliveryFee: 45,
      kitchenOpen: true,
      serviceAreaPolygon: [
        [72.8095, 19.0796],
        [72.861, 19.0796],
        [72.873, 19.044],
        [72.82, 19.029],
        [72.8095, 19.0796],
      ],
      kitchenName: "UrbanEats Kitchen",
      kitchenAddress: "Bandra West, Mumbai, Maharashtra",
      kitchenLat: 19.0596,
      kitchenLng: 72.8295,
      updatedAt: Date.now(),
    });

    for (const item of demoMenuItems) {
      await ctx.db.insert("menuItems", {
        ...item,
        createdAt: Date.now(),
      });
    }

    return {
      menuItemsSeeded: demoMenuItems.length,
      settingsReset: true,
    };
  },
});
