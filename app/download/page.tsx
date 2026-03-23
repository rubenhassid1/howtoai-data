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
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-[#FF6719] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-[#a2a2a2] text-[13px]">Verifying access...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-5 text-center">
        <div className="w-12 h-12 rounded-full bg-[#1e1e1e] border border-[#252525] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6719" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Access denied</h1>
        <p className="text-[#a2a2a2] text-[13px] mb-6 max-w-sm">
          {error === "Invalid or expired token"
            ? "This link has expired or is invalid. Request a new one."
            : error}
        </p>
        <a
          href="/"
          className="rounded-lg bg-[#FF6719] hover:bg-[#e55a14] text-white font-semibold px-5 py-2.5 text-[13px] transition-colors"
        >
          Request a new link
        </a>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col items-center pt-14 pb-10 px-5 max-w-xl mx-auto w-full">
      {/* Logo */}
      <div className="w-10 h-10 rounded-xl bg-[#FF6719] flex items-center justify-center mb-4">
        <span className="text-white text-sm font-bold leading-none" style={{ fontFamily: "Arial, sans-serif" }}>
          AI
        </span>
      </div>

      {/* Welcome */}
      <h1 className="text-[24px] font-bold tracking-tight text-white mb-1">
        Welcome back!
      </h1>
      <p className="text-[#a2a2a2] text-[12px] mb-6">
        Signed in as <span className="text-[#ccc]">{data.email}</span>
      </p>

      {/* Tier badge */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#252525] bg-[#1e1e1e] px-3 py-1 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6719]" />
        <span className="text-[#ccc] text-[10px] font-semibold uppercase tracking-wider">
          {data.tier} tier
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#252525] w-full mb-5" />

      {/* Download cards */}
      <div className="w-full space-y-2.5">
        {Object.entries(data.downloads).map(([name, url]) => (
          <a
            key={name}
            href={url}
            download
            className="flex items-center justify-between w-full rounded-lg border border-[#252525] bg-[#1e1e1e] hover:border-[#FF6719]/30 p-4 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF6719]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6719" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium text-[13px]">
                  {name === "starter"
                    ? "Starter Pack"
                    : name === "full-archive"
                      ? "Full Archive"
                      : name}
                </p>
                <p className="text-[#555] text-[11px] mt-0.5">
                  {name === "starter"
                    ? "10 recent posts + sample workflows"
                    : name === "full-archive"
                      ? "All 72 posts + every workflow"
                      : "ZIP archive"}
                </p>
              </div>
            </div>
            <svg
              width="16"
              height="16"
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

      {/* Footer */}
      <p className="text-[#555] text-[11px] mt-8">
        Need help?{" "}
        <a href="mailto:ruben@howtoai.com" className="text-[#777] hover:text-[#FF6719] transition-colors">
          Contact us
        </a>
      </p>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#171717]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#FF6719] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-[#a2a2a2] text-[13px]">Loading...</p>
          </div>
        }
      >
        <DownloadContent />
      </Suspense>
    </div>
  );
}
