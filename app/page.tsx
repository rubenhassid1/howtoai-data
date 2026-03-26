"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#171717] flex flex-col items-center">
      <main className="w-full max-w-xl px-5 pt-14 pb-10">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-xl bg-[#FF6719] flex items-center justify-center mb-4">
            <span className="text-white text-lg font-bold leading-none" style={{ fontFamily: "Arial, sans-serif" }}>
              AI
            </span>
          </div>
          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-tight">
            How to AI Data
          </h1>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#252525] mb-8" />

        {/* Download section */}
        <h2 className="text-[15px] font-semibold text-white mb-1.5">
          Download the data
        </h2>
        <p className="text-[#a2a2a2] text-[13px] leading-snug mb-6">
          Enter your subscriber email and we&apos;ll send a sign-in link to download the data.
        </p>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Free tier */}
          <div className="rounded-lg border border-[#252525] bg-[#1e1e1e] px-4 py-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a2a2a2]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a2a2a2]">
                Free subscribers
              </span>
            </div>
            <p className="text-[#ccc] text-[13px] leading-relaxed">
              <strong className="text-white">All 72 newsletter posts</strong> as Markdown files in a ZIP + MCP access.
            </p>
          </div>

          {/* Paid tier */}
          <div className="rounded-lg border border-[#FF6719]/25 bg-[#1e1e1e] px-4 py-3.5 relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF6719]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6719]">
                Paid subscribers
              </span>
            </div>
            <ul className="text-[#ccc] text-[13px] leading-relaxed space-y-1">
              <li><strong className="text-white">Everything free gets</strong></li>
              <li>+ Private Slack community</li>
              <li>+ $219 in AI tools bundle</li>
              <li>+ Direct LinkedIn connection</li>
            </ul>
          </div>
        </div>

        {/* GitHub link */}
        <p className="text-[#a2a2a2] text-[12px] mb-8">
          Want to browse the data first?{" "}
          <a
            href="https://github.com/rubenhassid1/howtoai-starter-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6719] hover:text-[#e55a14] transition-colors"
          >
            Clone the starter repo on GitHub &rarr;
          </a>
        </p>

        {/* Divider */}
        <div className="h-px bg-[#252525] mb-6" />

        {/* Email form */}
        <div className="mb-8">
          <label
            htmlFor="email"
            className="block text-[13px] font-medium text-[#ccc] mb-2"
          >
            Your How to AI subscriber email
          </label>

          {success ? (
            <div className="rounded-lg bg-[#FF6719]/8 border border-[#FF6719]/20 px-4 py-3 text-center">
              <p className="text-[#FF6719] font-semibold text-[13px]">
                Check your email!
              </p>
              <p className="text-[#a2a2a2] text-[11px] mt-0.5">
                Download link sent to <span className="text-[#ccc]">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit();
                  }}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="flex-1 rounded-lg border border-[#252525] bg-[#1e1e1e] px-3.5 py-2.5 text-white text-[13px] placeholder:text-[#555] focus:outline-none focus:border-[#FF6719] focus:ring-1 focus:ring-[#FF6719]/50 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !email.trim()}
                  className="rounded-lg bg-[#FF6719] hover:bg-[#e55a14] text-white font-semibold px-5 py-2.5 text-[13px] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Get access"
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-1.5 text-red-400 text-[11px]">{error}</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#252525] flex items-center justify-between">
          <p className="text-[#555] text-[11px]">
            A{" "}
            <a
              href="https://ruben.substack.com"
              className="text-[#777] hover:text-[#FF6719] transition-colors"
            >
              How to AI
            </a>{" "}
            project by Ruben Hassid
          </p>
          <p className="text-[#555] text-[11px]">
            400K+ subscribers
          </p>
        </div>
      </main>
    </div>
  );
}
