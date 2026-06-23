import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";
import { SCENARIO_LABELS, type Tethrd } from "@/lib/types";

export default async function Dashboard() {
  const { userId } = await auth();

  const { data: tethrds } = await getSupabase()
    .from("tethrds")
    .select("*")
    .or(`creator_id.eq.${userId},joiner_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-slate-100">
        <span className="text-xl font-bold tracking-tight">tethrd</span>
        <div className="flex items-center gap-4">
          <Link
            href="/tethrd/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + New tethrd
          </Link>
          <UserButton />
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Your tethrds</h1>

        {!tethrds || tethrds.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 mb-4">No tethrds yet.</p>
            <Link href="/tethrd/new" className="text-indigo-600 font-semibold text-sm">
              Create your first one →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(tethrds as Tethrd[]).map((t) => (
              <Link
                key={t.id}
                href={`/tethrd/${t.id}`}
                className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors"
              >
                <div>
                  <p className="font-semibold text-slate-900 mb-1">{t.description}</p>
                  <p className="text-xs text-slate-400">{SCENARIO_LABELS[t.scenario]} · ${t.amount} · {t.timer_hours}h</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  t.status === "confirmed" ? "bg-green-100 text-green-700" :
                  t.status === "expired" ? "bg-red-100 text-red-600" :
                  t.status === "active" ? "bg-indigo-100 text-indigo-600" :
                  "bg-slate-100 text-slate-500"
                }`}>
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
