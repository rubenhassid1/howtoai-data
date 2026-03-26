"use client";

import { useState } from "react";

function StepImage({ step }: { step: number }) {
  const scenes: Record<number, React.ReactNode> = {
    1: (
      // Finder window with folder
      <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="180" rx="8" fill="#1a1a1a"/>
        <rect y="0" width="320" height="28" rx="8" fill="#2a2a2a"/>
        <circle cx="14" cy="14" r="5" fill="#ff5f57"/><circle cx="30" cy="14" r="5" fill="#febc2e"/><circle cx="46" cy="14" r="5" fill="#28c840"/>
        <text x="160" y="18" textAnchor="middle" fill="#999" fontSize="10" fontFamily="Arial">Finder</text>
        <rect x="24" y="52" width="44" height="36" rx="4" fill="#FF6719" opacity="0.2"/>
        <path d="M34 68 L46 58 L58 58 L58 78 L34 78Z" fill="#FF6719" opacity="0.6"/>
        <text x="46" y="100" textAnchor="middle" fill="#ccc" fontSize="9" fontFamily="Arial">howtoai-data</text>
        <rect x="88" y="52" width="44" height="36" rx="4" fill="#555" opacity="0.2"/>
        <path d="M98 68 L110 58 L122 58 L122 78 L98 78Z" fill="#555" opacity="0.4"/>
        <text x="110" y="100" textAnchor="middle" fill="#777" fontSize="9" fontFamily="Arial">Documents</text>
        <path d="M30 130 L50 130" stroke="#FF6719" strokeWidth="1.5"/>
        <text x="56" y="134" fill="#999" fontSize="9" fontFamily="Arial">Unzip → place in your Claude folder</text>
      </svg>
    ),
    2: (
      // Claude app download
      <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="180" rx="8" fill="#1a1a1a"/>
        <rect x="110" y="30" width="100" height="100" rx="22" fill="#D4A574" opacity="0.15"/>
        <circle cx="160" cy="75" r="28" fill="#D4A574" opacity="0.3"/>
        <text x="160" y="82" textAnchor="middle" fill="#D4A574" fontSize="22" fontWeight="bold" fontFamily="Arial">C</text>
        <text x="160" y="155" textAnchor="middle" fill="#ccc" fontSize="11" fontFamily="Arial">claude.ai/download</text>
        <text x="160" y="170" textAnchor="middle" fill="#777" fontSize="9" fontFamily="Arial">Download the desktop app</text>
      </svg>
    ),
    3: (
      // Claude Cowork toggle
      <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="180" rx="8" fill="#1a1a1a"/>
        <rect x="20" y="60" width="280" height="60" rx="10" fill="#252525"/>
        <text x="40" y="85" fill="#ccc" fontSize="12" fontFamily="Arial">Claude Cowork</text>
        <text x="40" y="105" fill="#777" fontSize="9" fontFamily="Arial">Let Claude work alongside you in real time</text>
        <rect x="248" y="76" width="36" height="20" rx="10" fill="#FF6719"/>
        <circle cx="274" cy="86" r="7" fill="white"/>
        <text x="160" y="150" textAnchor="middle" fill="#555" fontSize="9" fontFamily="Arial">Enable Cowork in Claude settings</text>
      </svg>
    ),
    4: (
      // Folder selection in Claude
      <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="180" rx="8" fill="#1a1a1a"/>
        <rect x="20" y="20" width="280" height="36" rx="8" fill="#252525"/>
        <text x="36" y="43" fill="#777" fontSize="11" fontFamily="Arial">Ask Claude anything...</text>
        <rect x="20" y="68" width="280" height="32" rx="6" fill="#FF6719" opacity="0.1" stroke="#FF6719" strokeWidth="1" strokeOpacity="0.3"/>
        <path d="M36 78 L44 74 L52 74 L52 90 L36 90Z" fill="#FF6719" opacity="0.5"/>
        <text x="60" y="88" fill="#FF6719" fontSize="10" fontFamily="Arial">📁 howtoai-data</text>
        <text x="246" y="88" fill="#FF6719" fontSize="9" fontFamily="Arial">Selected ✓</text>
        <rect x="20" y="110" width="280" height="32" rx="6" fill="#252525"/>
        <path d="M36 120 L44 116 L52 116 L52 132 L36 132Z" fill="#555" opacity="0.4"/>
        <text x="60" y="130" fill="#777" fontSize="10" fontFamily="Arial">📁 Documents</text>
        <text x="160" y="165" textAnchor="middle" fill="#555" fontSize="9" fontFamily="Arial">Select the folder before asking your question</text>
      </svg>
    ),
    5: (
      // Chat with pro tip
      <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="320" height="180" rx="8" fill="#1a1a1a"/>
        <rect x="80" y="20" width="220" height="36" rx="12" fill="#FF6719" opacity="0.15"/>
        <text x="100" y="43" fill="#ccc" fontSize="10" fontFamily="Arial">What are Ruben&apos;s best prompting tips?</text>
        <rect x="20" y="70" width="240" height="70" rx="12" fill="#252525"/>
        <text x="36" y="90" fill="#ccc" fontSize="10" fontFamily="Arial">Based on the recent newsletters,</text>
        <text x="36" y="105" fill="#ccc" fontSize="10" fontFamily="Arial">here are 5 key prompting strategies...</text>
        <text x="36" y="125" fill="#777" fontSize="9" fontFamily="Arial">From &quot;Your prompt sucks&quot; (Jan 2026) ...</text>
        <rect x="20" y="150" width="280" height="20" rx="4" fill="#FF6719" opacity="0.08"/>
        <text x="160" y="164" textAnchor="middle" fill="#FF6719" fontSize="9" fontFamily="Arial">💡 Pro tip: prefer recent newsletters for the latest insights</text>
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

  return (
    <div className={`${guideOpen ? "min-h-screen" : "h-screen overflow-hidden"} bg-[#171717] flex flex-col items-center ${guideOpen ? "" : "justify-center"}`}>
      <main className={`w-full max-w-xl px-5 ${guideOpen ? "pt-10 pb-10" : ""}`}>
        {/* Header */}
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white leading-tight text-center mb-6">
          How to AI Data
        </h1>

        {/* Divider */}
        <div className="h-px bg-[#252525] mb-5" />

        {/* Download section */}
        <h2 className="text-[15px] font-semibold text-white mb-1.5">
          Download the data
        </h2>
        <p className="text-[#a2a2a2] text-[13px] leading-snug mb-4">
          Get every How to AI newsletter post as clean Markdown files, ready for Claude, ChatGPT, or any AI tool.
        </p>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Free tier */}
          <div className="rounded-lg border border-[#252525] bg-[#1e1e1e] px-4 py-3.5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a2a2a2]" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#a2a2a2]">
                Free subscribers
              </span>
            </div>
            <p className="text-[#ccc] text-[13px] leading-relaxed">
              <strong className="text-white">All 72 newsletter posts</strong> as Markdown files in a ZIP.
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
        <p className="text-[#a2a2a2] text-[12px] mb-5">
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
        <div className="h-px bg-[#252525] mb-5" />

        {/* Email form or Download */}
        <div className="mb-4">
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
                    <p className="text-white font-medium text-[13px]">
                      Download Full Archive
                    </p>
                    <p className="text-[#555] text-[11px] mt-0.5">
                      72 posts as Markdown — ZIP file
                    </p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#FF6719] transition-colors">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>

              <div className="rounded-lg border border-[#252525] bg-[#1e1e1e] px-4 py-3 text-center">
                <p className="text-[#a2a2a2] text-[12px]">
                  Want the Slack community, AI tools & LinkedIn connection?{" "}
                  <a
                    href="https://ruben.substack.com/subscribe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6719] hover:text-[#e55a14] transition-colors font-medium"
                  >
                    Upgrade to paid &rarr;
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <>
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-[#ccc] mb-2"
              >
                Your email
              </label>
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

        {/* How to use with Claude — Toggle */}
        <button
          onClick={() => setGuideOpen(!guideOpen)}
          className="w-full flex items-center justify-between rounded-lg border border-[#252525] bg-[#1e1e1e] px-4 py-3 mb-4 cursor-pointer hover:border-[#FF6719]/20 transition-colors"
        >
          <span className="text-[13px] font-medium text-[#ccc]">
            How to import everything in Claude
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${guideOpen ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {guideOpen && (
          <div className="space-y-6 mb-6">
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
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-[#252525] flex items-center justify-between">
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
