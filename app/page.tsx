"use client";

import { useState } from "react";

function StepImage({ step }: { step: number }) {
  const scenes: Record<number, React.ReactNode> = {
    1: (
      <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="160" rx="8" fill="#1a1a1a"/>
        <rect y="0" width="320" height="24" rx="8" fill="#2a2a2a"/>
        <circle cx="14" cy="12" r="4" fill="#ff5f57"/><circle cx="28" cy="12" r="4" fill="#febc2e"/><circle cx="42" cy="12" r="4" fill="#28c840"/>
        <rect x="24" y="44" width="40" height="32" rx="4" fill="#FF6719" opacity="0.2"/>
        <path d="M34 60 L44 52 L54 52 L54 68 L34 68Z" fill="#FF6719" opacity="0.6"/>
        <text x="44" y="88" textAnchor="middle" fill="#ccc" fontSize="8" fontFamily="Arial">howtoai-data</text>
        <text x="56" y="120" fill="#999" fontSize="8" fontFamily="Arial">Unzip → place in your Claude folder</text>
      </svg>
    ),
    2: (
      <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="160" rx="8" fill="#1a1a1a"/>
        <rect x="110" y="20" width="100" height="90" rx="20" fill="#D4A574" opacity="0.15"/>
        <circle cx="160" cy="60" r="24" fill="#D4A574" opacity="0.3"/>
        <text x="160" y="67" textAnchor="middle" fill="#D4A574" fontSize="20" fontWeight="bold" fontFamily="Arial">C</text>
        <text x="160" y="135" textAnchor="middle" fill="#ccc" fontSize="10" fontFamily="Arial">claude.ai/download</text>
      </svg>
    ),
    3: (
      <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="160" rx="8" fill="#1a1a1a"/>
        <rect x="20" y="50" width="280" height="50" rx="10" fill="#252525"/>
        <text x="40" y="72" fill="#ccc" fontSize="11" fontFamily="Arial">Claude Cowork</text>
        <text x="40" y="90" fill="#777" fontSize="8" fontFamily="Arial">Let Claude work alongside you in real time</text>
        <rect x="248" y="66" width="32" height="18" rx="9" fill="#FF6719"/>
        <circle cx="271" cy="75" r="6" fill="white"/>
        <text x="160" y="130" textAnchor="middle" fill="#555" fontSize="8" fontFamily="Arial">Enable Cowork in Claude settings</text>
      </svg>
    ),
    4: (
      <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="160" rx="8" fill="#1a1a1a"/>
        <rect x="20" y="20" width="280" height="30" rx="6" fill="#252525"/>
        <text x="36" y="39" fill="#777" fontSize="10" fontFamily="Arial">Ask Claude anything...</text>
        <rect x="20" y="60" width="280" height="28" rx="6" fill="#FF6719" opacity="0.1" stroke="#FF6719" strokeWidth="1" strokeOpacity="0.3"/>
        <text x="40" y="78" fill="#FF6719" fontSize="9" fontFamily="Arial">📁 howtoai-data — Selected ✓</text>
        <rect x="20" y="98" width="280" height="28" rx="6" fill="#252525"/>
        <text x="40" y="116" fill="#777" fontSize="9" fontFamily="Arial">📁 Documents</text>
      </svg>
    ),
    5: (
      <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="160" rx="8" fill="#1a1a1a"/>
        <rect x="80" y="16" width="220" height="30" rx="10" fill="#FF6719" opacity="0.15"/>
        <text x="100" y="35" fill="#ccc" fontSize="9" fontFamily="Arial">What are the best prompting tips?</text>
        <rect x="20" y="56" width="240" height="56" rx="10" fill="#252525"/>
        <text x="36" y="74" fill="#ccc" fontSize="9" fontFamily="Arial">Based on the recent newsletters,</text>
        <text x="36" y="88" fill="#ccc" fontSize="9" fontFamily="Arial">here are 5 key prompting strategies...</text>
        <text x="36" y="102" fill="#777" fontSize="8" fontFamily="Arial">From &quot;Your prompt sucks&quot; (Jan 2026)</text>
        <rect x="20" y="122" width="280" height="22" rx="4" fill="#FF6719" opacity="0.08"/>
        <text x="160" y="137" textAnchor="middle" fill="#FF6719" fontSize="8" fontFamily="Arial">💡 Pro tip: prefer recent newsletters for the latest insights</text>
      </svg>
    ),
  };
  return <>{scenes[step]}</>;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  function handleSubmit() {
    if (!email.trim()) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    }).finally(() => {
      setLoading(false);
      setShowDownload(true);
    });
  }

  const steps = [
    { num: 1, title: "Unzip & add to your Claude folder", desc: "Open the ZIP file and place the folder somewhere easy to find." },
    { num: 2, title: "Download the Claude app", desc: "Get the desktop app from claude.ai/download if you don't have it." },
    { num: 3, title: "Use Claude Cowork", desc: "Enable Cowork mode — it lets Claude work with your local files." },
    { num: 4, title: "Select the folder before asking", desc: "Point Claude to the howtoai-data folder so it can read your posts." },
    { num: 5, title: "Ask anything", desc: "Ask Claude about AI workflows, prompting tips, tools — anything from the newsletters. Pro tip: prefer recent newsletters for the freshest insights." },
  ];

  const exampleQA = [
    { q: "What's the best AI for search?", a: "Grok 4.20. It beat Perplexity in a 63-query benchmark across 7 AI tools. — from \"Search.\" (Mar 2026)" },
    { q: "How do I set up Claude?", a: "1. Download Claude desktop app. 2. Enable Cowork. 3. Create a Project with your context. 4. Turn on Extended Thinking. — from \"Claude.\" (Feb 2026)" },
    { q: "What are the 7 deadly sins of prompting?", a: "Vagueness, no context, too long, no role, no format, no examples, no iteration. — from \"Sins.\" (Aug 2025)" },
  ];

  return (
    <div className={`${guideOpen ? "min-h-screen" : "h-screen overflow-hidden"} bg-[#171717] flex flex-col items-center ${guideOpen ? "" : "justify-center"}`}>
      <main className={`w-full max-w-xl px-5 ${guideOpen ? "pt-10 pb-10" : ""}`}>
        {/* Header */}
        <h1 className="text-[26px] sm:text-[30px] font-bold tracking-tight text-white leading-tight text-center mb-3">
          You read my newsletters.<br />Now let Claude read them too.
        </h1>
        <p className="text-[#a2a2a2] text-[13px] text-center leading-snug mb-6">
          That tip I shared 3 months ago? The prompt template from last week?<br className="hidden sm:inline" />
          Stop digging through your inbox. Download everything, give it to Claude, and just ask.
        </p>

        {/* Email form or Download — THE main action */}
        <div className="mb-5">
          {showDownload ? (
            <div className="space-y-3">
              <a
                href="/howtoai-full-archive.zip"
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
                    <p className="text-white font-medium text-[13px]">Download Full Archive</p>
                    <p className="text-[#555] text-[11px] mt-0.5">Every post as Markdown — ZIP file</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6719] transition-colors">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>
              <div className="rounded-lg border border-[#252525] bg-[#1e1e1e] px-4 py-3 text-center">
                <p className="text-[#a2a2a2] text-[12px]">
                  Want the Slack community, AI tools & LinkedIn connection?{" "}
                  <a href="https://ruben.substack.com/subscribe" target="_blank" rel="noopener noreferrer" className="text-[#FF6719] hover:text-[#e55a14] transition-colors font-medium">
                    Join the paid community &rarr;
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
                  placeholder="Your email"
                  disabled={loading}
                  className="flex-1 rounded-lg border border-[#252525] bg-[#1e1e1e] px-3.5 py-2.5 text-white text-[13px] placeholder:text-[#555] focus:outline-none focus:border-[#FF6719] focus:ring-1 focus:ring-[#FF6719]/50 transition-colors disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !email.trim()}
                  className="rounded-lg bg-[#FF6719] hover:bg-[#e55a14] text-white font-semibold px-5 py-2.5 text-[13px] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Download \u2192"
                  )}
                </button>
              </div>
              {error && <p className="mt-1.5 text-red-400 text-[11px]">{error}</p>}
            </>
          )}
        </div>

        <div className="h-px bg-[#252525] mb-4" />

        {/* How to use with Claude — PROMINENT */}
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full rounded-lg border border-[#FF6719]/30 bg-[#FF6719]/5 hover:bg-[#FF6719]/10 px-4 py-3.5 mb-3 cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF6719]/15 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6719" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white text-[13px] font-semibold">How to use it with Claude</p>
                <p className="text-[#a2a2a2] text-[11px]">5 steps to import everything — with examples</p>
              </div>
            </div>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF6719"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform ${guideOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </button>

        {guideOpen && (
          <div className="mb-4">
            <div className="space-y-5 mb-6">
              {steps.map((step) => (
                <div key={step.num}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#FF6719] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-bold">{step.num}</span>
                    </div>
                    <div>
                      <p className="text-white text-[13px] font-medium">{step.title}</p>
                      <p className="text-[#777] text-[11px] mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                  <div className="ml-8 rounded-lg overflow-hidden border border-[#252525]">
                    <StepImage step={step.num} />
                  </div>
                </div>
              ))}
            </div>

            {/* Example Q&A */}
            <div className="rounded-lg border border-[#FF6719]/20 bg-[#FF6719]/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#FF6719] mb-3">
                Example answers from your data
              </p>
              <div className="space-y-3">
                {exampleQA.map((item, i) => (
                  <div key={i} className="rounded-lg bg-[#171717] border border-[#252525] p-3">
                    <p className="text-[#FF6719] text-[11px] font-medium mb-1.5">&ldquo;{item.q}&rdquo;</p>
                    <p className="text-[#ccc] text-[11px] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-[#252525] flex items-center justify-between">
          <p className="text-[#555] text-[11px]">
            A{" "}
            <a href="https://ruben.substack.com" className="text-[#777] hover:text-[#FF6719] transition-colors">How to AI</a>{" "}
            project by Ruben Hassid
          </p>
          <a
            href="https://github.com/rubenhassid1/howtoai-starter-data"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#555] hover:text-[#FF6719] text-[11px] transition-colors"
          >
            GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
