import { OrderTrackingPage } from "@/components/tracking/order-tracking-page";

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderTrackingPage orderNumber={decodeURIComponent(orderId)} />;
}
