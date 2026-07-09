"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

function toggleTheme() {
  const root = document.documentElement;
  let current = root.getAttribute("data-theme");
  if (!current) {
    current = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  root.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

export default function SiteHeader() {
  return (
    <header>
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label="tethrd home">
          <img
            className="brand-logo logo-navy"
            src="/tethrd-logo-navy.png"
            alt="tethrd"
            width={138}
            height={30}
          />
          <img
            className="brand-logo logo-gold"
            src="/tethrd-logo-gold.png"
            alt="tethrd"
            width={138}
            height={30}
          />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          <Link href="/#how">How it works</Link>
          <Link href="/#who">Who it&apos;s for</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div className="nav-right">
          <button
            className="icon-btn"
            id="themeBtn"
            aria-label="Toggle color theme"
            onClick={toggleTheme}
          >
            <svg
              className="moon"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <svg
              className="sun"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          </button>
          <Link href="/#join" className="btn btn-primary">
            Join the waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
