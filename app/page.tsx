"use client";

import { useState } from "react";
import SiteHeader from "./_components/SiteHeader";
import SiteFooter from "./_components/SiteFooter";

function WaitlistForm({
  source,
  microcopy,
}: {
  source: string;
  microcopy: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
      setEmail("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="signup" onSubmit={handleSubmit}>
        {submitted ? (
          <div className="signup-done" role="status">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--gold-fill)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            You&apos;re on the list — we&apos;ll email your invite soon.
          </div>
        ) : (
          <>
            <div className="field">
              <input
                type="email"
                required
                placeholder="you@email.com"
                aria-label="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Joining…" : "Join the waitlist"}
              </button>
            </div>
            {error && <p className="signup-error">{error}</p>}
          </>
        )}
      </form>
      {!submitted && microcopy}
    </>
  );
}

export default function Home() {
  return (
    <div className="landing">
      <SiteHeader />

      <main id="top">
        <section className="hero band-navy">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Payment protection</span>
              <h1>
                Neither of you has to <span className="hl">go first</span>.
              </h1>
              <p className="lead">
                tethrd holds the payment the second a deal is struck — and
                releases it the second both sides deliver. Safe payments for
                private sales, freelance work, and every handshake in between.
              </p>

              <WaitlistForm
                source="landing-hero"
                microcopy={
                  <p className="microcopy">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Early access is rolling out soon. No spam — just your invite.
                  </p>
                }
              />
            </div>

            <div className="tether-stage">
              <svg
                className="tether-svg"
                viewBox="0 0 460 200"
                role="img"
                aria-label="A payment held safely on a line between two parties."
              >
                <line className="t-line" x1="52" y1="118" x2="408" y2="118" />
                <circle className="t-endpoint" cx="52" cy="118" r="8.5" />
                <circle className="t-endpoint" cx="408" cy="118" r="8.5" />
                <text className="t-label" x="52" y="150" textAnchor="middle">
                  You
                </text>
                <text className="t-label" x="408" y="150" textAnchor="middle">
                  Them
                </text>

                <circle className="t-glow" cx="230" cy="118" r="30" />
                <circle className="t-node" cx="230" cy="118" r="20" />
                <g className="t-lock">
                  <rect
                    x="223"
                    y="116"
                    width="14"
                    height="11"
                    rx="2"
                    fill="#23180A"
                  />
                  <path
                    d="M225.5 116 v-2.4 a4.5 4.5 0 0 1 9 0 V116"
                    fill="none"
                    stroke="#23180A"
                    strokeWidth="2"
                  />
                </g>

                <g className="t-amount-pill">
                  <rect
                    className="t-amount-bg"
                    x="176"
                    y="48"
                    width="108"
                    height="42"
                    rx="10"
                  />
                  <text
                    className="t-amount-tag"
                    x="230"
                    y="65"
                    textAnchor="middle"
                  >
                    HELD
                  </text>
                  <text
                    className="t-amount-text"
                    x="230"
                    y="81"
                    textAnchor="middle"
                  >
                    $1,200.00
                  </text>
                  <line
                    x1="230"
                    y1="90"
                    x2="230"
                    y2="98"
                    stroke="var(--gold-fill)"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">How it works</span>
              <h2>One tether. Three moments.</h2>
              <p>
                The money is always in exactly one place — and both of you can
                always see where.
              </p>
            </div>
            <div className="steps">
              <div className="step">
                <div className="bead">01</div>
                <div className="step-body">
                  <h3>Fund</h3>
                  <p>
                    The buyer puts the money in. It leaves their account but
                    doesn&apos;t reach the seller — it&apos;s held safely in the
                    middle, in plain sight of both sides.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="bead">02</div>
                <div className="step-body">
                  <h3>Hold</h3>
                  <p>
                    Everyone does their part: ship the item, finish the work,
                    hand over the keys. The payment waits — protected — while the
                    deal plays out.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="bead">03</div>
                <div className="step-body">
                  <h3>Release</h3>
                  <p>
                    Done and confirmed? The payment releases to the seller in
                    full. Deal fell through? It goes straight back to the buyer.
                    No chasing, no ghosting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="who">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Who it&apos;s for</span>
              <h2>Built for the deals where trust is the hard part.</h2>
            </div>
            <div className="cards">
              <div className="card">
                <div className="ic">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l1.5-4.5A2 2 0 0 1 6.4 3h11.2a2 2 0 0 1 1.9 1.5L21 9" />
                    <path d="M3 9h18v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 13h6" />
                  </svg>
                </div>
                <h3>Private sales</h3>
                <p>
                  Selling a couch, a camera, or a car to someone you found in an
                  online listing. Both of you commit without gambling on the
                  other being honest.
                </p>
              </div>
              <div className="card">
                <div className="ic">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 7h16v13H4z" />
                    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                    <path d="M4 12h16" />
                  </svg>
                </div>
                <h3>Freelance &amp; services</h3>
                <p>
                  Clients fund the project before you start. You do the work
                  knowing the money&apos;s already there — and it releases the
                  moment you deliver.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section band-navy trust">
          <div className="wrap">
            <span className="eyebrow">Why it&apos;s safe</span>
            <h2>Your money is protected the whole way through.</h2>
            <div className="trust-grid">
              <div className="trust-item">
                <h4>Powered by Stripe</h4>
                <p>
                  Every payment runs on Stripe&apos;s infrastructure. tethrd
                  never touches your money directly.
                </p>
              </div>
              <div className="trust-item">
                <h4>Held, not spent</h4>
                <p>
                  Funds sit protected until your deal&apos;s agreed conditions
                  are met — not a moment before.
                </p>
              </div>
              <div className="trust-item">
                <h4>Refunded if it falls apart</h4>
                <p>
                  If the deal doesn&apos;t happen, the buyer gets every cent
                  back. Automatically.
                </p>
              </div>
              <div className="trust-item">
                <h4>One flat fee</h4>
                <p>
                  2% per protected deal, paid at release. No subscriptions, no
                  surprises.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>The questions everyone asks first.</h2>
            </div>
            <div className="faq">
              <details open>
                <summary>
                  How does tethrd actually keep my money safe?
                  <svg
                    className="chev"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p>
                  Every payment is processed and held through Stripe, our
                  payments partner. The funds are protected the entire time and
                  only move when your deal&apos;s agreed conditions are met.
                </p>
              </details>
              <details>
                <summary>
                  When does the seller get paid?
                  <svg
                    className="chev"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p>
                  The moment the buyer confirms they&apos;ve received what was
                  agreed. Once released, the payment lands in the seller&apos;s
                  account on Stripe&apos;s normal payout schedule.
                </p>
              </details>
              <details>
                <summary>
                  What happens if the deal falls through?
                  <svg
                    className="chev"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p>
                  If the conditions aren&apos;t met or the deadline passes, the
                  payment is returned to the buyer in full. Nobody&apos;s left
                  chasing a refund.
                </p>
              </details>
              <details>
                <summary>
                  What does it cost?
                  <svg
                    className="chev"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p>
                  A flat 2% per protected deal, paid when the payment is
                  released. No monthly fees and nothing to pay if a deal never
                  goes ahead.
                </p>
              </details>
              <details>
                <summary>
                  When can I start using it?
                  <svg
                    className="chev"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p>
                  We&apos;re rolling out early access now, in small batches. Join
                  the waitlist and you&apos;ll be among the first invited in.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="section band-navy final" id="join">
          <div className="wrap">
            <span className="eyebrow">Early access</span>
            <h2>Be first on the tether.</h2>
            <p>
              We&apos;re inviting early users in small batches. Drop your email
              and we&apos;ll reach out the moment your spot opens up.
            </p>
            <WaitlistForm
              source="landing-final"
              microcopy={
                <p className="microcopy">
                  We&apos;ll only ever email you about your invite.
                </p>
              }
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
