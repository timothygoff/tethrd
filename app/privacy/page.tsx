import type { Metadata } from "next";
import SiteHeader from "../_components/SiteHeader";
import SiteFooter from "../_components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy — tethrd",
  description:
    "How tethrd collects, uses, and protects your personal information — including waitlist sign-ups and, at launch, account and payment-protection data.",
};

const EFFECTIVE_DATE = "July 9, 2026";

export default function PrivacyPage() {
  return (
    <div className="landing">
      <SiteHeader />

      <main>
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Legal</span>
              <h2>Privacy Policy</h2>
              <p>
                This policy explains what personal information tethrd collects,
                why we collect it, and the choices you have. We keep it in plain
                language on purpose.
              </p>
            </div>

            <div className="legal">
              <p className="updated">Effective date: {EFFECTIVE_DATE}</p>

              <h3>1. Who we are</h3>
              <p>
                tethrd (&ldquo;tethrd,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;)
                provides payment-protection tools that hold a payment between two
                parties until the agreed conditions of their deal are met. This
                policy applies to our website at{" "}
                <a href="https://www.tethrd.io">tethrd.io</a> and the services we
                offer through it. You can reach us any time at{" "}
                <a href="mailto:hello@tethrd.io">hello@tethrd.io</a>.
              </p>
              <p>
                tethrd is currently in early access. Some of the data practices
                below describe information we will process once the full service
                launches; today we primarily collect waitlist sign-ups.
              </p>

              <h3>2. Information we collect</h3>
              <p>
                <strong>When you join the waitlist.</strong> We collect the email
                address you submit, the date you submitted it, and which part of
                the site you signed up from. We use this only to contact you about
                early access.
              </p>
              <p>
                <strong>When you create an account (at launch).</strong> To use
                tethrd you&apos;ll create an account through our authentication
                provider. This includes your name, email address, and login
                credentials, which are handled by that provider on our behalf.
              </p>
              <p>
                <strong>When you use payment protection (at launch).</strong> To
                fund, hold, and release a payment we process details about your
                deal — the amount, the counterparty, timing, and its status. We
                also collect the information needed to move money, but your card
                and bank details are collected and stored by our payments partner
                (Stripe), not by tethrd. We never see or store your full card
                number.
              </p>
              <p>
                <strong>Automatically.</strong> Like most websites, we and our
                infrastructure providers automatically receive limited technical
                data — such as your IP address, browser type, device information,
                and pages viewed — to keep the service secure, reliable, and free
                of errors.
              </p>

              <h3>3. How we use your information</h3>
              <ul>
                <li>To contact you about early access if you joined the waitlist.</li>
                <li>To create and secure your account and authenticate your logins.</li>
                <li>
                  To operate payment protection — creating deals, holding funds,
                  releasing or refunding them, and notifying both parties.
                </li>
                <li>To send transactional email, such as confirmations and status updates.</li>
                <li>To prevent fraud, enforce our terms, and keep the service safe.</li>
                <li>To diagnose errors, monitor performance, and improve the product.</li>
                <li>To comply with legal, tax, and regulatory obligations.</li>
              </ul>

              <h3>4. How your information is shared</h3>
              <p>
                We do not sell your personal information. We share it only with
                service providers that help us run tethrd, and only as needed for
                them to perform their function:
              </p>
              <ul>
                <li>
                  <strong>Stripe</strong> — payment processing and the holding,
                  release, and refund of funds.
                </li>
                <li>
                  <strong>Clerk</strong> — account creation, login, and
                  authentication.
                </li>
                <li>
                  <strong>Supabase</strong> — secure database storage for your
                  account and deal records.
                </li>
                <li>
                  <strong>Airtable</strong> — storage of waitlist sign-ups.
                </li>
                <li>
                  <strong>Resend</strong> — delivery of transactional email.
                </li>
                <li>
                  <strong>Vercel</strong> — website hosting and infrastructure.
                </li>
                <li>
                  <strong>Sentry</strong> — error monitoring and performance
                  diagnostics.
                </li>
              </ul>
              <p>
                Each of these providers processes data under its own privacy and
                security commitments. We may also disclose information if required
                by law, to protect our rights, or in connection with a merger,
                acquisition, or sale of assets.
              </p>

              <h3>5. Data retention</h3>
              <p>
                We keep your information for as long as your account is active or
                as needed to provide the service. Waitlist emails are kept until
                you ask us to remove them or we no longer need them for early
                access. Transaction records may be retained longer where required
                for legal, accounting, or fraud-prevention purposes.
              </p>

              <h3>6. Security</h3>
              <p>
                We use reputable providers and industry-standard measures —
                including encryption in transit — to protect your information.
                Payment card data is handled by Stripe, a PCI-DSS Level 1
                certified provider. No method of transmission or storage is ever
                completely secure, but we work to protect your data and to respond
                promptly if an issue arises.
              </p>

              <h3>7. Your rights and choices</h3>
              <p>
                Depending on where you live, you may have the right to access,
                correct, delete, or export your personal information, to object to
                or restrict certain processing, and to withdraw consent. You can
                unsubscribe from waitlist and marketing emails at any time using
                the link in those emails. To exercise any of these rights, email
                us at <a href="mailto:hello@tethrd.io">hello@tethrd.io</a> and
                we&apos;ll respond as required by applicable law.
              </p>

              <h3>8. Cookies</h3>
              <p>
                We use cookies and similar technologies that are necessary to run
                the site — for example, to keep you logged in and to keep the
                service secure. We do not use them to sell your data. You can
                control cookies through your browser settings, though some
                features may not work without them.
              </p>

              <h3>9. International transfers</h3>
              <p>
                We and our providers may process and store your information in
                countries other than your own, including the United States. Where
                required, we rely on appropriate safeguards for these transfers.
              </p>

              <h3>10. Children</h3>
              <p>
                tethrd is not intended for anyone under 18, and we do not
                knowingly collect personal information from children. If you
                believe a child has provided us information, contact us and we
                will delete it.
              </p>

              <h3>11. Changes to this policy</h3>
              <p>
                We may update this policy as tethrd grows and as our services
                launch. When we make material changes, we&apos;ll update the
                effective date above and, where appropriate, notify you. Your
                continued use of tethrd after an update means you accept the
                revised policy.
              </p>

              <h3>12. Contact us</h3>
              <p>
                Questions about this policy or your information? Email{" "}
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
