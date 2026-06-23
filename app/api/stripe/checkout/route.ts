import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { SCENARIO_LABELS, type Tethrd } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tethrd_id } = await req.json();

  const { data, error } = await supabase.from("tethrds").select("*").eq("id", tethrd_id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const t = data as Tethrd;

  if (t.joiner_id || t.status !== "pending") {
    return NextResponse.json({ error: "Cannot join" }, { status: 400 });
  }
  if (userId === t.creator_id) {
    return NextResponse.json({ error: "Cannot join your own tethrd" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://www.tethrd.io";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_intent_data: {
      capture_method: "manual",
      metadata: { tethrd_id, joiner_user_id: userId },
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `tethrd: ${t.description}`,
            description: `${SCENARIO_LABELS[t.scenario]} · ${t.timer_hours}h window`,
          },
          unit_amount: Math.round(t.amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { tethrd_id, joiner_user_id: userId },
    success_url: `${origin}/tethrd/${tethrd_id}?payment=success`,
    cancel_url: `${origin}/tethrd/${tethrd_id}`,
  });

  return NextResponse.json({ url: session.url });
}
