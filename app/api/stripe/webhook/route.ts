import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { getUserEmail, getUsername } from "@/lib/clerk";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency check — Stripe retries webhooks on failure; skip if already processed
  const { data: existing } = await getSupabase()
    .from("webhook_events")
    .select("id, status")
    .eq("stripe_event_id", event.id)
    .single();

  if (existing) {
    return NextResponse.json({ ok: true });
  }

  // Record the event before processing
  const { data: record } = await getSupabase()
    .from("webhook_events")
    .insert({ stripe_event_id: event.id, status: "processing" })
    .select("id")
    .single();

  try {
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
        .select("timer_hours, status, creator_id, description, amount")
        .eq("id", tethrd_id)
        .single();

      if (!t || t.status !== "pending") {
        return NextResponse.json({ ok: true });
      }

      const expires_at = new Date(Date.now() + t.timer_hours * 60 * 60 * 1000).toISOString();

      await getSupabase()
        .from("tethrds")
        .update({ joiner_id: joiner_user_id, status: "active", payment_intent_id, expires_at })
        .eq("id", tethrd_id)
        .eq("status", "pending");

      const [creatorEmail, joinerUsername] = await Promise.all([
        getUserEmail(t.creator_id),
        getUsername(joiner_user_id),
      ]);

      if (creatorEmail) {
        await sendEmail(
          creatorEmail,
          "Someone joined your tethrd",
          `<p>Hi,</p>
          <p><strong>@${joinerUsername}</strong> has joined your tethrd "<strong>${t.description}</strong>" and paid $${t.amount}.</p>
          <p>Once both of you confirm the deal is done, funds will be released.</p>
          <p><a href="https://www.tethrd.io/tethrd/${tethrd_id}">View your tethrd →</a></p>`
        );
      }
    }

    if (record) {
      await getSupabase()
        .from("webhook_events")
        .update({ status: "completed" })
        .eq("id", record.id);
    }
  } catch (err) {
    if (record) {
      await getSupabase()
        .from("webhook_events")
        .update({
          status: "failed",
          error: err instanceof Error ? err.message : "Unknown error",
        })
        .eq("id", record.id);
    }
    throw err;
  }

  return NextResponse.json({ ok: true });
}
