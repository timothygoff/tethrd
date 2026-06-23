import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import type { Tethrd } from "@/lib/types";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action } = await req.json();

  const { data, error } = await supabase.from("tethrds").select("*").eq("id", id).single();
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
    await supabase.from("tethrds").update({ joiner_id: userId, status: "active", expires_at }).eq("id", id);
    return NextResponse.json({ ok: true });
  }

  if (action === "confirm") {
    const isCreator = userId === t.creator_id;
    const isJoiner = userId === t.joiner_id;
    if (!isCreator && !isJoiner) return NextResponse.json({ error: "Not a participant" }, { status: 403 });

    const update: Partial<Tethrd> = isCreator
      ? { creator_confirmed: true }
      : { joiner_confirmed: true };

    const bothConfirmed =
      (isCreator && t.joiner_confirmed) || (isJoiner && t.creator_confirmed);

    if (bothConfirmed) update.status = "confirmed";

    await supabase.from("tethrds").update(update).eq("id", id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
