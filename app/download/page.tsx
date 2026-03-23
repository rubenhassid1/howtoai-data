"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface DownloadData {
  email: string;
  tier: string;
  downloads: Record<string, string>;
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DownloadData | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No access token provided.");
      setLoading(false);
      return;
    }

    fetch(`/api/download?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || "Invalid token");
        }
        return res.json();
      })
      .then((d: DownloadData) => {
        setData(d);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#FF6719] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#999] text-sm">Verifying your access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF6719" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Access denied</h1>
        <p className="text-[#999] text-sm mb-8 max-w-sm">
          {error === "Invalid or expired token"
            ? "This link has expired or is invalid. Please request a new one."
            : error}
        </p>
        <a
          href="/"
          className="rounded-lg bg-[#FF6719] hover:bg-[#e55a14] text-black font-semibold px-6 py-3 text-sm transition-colors"
        >
          Request a new link
        </a>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col items-center py-24 px-6 sm:px-12 max-w-2xl mx-auto w-full">
      {/* Logo */}
      <div className="mb-6">
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="64" height="64" rx="14" fill="#FF6719" />
          <text x="32" y="44" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial, sans-serif">AI</text>
        </svg>
      </div>

      {/* Welcome */}
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
        Welcome back!
      </h1>
      <p className="text-[#999] text-sm mb-10">
        Signed in as <span className="text-[#ccc]">{data.email}</span>
      </p>

      {/* Tier badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-1.5 mb-8">
        <span className="w-2 h-2 rounded-full bg-[#FF6719]" />
        <span className="text-[#ccc] text-xs font-medium uppercase tracking-wider">
          {data.tier} tier
        </span>
      </div>

      {/* Download cards */}
      <div className="w-full space-y-4">
        {Object.entries(data.downloads).map(([name, url]) => (
          <a
            key={name}
            href={url}
            download
            className="flex items-center justify-between w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#FF6719]/40 p-5 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF6719]/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6719" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">
                  {name === "starter"
                    ? "Starter Pack"
                    : name === "full-archive"
                      ? "Full Archive"
                      : name}
                </p>
                <p className="text-[#666] text-xs mt-0.5">
                  {name === "starter"
                    ? "10 recent posts + sample workflows"
                    : name === "full-archive"
                      ? "All 72 posts + every workflow"
                      : "ZIP archive"}
                </p>
              </div>
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:stroke-[#FF6719] transition-colors"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-[#555] text-xs mt-12 text-center">
        Download links are tied to your email. Need help?{" "}
        <a href="mailto:ruben@howtoai.com" className="text-[#777] hover:text-[#FF6719] transition-colors">
          Contact us
        </a>
      </p>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-[#111111] min-h-screen">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-[#FF6719] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[#999] text-sm">Loading...</p>
          </div>
        }
      >
        <DownloadContent />
      </Suspense>
    </div>
  );
}
