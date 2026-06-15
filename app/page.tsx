"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-slate-100">
        <span className="text-xl font-bold tracking-tight text-slate-900">tethrd</span>
        <span className="text-sm text-slate-400">Secure escrow for everyone</span>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-24 max-w-3xl mx-auto">
        <div className="inline-block bg-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          Coming Soon
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-6 text-slate-900">
          Two parties.<br />Funds held.<br />
          <span className="text-indigo-600">Both confirm.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mb-10 leading-relaxed">
          tethrd holds funds securely between two people until both sides confirm the deal is done. No agreement? Timer expires and everyone gets their money back — automatically.
        </p>

        {submitted ? (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-8 py-5 text-indigo-600 text-sm font-medium">
            You&apos;re on the list. We&apos;ll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap shadow-sm"
            >
              Get Early Access
            </button>
          </form>
        )}
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2 text-slate-900">How it works</h2>
        <p className="text-slate-400 text-center text-sm mb-12">Three steps. No middleman. No drama.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Create a tethrd",
              desc: "Choose your scenario, set the amount, and pick a time window — 3, 6, 12, or 24 hours.",
            },
            {
              step: "2",
              title: "Share the link",
              desc: "Send the link to the other party. They join, review the terms, and deposit their portion.",
            },
            {
              step: "3",
              title: "Both confirm, funds release",
              desc: "After the meeting or service, both parties confirm. Funds release instantly. Timer expires? Full refund to both.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold text-white mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Scenarios */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-slate-900">Built for every situation</h2>
          <p className="text-slate-400 text-center mb-12 text-sm">Three scenarios to cover any two-party transaction.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "Commitment Hold",
                icon: "🤝",
                desc: "Person A deposits to secure a meeting slot. Both confirm post-meeting — deposit releases. No-show? Auto-refund.",
              },
              {
                title: "Full Two-Way Escrow",
                icon: "⚖️",
                desc: "Both parties deposit simultaneously. Both confirm — funds cross. Timer expires — everything returns to its owner.",
              },
              {
                title: "Service Payment",
                icon: "💼",
                desc: "Client pays upfront into escrow. Provider delivers, both confirm, payment releases. No delivery? Full refund.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <div className="text-2xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-24 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">No arbitration. No disputes.<br />The timer decides.</h2>
        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
          Flat fee per transaction. Both parties protected. Launch coming soon — get early access now.
        </p>
        {submitted ? (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-8 py-5 text-indigo-600 text-sm font-medium inline-block">
            You&apos;re on the list. We&apos;ll be in touch.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors whitespace-nowrap shadow-sm"
            >
              Get Early Access
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-8 text-center text-slate-400 text-xs">
        © {new Date().getFullYear()} tethrd. All rights reserved.
      </footer>

    </main>
  );
}
