import { booleanPointInPolygon, point, polygon } from "@turf/turf";
import { clsx } from "clsx";
import type { CartLine, OrderStatus } from "@/lib/types";
import { statusColors } from "@/lib/constants";

export function cn(...classes: Array<string | false | null | undefined>) {
  return clsx(classes);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRelativeTime(from: number) {
  const diffMs = Date.now() - from;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m ago`;
}

export function getCartTotals(lines: CartLine[], deliveryFee: number) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

export function parsePolygon(raw: string | undefined) {
  if (!raw) {
    return [] as [number, number][];
  }

  try {
    const parsed = JSON.parse(raw) as [number, number][];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function isPointInServiceArea(
  coordinates: { lat: number; lng: number },
  serviceArea: [number, number][],
) {
  if (serviceArea.length < 3) {
    return false;
  }

  const closedPolygon = [...serviceArea];
  const [firstLng, firstLat] = serviceArea[0];
  const [lastLng, lastLat] = serviceArea[serviceArea.length - 1];

  if (firstLng !== lastLng || firstLat !== lastLat) {
    closedPolygon.push(serviceArea[0]);
  }

  return booleanPointInPolygon(
    point([coordinates.lng, coordinates.lat]),
    polygon([closedPolygon]),
  );
}

export function getStatusClasses(status: OrderStatus) {
  return statusColors[status] ?? "bg-slate-100 text-slate-800";
}

export function orderStageIndex(status: OrderStatus) {
  const statusOrder: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "dispatched",
    "delivered",
  ];
  return statusOrder.indexOf(status);
}

export function safeNumber(input: string) {
  const value = Number(input);
  return Number.isFinite(value) ? value : null;
}
