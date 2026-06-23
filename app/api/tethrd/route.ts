import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scenario, amount, timer_hours, description } = await req.json();

  if (!scenario || !amount || !timer_hours || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("tethrds")
    .insert({
      creator_id: userId,
      scenario,
      amount,
      currency: "USD",
      timer_hours,
      description,
      status: "pending",
      creator_confirmed: false,
      joiner_confirmed: false,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: "Failed to create tethrd" }, { status: 500 });

  return NextResponse.json({ id: data.id });
}
