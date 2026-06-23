import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { getUserEmail, getUsername } from "@/lib/clerk";
import { sendEmail } from "@/lib/resend";
import type { Tethrd } from "@/lib/types";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();

  const { data: expired, error } = await getSupabase()
    .from("tethrds")
    .select("*")
    .in("status", ["pending", "active"])
    .lt("deadline", now);

  if (error) {
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  }

  if (!expired || expired.length === 0) {
    return NextResponse.json({ expired: 0 });
  }

  const results = await Promise.allSettled(
    expired.map((row) => expireTethrd(row as Tethrd))
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({ expired: succeeded, failed });
}

async function expireTethrd(t: Tethrd) {
  if (t.payment_intent_id) {
    try {
      await getStripe().paymentIntents.cancel(t.payment_intent_id);
    } catch {
      // PI may already be cancelled or captured — continue
    }
  }

  await getSupabase()
    .from("tethrds")
    .update({ status: "expired" })
    .eq("id", t.id);

  const [creatorEmail, joinerEmail, creatorUsername, joinerUsername] =
    await Promise.all([
      getUserEmail(t.creator_id),
      t.joiner_id ? getUserEmail(t.joiner_id) : Promise.resolve(null),
      getUsername(t.creator_id),
      t.joiner_id ? getUsername(t.joiner_id) : Promise.resolve(null),
    ]);

  const expiredHtml = (name: string) =>
    `<p>Hi @${name},</p>
    <p>The deadline for "<strong>${t.description}</strong>" has passed without both parties confirming. Any held funds have been returned.</p>
    <p><a href="https://www.tethrd.io/tethrd/${t.id}">View your tethrd →</a></p>`;

  await Promise.all([
    creatorEmail
      ? sendEmail(
          creatorEmail,
          "Tethrd expired — funds returned",
          expiredHtml(creatorUsername)
        )
      : null,
    joinerEmail && joinerUsername
      ? sendEmail(
          joinerEmail,
          "Tethrd expired — funds returned",
          expiredHtml(joinerUsername)
        )
      : null,
  ]);
}
