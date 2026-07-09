/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="band-navy">
      <div className="wrap foot">
        <div>
          <div className="brand">
            <img
              className="brand-logo"
              src="/tethrd-logo-white.png"
              alt="tethrd"
              width={138}
              height={30}
            />
          </div>
          <p className="foot-tag" style={{ marginTop: 10 }}>
            Payment protection for two-party deals.
          </p>
        </div>
        <div className="foot-links">
          {/* TODO: point to /terms once the Terms page ships */}
          <a href="#">Terms</a>
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:hello@tethrd.io">hello@tethrd.io</a>
          <span className="foot-tag">© {new Date().getFullYear()} tethrd</span>
        </div>
      </div>
    </footer>
  );
}
