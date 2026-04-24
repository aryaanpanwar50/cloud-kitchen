import { requireRole } from "@/lib/auth";
import { AdminDashboardPage } from "@/components/admin/admin-dashboard-page";

export default async function AdminPage() {
  await requireRole(["admin"]);
  return <AdminDashboardPage />;
}
