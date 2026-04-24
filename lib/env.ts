import { defaultDeliveryFee } from "@/lib/constants";
import { parsePolygon } from "@/lib/utils";

export const envDefaults = {
  kitchenName: process.env.NEXT_PUBLIC_KITCHEN_NAME ?? "Mumbai Cloud Kitchen",
  kitchenAddress:
    process.env.NEXT_PUBLIC_KITCHEN_ADDRESS ??
    "Bandra West, Mumbai, Maharashtra",
  kitchenLat: Number(process.env.NEXT_PUBLIC_KITCHEN_LAT ?? "19.0596"),
  kitchenLng: Number(process.env.NEXT_PUBLIC_KITCHEN_LNG ?? "72.8295"),
  serviceAreaPolygon: parsePolygon(process.env.NEXT_PUBLIC_SERVICE_AREA_POLYGON),
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL ?? "",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  deliveryFee: defaultDeliveryFee,
};
