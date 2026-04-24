import { requireAuth } from "@/lib/auth";
import { OrdersHistoryPage } from "@/components/tracking/orders-history-page";

export default async function OrdersPage() {
  const session = await requireAuth();
  return <OrdersHistoryPage customerEmail={session.user.email ?? ""} />;
}
