import type { Metadata } from "next";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Service — tethrd",
  description:
    "The terms that govern your use of tethrd's payment-protection service — how funds are held and released, fees, your responsibilities, and the limits of our role.",
};

const EFFECTIVE_DATE = "July 9, 2026";

export default function TermsPage() {
  return (
    <div className="landing">
      <SiteHeader />

      <main>
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Legal</span>
              <h2>Terms of Service</h2>
              <p>
                These terms govern your use of tethrd. They&apos;re written to be
                readable, but they&apos;re still a binding agreement — please read
                them.
              </p>
            </div>

            <div className="legal">
              <p className="updated">Effective date: {EFFECTIVE_DATE}</p>

              <h3>1. Agreement to these terms</h3>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) are an agreement
                between you and tethrd (&ldquo;tethrd,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us&rdquo;). By joining our waitlist, creating an account, or
                using our website at{" "}
                <a href="https://www.tethrd.io">tethrd.io</a> or our services, you
                agree to these Terms. If you don&apos;t agree, please don&apos;t
                use tethrd.
              </p>
              <p>
                tethrd is currently in early access. Features described here may
                roll out over time, and we may update these Terms as the service
                grows (see Section 14).
              </p>

              <h3>2. What tethrd does</h3>
              <p>
                tethrd provides payment protection for deals between two parties.
                When a deal is struck, the buyer&apos;s payment is held until the
                agreed conditions are met — then it&apos;s released to the seller.
                If the conditions aren&apos;t met or the deadline passes, the
                payment is returned to the buyer.
              </p>
              <p>
                tethrd is a technology service, not a bank, money transmitter, or
                fiduciary. We are not a party to the underlying deal between you
                and the other person, and we do not take ownership of the money.
                Funds are processed and held through our payments partner, Stripe.
                Your use of the payment features is also subject to Stripe&apos;s
                applicable agreements, including — for those receiving funds — the{" "}
                <a href="https://stripe.com/legal/connect-account">
                  Stripe Connected Account Agreement
                </a>
                .
              </p>

              <h3>3. Eligibility</h3>
              <p>
                You must be at least 18 years old and able to form a binding
                contract to use tethrd. By using the service you confirm that the
                information you provide is accurate and that you&apos;ll keep it up
                to date.
              </p>

              <h3>4. Your account</h3>
              <p>
                You&apos;re responsible for your account and for keeping your login
                credentials secure. You&apos;re responsible for everything that
                happens under your account. Tell us promptly at{" "}
                <a href="mailto:hello@tethrd.io">hello@tethrd.io</a> if you suspect
                unauthorized use.
              </p>

              <h3>5. How payment protection works</h3>
              <ul>
                <li>
                  <strong>Fund.</strong> The buyer submits payment, which is held
                  through Stripe rather than sent directly to the seller.
                </li>
                <li>
                  <strong>Hold.</strong> The payment stays protected while both
                  parties do their part, up to the deadline set for the deal.
                </li>
                <li>
                  <strong>Release.</strong> When the agreed conditions are
                  confirmed, the payment is released to the seller. If the
                  conditions aren&apos;t met or the deadline passes, it&apos;s
                  refunded to the buyer.
                </li>
              </ul>
              <p>
                You and the other party are responsible for agreeing on the terms
                of your deal — what&apos;s being exchanged, the amount, the
                deadline, and what &ldquo;done&rdquo; means. tethrd does not verify,
                guarantee, or take responsibility for the quality, legality, or
                delivery of any goods or services exchanged.
              </p>

              <h3>6. Fees</h3>
              <p>
                tethrd charges a flat fee of 2% per protected deal, applied when
                the payment is released. There are no subscription fees, and if a
                deal never goes ahead there is nothing to pay. Payment processing
                may involve additional charges from Stripe; we&apos;ll make the
                total clear before you commit to a deal. We may change our fees in
                the future, but changes won&apos;t affect a deal already underway.
              </p>

              <h3>7. Your responsibilities and acceptable use</h3>
              <p>You agree not to use tethrd to:</p>
              <ul>
                <li>break any law or facilitate an illegal transaction;</li>
                <li>
                  buy or sell prohibited, stolen, counterfeit, or restricted items,
                  or anything Stripe&apos;s rules don&apos;t allow;
                </li>
                <li>commit fraud, launder money, or deceive the other party;</li>
                <li>
                  infringe anyone&apos;s intellectual property or other rights;
                </li>
                <li>
                  interfere with, probe, or disrupt the service or its security.
                </li>
              </ul>
              <p>
                We may suspend or close accounts, and hold, refund, or reverse
                payments, where we reasonably believe these Terms or the law have
                been broken.
              </p>

              <h3>8. Disputes between users</h3>
              <p>
                tethrd&apos;s role is limited to holding and releasing the payment
                according to the agreed conditions and deadline. We are not a judge
                of your deal and do not provide arbitration. If a deal doesn&apos;t
                go ahead, the payment returns to the buyer; if it does, it releases
                to the seller. Any dispute about the goods or services themselves is
                between you and the other party. Where the law gives you rights
                against a payment provider (for example, card chargebacks), those
                remain available to you through Stripe and your bank.
              </p>

              <h3>9. Refunds and cancellations</h3>
              <p>
                Because the outcome of a deal is driven by its agreed conditions and
                deadline, refunds happen automatically when conditions aren&apos;t
                met or a deal expires. Once a payment has been released to the
                seller, it is no longer held by the service and any further refund
                is a matter between you and the other party.
              </p>

              <h3>10. Service availability</h3>
              <p>
                We work to keep tethrd available and reliable, but we provide the
                service &ldquo;as is&rdquo; and can&apos;t promise it will always be
                uninterrupted or error-free. We may change, suspend, or discontinue
                features, and we&apos;ll try to give reasonable notice of
                significant changes.
              </p>

              <h3>11. Disclaimers</h3>
              <p>
                To the fullest extent permitted by law, tethrd disclaims all
                warranties, express or implied, including merchantability, fitness
                for a particular purpose, and non-infringement. We do not warrant
                the conduct of any user or the outcome of any deal.
              </p>

              <h3>12. Limitation of liability</h3>
              <p>
                To the fullest extent permitted by law, tethrd will not be liable
                for indirect, incidental, special, consequential, or punitive
                damages, or for lost profits or lost data. Our total liability for
                any claim relating to the service will not exceed the greater of
                the fees you paid to tethrd for the deal at issue or one hundred US
                dollars (US $100).
              </p>

              <h3>13. Indemnification</h3>
              <p>
                You agree to indemnify and hold tethrd harmless from claims,
                losses, and expenses (including reasonable legal fees) arising out
                of your deals, your use of the service, or your breach of these
                Terms or the law.
              </p>

              <h3>14. Changes to these terms</h3>
              <p>
                We may update these Terms from time to time. When we make material
                changes, we&apos;ll update the effective date above and, where
                appropriate, notify you. Continuing to use tethrd after an update
                means you accept the revised Terms.
              </p>

              <h3>15. Termination</h3>
              <p>
                You may stop using tethrd at any time. We may suspend or end your
                access if you breach these Terms or use the service in a way that
                creates risk or legal exposure. Sections that by their nature should
                survive termination — such as fees owed, disclaimers, limitation of
                liability, and indemnification — will continue to apply.
              </p>

              <h3>16. Governing law</h3>
              <p>
                These Terms are governed by the laws applicable to tethrd&apos;s
                governing business entity, without regard to conflict-of-laws rules.
                Any dispute that isn&apos;t resolved informally will be handled in
                the courts of that jurisdiction. Nothing here removes any consumer
                protection you&apos;re entitled to under the mandatory laws of your
                home country.
              </p>

              <h3>17. Contact</h3>
              <p>
                Questions about these Terms? Email{" "}
                <a href="mailto:hello@tethrd.io">hello@tethrd.io</a>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
