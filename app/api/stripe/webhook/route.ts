import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const tethrd_id = session.metadata?.tethrd_id;
    const joiner_user_id = session.metadata?.joiner_user_id;
    const payment_intent_id = session.payment_intent as string;

    if (!tethrd_id || !joiner_user_id) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const { data: t } = await getSupabase()
      .from("tethrds")
      .select("timer_hours, status")
      .eq("id", tethrd_id)
      .single();

    if (!t || t.status !== "pending") {
      // Already processed or not found — idempotent OK
      return NextResponse.json({ ok: true });
    }

    const expires_at = new Date(Date.now() + t.timer_hours * 60 * 60 * 1000).toISOString();

    await getSupabase()
      .from("tethrds")
      .update({ joiner_id: joiner_user_id, status: "active", payment_intent_id, expires_at })
      .eq("id", tethrd_id)
      .eq("status", "pending");
  }

  return NextResponse.json({ ok: true });
}
