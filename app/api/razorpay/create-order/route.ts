import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { amount: number; receipt?: string };

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: "Razorpay keys are not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(body.amount * 100),
      currency: "INR",
      receipt: body.receipt ?? `receipt_${Date.now()}`,
    });

    return Response.json(order, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to create Razorpay order" },
      { status: 500 },
    );
  }
}
