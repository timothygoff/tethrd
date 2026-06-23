"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SCENARIO_LABELS, SCENARIO_DESCRIPTIONS, type Scenario } from "@/lib/types";

const SCENARIOS: Scenario[] = ["commitment_hold", "full_escrow", "service_payment"];

function minDeadline() {
  const d = new Date();
  d.setHours(d.getHours() + 1);
  return d.toISOString().slice(0, 16);
}

export default function NewTethrd() {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario>("commitment_hold");
  const [amount, setAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tethrd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          amount: parseFloat(amount),
          deadline: new Date(deadline).toISOString(),
          description,
        }),
      });
      if (!res.ok) throw new Error("Failed to create tethrd");
      const { id } = await res.json();
      router.push(`/tethrd/${id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <nav className="flex items-center justify-between px-6 py-5 max-w-3xl mx-auto border-b border-slate-100">
        <a href="/dashboard" className="text-xl font-bold tracking-tight">tethrd</a>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Create a tethrd</h1>
        <p className="text-slate-500 text-sm mb-10">Set the terms. Share the link. Both confirm.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Scenario */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Scenario</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SCENARIOS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScenario(s)}
                  className={`text-left p-4 rounded-xl border transition-colors ${
                    scenario === s
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="font-semibold text-sm text-slate-900 mb-1">{SCENARIO_LABELS[s]}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{SCENARIO_DESCRIPTIONS[s]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700 mb-2">
              Deadline
            </label>
            <p className="text-xs text-slate-400 mb-3">If both parties haven&apos;t confirmed by this date and time, funds are returned automatically.</p>
            <input
              id="deadline"
              type="datetime-local"
              required
              min={minDeadline()}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full max-w-xs px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              required
              rows={3}
              placeholder="Describe the deal — what are both parties agreeing to?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create tethrd →"}
          </button>
        </form>
      </section>
    </main>
  );
}
