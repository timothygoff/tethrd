import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { getUserEmail, getUsername } from "@/lib/clerk";
import { sendEmail } from "@/lib/resend";
import type { Tethrd } from "@/lib/types";

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fifteenMinutesFromNow = new Date(now.getTime() + 15 * 60 * 1000);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // Pass 1: send warning to tethrds expiring within 15 minutes
  const { data: toWarn } = await getSupabase()
    .from("tethrds")
    .select("*")
    .in("status", ["pending", "active"])
    .eq("warning_sent", false)
    .lte("deadline", fifteenMinutesFromNow.toISOString())
    .gt("deadline", fiveMinutesAgo.toISOString());

  // Pass 2: expire tethrds past deadline + 5 min grace
  const { data: toExpire } = await getSupabase()
    .from("tethrds")
    .select("*")
    .in("status", ["pending", "active"])
    .lt("deadline", fiveMinutesAgo.toISOString());

  const warnResults = await Promise.allSettled(
    (toWarn ?? []).map((row) => warnTethrd(row as Tethrd))
  );

  const expireResults = await Promise.allSettled(
    (toExpire ?? []).map((row) => expireTethrd(row as Tethrd))
  );

  return NextResponse.json({
    warned: warnResults.filter((r) => r.status === "fulfilled").length,
    expired: expireResults.filter((r) => r.status === "fulfilled").length,
  });
}

async function warnTethrd(t: Tethrd) {
  await getSupabase()
    .from("tethrds")
    .update({ warning_sent: true })
    .eq("id", t.id);

  const [creatorEmail, joinerEmail, creatorUsername, joinerUsername] =
    await Promise.all([
      getUserEmail(t.creator_id),
      t.joiner_id ? getUserEmail(t.joiner_id) : Promise.resolve(null),
      getUsername(t.creator_id),
      t.joiner_id ? getUsername(t.joiner_id) : Promise.resolve(null),
    ]);

  const warningHtml = (name: string) =>
    `<p>Hi @${name},</p>
    <p>Your tethrd "<strong>${t.description}</strong>" expires in 15 minutes. If both parties don't confirm before then, any held funds will be returned automatically after a short grace period.</p>
    <p><a href="https://www.tethrd.io/tethrd/${t.id}">Confirm now →</a></p>`;

  await Promise.all([
    creatorEmail
      ? sendEmail(creatorEmail, "Your tethrd expires in 15 minutes", warningHtml(creatorUsername))
      : null,
    joinerEmail && joinerUsername
      ? sendEmail(joinerEmail, "Your tethrd expires in 15 minutes", warningHtml(joinerUsername))
      : null,
  ]);
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
      ? sendEmail(creatorEmail, "Tethrd expired — funds returned", expiredHtml(creatorUsername))
      : null,
    joinerEmail && joinerUsername
      ? sendEmail(joinerEmail, "Tethrd expired — funds returned", expiredHtml(joinerUsername))
      : null,
  ]);
}
