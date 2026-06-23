import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { getUserEmail, getUsername } from "@/lib/clerk";
import { sendEmail } from "@/lib/resend";
import type { Tethrd } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action } = await req.json();

  const { data, error } = await getSupabase().from("tethrds").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const t = data as Tethrd;

  if (action === "join") {
    if (t.joiner_id || t.status !== "pending") {
      return NextResponse.json({ error: "Cannot join" }, { status: 400 });
    }
    if (userId === t.creator_id) {
      return NextResponse.json({ error: "Cannot join your own tethrd" }, { status: 400 });
    }
    const expires_at = new Date(Date.now() + t.timer_hours * 60 * 60 * 1000).toISOString();
    await getSupabase().from("tethrds").update({ joiner_id: userId, status: "active", expires_at }).eq("id", id);
    return NextResponse.json({ ok: true });
  }

  if (action === "confirm") {
    const isCreator = userId === t.creator_id;
    const isJoiner = userId === t.joiner_id;
    if (!isCreator && !isJoiner) return NextResponse.json({ error: "Not a participant" }, { status: 403 });
    if (t.status !== "active") return NextResponse.json({ error: "Cannot confirm at this stage" }, { status: 400 });

    // Step 1: Set this party's confirmation flag
    const flagUpdate = isCreator ? { creator_confirmed: true } : { joiner_confirmed: true };
    await getSupabase().from("tethrds").update(flagUpdate).eq("id", id);

    // Step 2: Atomically claim the capture — only one concurrent request can win this
    // The DB transitions active → capturing only if both flags are now true
    const { data: claimed } = await getSupabase()
      .from("tethrds")
      .update({ status: "capturing" })
      .eq("id", id)
      .eq("status", "active")
      .eq("creator_confirmed", true)
      .eq("joiner_confirmed", true)
      .select("id");

    if (!claimed || claimed.length === 0) {
      // Not both confirmed yet, or another request already claimed it — nothing to do
      return NextResponse.json({ ok: true });
    }

    // Step 3: Capture the payment — we're the only request that will reach this
    if (t.payment_intent_id) {
      try {
        await getStripe().paymentIntents.capture(t.payment_intent_id);
      } catch {
        // Status stays "capturing" so it can be investigated and retried manually
        return NextResponse.json({ error: "Payment capture failed. Please contact support." }, { status: 500 });
      }
    }

    // Step 4: Mark confirmed
    await getSupabase().from("tethrds").update({ status: "confirmed" }).eq("id", id);

    // Step 5: Notify both parties
    const [creatorEmail, joinerEmail, creatorUsername, joinerUsername] = await Promise.all([
      getUserEmail(t.creator_id),
      t.joiner_id ? getUserEmail(t.joiner_id) : Promise.resolve(null),
      getUsername(t.creator_id),
      t.joiner_id ? getUsername(t.joiner_id) : Promise.resolve("Joiner"),
    ]);

    const confirmedHtml = (name: string) =>
      `<p>Hi @${name},</p>
      <p>Both parties have confirmed "<strong>${t.description}</strong>". Funds of <strong>$${t.amount}</strong> have been released.</p>
      <p><a href="https://www.tethrd.io/tethrd/${id}">View your tethrd →</a></p>`;

    await Promise.all([
      creatorEmail ? sendEmail(creatorEmail, "Tethrd confirmed — funds released", confirmedHtml(creatorUsername)) : null,
      joinerEmail ? sendEmail(joinerEmail, "Tethrd confirmed — funds released", confirmedHtml(joinerUsername)) : null,
    ]);

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
