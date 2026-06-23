"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Tethrd } from "@/lib/types";

export default function TethrdActions({
  tethrd,
  userId,
  isCreator,
  isJoiner,
  canJoin,
}: {
  tethrd: Tethrd;
  userId: string | null;
  isCreator: boolean;
  isJoiner: boolean;
  canJoin: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const post = async (action: "join" | "confirm") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tethrd/${tethrd.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Action failed");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://www.tethrd.io/tethrd/${tethrd.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canConfirm =
    (isCreator && !tethrd.creator_confirmed && tethrd.status !== "pending") ||
    (isJoiner && !tethrd.joiner_confirmed);

  if (tethrd.status === "confirmed") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-5 text-green-700 text-sm font-medium">
        Both parties confirmed. Funds released.
      </div>
    );
  }

  if (tethrd.status === "expired") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-5 text-red-600 text-sm font-medium">
        Time expired. Funds returned to both parties.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Share link — always visible */}
      {isCreator && tethrd.status === "pending" && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
          <p className="text-xs text-slate-500 mb-2 font-medium">Share this link with the other party</p>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-700 truncate flex-1 font-mono">{`https://www.tethrd.io/tethrd/${tethrd.id}`}</p>
            <button
              onClick={copyLink}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>
      )}

      {canJoin && (
        <button
          onClick={() => post("join")}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Joining..." : "Join this tethrd"}
        </button>
      )}

      {canConfirm && (
        <button
          onClick={() => post("confirm")}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Confirming..." : "Confirm — deal is done ✓"}
        </button>
      )}

      {!userId && canJoin && (
        <p className="text-sm text-slate-500 text-center">
          <Link href="/sign-in" className="text-indigo-600 font-medium">Sign in</Link> to join this tethrd.
        </p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
