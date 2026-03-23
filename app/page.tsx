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
    <div className="flex flex-col flex-1 items-center justify-center bg-[#111111]">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center py-24 px-6 sm:px-12">
        {/* Logo / Icon */}
        <div className="mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="64" height="64" rx="14" fill="#FF6719" />
            <text
              x="32"
              y="44"
              textAnchor="middle"
              fill="white"
              fontSize="28"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
            >
              AI
            </text>
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-16 text-center">
          How to AI Data
        </h1>

        {/* Subtitle */}
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
          Download the data
        </h2>
        <p className="text-[#999] text-base sm:text-lg mb-12 text-center max-w-md">
          Enter your subscriber email and we&apos;ll send a sign-in link to
          download the data.
        </p>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-12">
          {/* Free tier */}
          <div className="rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#999] mb-3">
              Free subscribers get:
            </h3>
            <p className="text-[#ccc] text-sm leading-relaxed">
              Starter pack data ZIP with <strong className="text-white">10 newsletter posts</strong> and{" "}
              <strong className="text-white">sample AI workflows</strong>, plus starter MCP
              access.
            </p>
          </div>

          {/* Paid tier */}
          <div className="rounded-xl border border-[#FF6719]/30 bg-[#1a1a1a] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FF6719] text-black text-[10px] font-bold uppercase px-2 py-0.5 rounded-bl-lg">
              Paid
            </div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FF6719] mb-3">
              Paid subscribers get:
            </h3>
            <p className="text-[#ccc] text-sm leading-relaxed">
              Full archive ZIP with{" "}
              <strong className="text-white">all 72 newsletter posts</strong> and{" "}
              <strong className="text-white">every AI workflow</strong>, plus
              full MCP access, automatic updates, and a private GitHub repo.
            </p>
          </div>
        </div>

        {/* Browse link */}
        <p className="text-[#999] text-sm mb-8 text-center">
          Want to browse the free sample first?{" "}
          <a
            href="https://github.com/rubenhassid1/howtoai-starter-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6719] hover:text-[#e55a14] underline underline-offset-2 transition-colors"
          >
            Clone the public starter repo on GitHub
          </a>
        </p>

        {/* Email form */}
        <div className="w-full max-w-md">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#ccc] mb-2"
          >
            Your How to AI subscriber email:
          </label>

          {success ? (
            <div className="rounded-lg border border-[#FF6719]/30 bg-[#FF6719]/5 px-4 py-4 text-center">
              <p className="text-[#FF6719] font-semibold text-sm mb-1">
                Check your email!
              </p>
              <p className="text-[#999] text-xs">
                We sent a download link to <span className="text-[#ccc]">{email}</span>
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-3">
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
                  className="flex-1 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#FF6719] focus:ring-1 focus:ring-[#FF6719] transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !email.trim()}
                  className="rounded-lg bg-[#FF6719] hover:bg-[#e55a14] text-black font-semibold px-6 py-3 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Get access"
                  )}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-red-400 text-xs">{error}</p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-[#2a2a2a] w-full text-center">
          <p className="text-[#555] text-xs">
            A{" "}
            <a
              href="https://ruben.substack.com"
              className="text-[#777] hover:text-[#FF6719] transition-colors"
            >
              How to AI
            </a>{" "}
            project by Ruben Hassid
          </p>
        </div>
      </main>
    </div>
  );
}
