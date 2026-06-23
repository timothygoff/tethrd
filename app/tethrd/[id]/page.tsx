import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import TethrdActions from "./TethrdActions";
import { SCENARIO_LABELS, type Tethrd } from "@/lib/types";

export default async function TethrdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: tethrd, error } = await supabase
    .from("tethrds")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !tethrd) notFound();

  const t = tethrd as Tethrd;
  const isCreator = userId === t.creator_id;
  const isJoiner = userId === t.joiner_id;
  const canJoin = !isCreator && !t.joiner_id && t.status === "pending";

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto border-b border-slate-100">
        <a href="/dashboard" className="text-xl font-bold tracking-tight">tethrd</a>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          t.status === "confirmed" ? "bg-green-100 text-green-700" :
          t.status === "expired" ? "bg-red-100 text-red-600" :
          t.status === "active" ? "bg-indigo-100 text-indigo-600" :
          "bg-slate-100 text-slate-500"
        }`}>
          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
        </span>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2">
          {SCENARIO_LABELS[t.scenario]}
        </p>
        <h1 className="text-3xl font-bold mb-6">{t.description}</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Amount</p>
            <p className="text-lg font-bold">${t.amount.toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Time window</p>
            <p className="text-lg font-bold">{t.timer_hours}h</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">Currency</p>
            <p className="text-lg font-bold">{t.currency}</p>
          </div>
        </div>

        {/* Confirmation status */}
        <div className="border border-slate-100 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Confirmations</h2>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${t.creator_confirmed ? "bg-green-500" : "bg-slate-200"}`} />
              <span className="text-sm text-slate-600">
                Creator {t.creator_confirmed ? "confirmed ✓" : "pending"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${t.joiner_confirmed ? "bg-green-500" : "bg-slate-200"}`} />
              <span className="text-sm text-slate-600">
                {t.joiner_id ? (t.joiner_confirmed ? "Joiner confirmed ✓" : "Joiner pending") : "Waiting for second party"}
              </span>
            </div>
          </div>
        </div>

        <TethrdActions
          tethrd={t}
          userId={userId}
          isCreator={isCreator}
          isJoiner={isJoiner}
          canJoin={canJoin}
        />
      </section>
    </main>
  );
}
