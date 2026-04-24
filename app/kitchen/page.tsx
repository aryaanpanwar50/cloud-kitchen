import { requireRole } from "@/lib/auth";
import { KitchenDashboardPage } from "@/components/kitchen/kitchen-dashboard-page";

export default async function KitchenPage() {
  await requireRole(["staff", "admin"]);
  return <KitchenDashboardPage />;
}
