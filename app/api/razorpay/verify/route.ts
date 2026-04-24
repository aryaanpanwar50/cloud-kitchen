import crypto from "node:crypto";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return Response.json({ error: "Razorpay key secret is not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== body.razorpay_signature) {
      return Response.json({ error: "Payment signature verification failed" }, { status: 400 });
    }

    return Response.json({ verified: true }, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to verify payment" },
      { status: 500 },
    );
  }
}
