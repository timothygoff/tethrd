import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";

const VALID_SCENARIOS = ["commitment_hold", "full_escrow", "service_payment"];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { scenario, amount, deadline, description } = await req.json();

  if (!scenario || !amount || !deadline || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!VALID_SCENARIOS.includes(scenario)) {
    return NextResponse.json({ error: "Invalid scenario" }, { status: 400 });
  }

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount >= 1_000_000) {
    return NextResponse.json({ error: "Amount must be between $0 and $1,000,000" }, { status: 400 });
  }

  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
    return NextResponse.json({ error: "Deadline must be a valid future date" }, { status: 400 });
  }

  if (typeof description !== "string" || description.trim().length < 5 || description.trim().length > 500) {
    return NextResponse.json({ error: "Description must be between 5 and 500 characters" }, { status: 400 });
  }

  const { data, error } = await getSupabase()
    .from("tethrds")
    .insert({
      creator_id: userId,
      scenario,
      amount,
      currency: "USD",
      timer_hours: 24,
      deadline,
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
