
import ReactMarkdown from "react-markdown";
import { useState, useContext, useRef, useEffect } from "react";
import axios from "../../utils/axios";
import { AuthContext } from "../../utils/AuthContext";

/* ── helpers ── */
const scoreColor = (s) => {
    if (s >= 75) return { text: "#34d399", glow: "rgba(52,211,153,0.35)", bg: "rgba(52,211,153,0.08)",   border: "rgba(52,211,153,0.25)",  label: "Strong Match" };
    if (s >= 50) return { text: "#fbbf24", glow: "rgba(251,191,36,0.35)", bg: "rgba(251,191,36,0.08)",   border: "rgba(251,191,36,0.25)",  label: "Partial Match" };
    return         { text: "#f87171", glow: "rgba(248,113,113,0.35)",     bg: "rgba(248,113,113,0.08)",  border: "rgba(248,113,113,0.25)", label: "Weak Match" };
};

const parseSections = (markdown = "") => {
    const sections = { strength: [], weakness: [], improvement: [], other: [] };
    let current = "other";
    markdown.split("\n").forEach((line) => {
        const low = line.toLowerCase();
        if (low.includes("strength"))                          current = "strength";
        else if (low.includes("weakness"))                     current = "weakness";
        else if (low.includes("improvement") || low.includes("area")) current = "improvement";
        sections[current].push(line);
    });
    return sections;
};

const useCountUp = (target, duration = 1400) => {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
            start = Math.min(start + step, target);
            setVal(start);
            if (start >= target) clearInterval(timer);
        }, 16);
        return () => clearInterval(timer);
    }, [target]);
    return val;
};

const SECTIONS = [
    {
        key: "strength",
        label: "Strengths",
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
        accent: "#34d399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.18)",
    },
    {
        key: "weakness",
        label: "Weaknesses",
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
        accent: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.18)",
    },
    {
        key: "improvement",
        label: "Areas of Improvement",
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
        accent: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.18)",
    },
    {
        key: "other",
        label: "Additional Notes",
        icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
        accent: "#818cf8", bg: "rgba(129,140,248,0.06)", border: "rgba(129,140,248,0.18)",
    },
];

/* ── Score Ring ── */
const ScoreRing = ({ score }) => {
    const c = scoreColor(score);
    const displayed = useCountUp(score);
    const r = 52, circ = 2 * Math.PI * r;
    const dash = (displayed / 100) * circ;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center" style={{ width: 136, height: 136 }}>
                <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 36px ${c.glow}` }} />
                <svg width="136" height="136" viewBox="0 0 136 136">
                    <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                    <circle
                        cx="68" cy="68" r={r} fill="none"
                        stroke={c.text} strokeWidth="9" strokeLinecap="round"
                        strokeDasharray={`${dash} ${circ}`}
                        transform="rotate(-90 68 68)"
                        style={{ filter: `drop-shadow(0 0 5px ${c.text})`, transition: "stroke-dasharray 0.05s linear" }}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-[38px] font-bold leading-none" style={{ color: c.text, letterSpacing: "-0.04em" }}>{displayed}</span>
                    <span className="text-sm font-semibold" style={{ color: c.text, opacity: 0.7 }}>%</span>
                </div>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>
                {c.label}
            </span>
        </div>
    );
};

/* ── Skeleton ── */
const SkeletonLoader = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-2.5 rounded-full mb-4" style={{ width: "35%", background: "rgba(255,255,255,0.07)" }} />
                <div className="space-y-2.5">
                    {[90, 75, 60].map((w, j) => (
                        <div key={j} className="h-2 rounded-full" style={{ width: `${w}%`, background: "rgba(255,255,255,0.04)" }} />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

/* ═══════════════════════════════════════════════════════ */
const Dashboard = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc,    setJobDesc]    = useState("");
    const [result,     setResult]     = useState(null);
    const [loading,    setLoading]    = useState(false);
    const [dragOver,   setDragOver]   = useState(false);

    const { userInfo } = useContext(AuthContext);
    const resultRef    = useRef(null);

    const handleUpload = async () => {
        if (!jobDesc || !resumeFile) {
            alert("Please upload a resume and paste a job description.");
            return;
        }
        const formData = new FormData();
        formData.append("resume",   resumeFile);
        formData.append("job_desc", jobDesc);
        formData.append("user",     userInfo._id);

        setLoading(true);
        setResult(null);
        try {
            const res = await axios.post("/api/resume/addResume", formData);
            setResult(res.data.data);
            setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const sections = result ? parseSections(result.feedback) : null;

    return (
        /* ↓ This outer div forces the dark background across the entire content area */
        <div className="min-h-screen w-full" style={{ background: "#0a0a13" }}>

            {/* Ambient blobs */}
            <div className="fixed top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)", filter: "blur(70px)" }} />
            <div className="fixed bottom-[-80px] left-[20%] w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)", filter: "blur(70px)" }} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-8">

                {/* ── Header ── */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#a78bfa,#818cf8)" }} />
                        <p className="text-white/30 font-medium tracking-widest uppercase" style={{ fontSize: "10px" }}>AI Powered</p>
                    </div>
                    <h1 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>
                        Resume Match Score
                    </h1>
                    <p className="text-white/35 text-sm">Upload your resume and analyze how well it matches a job description.</p>
                </div>

                {/* ── Upload Card ── */}
                <div className="rounded-3xl p-7 space-y-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.18)" }}>

                    {/* Drop zone */}
                    <div className="space-y-2">
                        <label className="text-white/40 font-medium tracking-widest uppercase" style={{ fontSize: "10px" }}>Resume (PDF only)</label>
                        <div
                            className="relative rounded-2xl flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-all duration-200"
                            style={{
                                border: `2px dashed ${dragOver ? "rgba(139,92,246,0.6)" : "rgba(255,255,255,0.09)"}`,
                                background: dragOver ? "rgba(139,92,246,0.07)" : "rgba(255,255,255,0.02)",
                            }}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={(e) => {
                                e.preventDefault(); setDragOver(false);
                                const f = e.dataTransfer.files[0];
                                if (f?.type === "application/pdf") setResumeFile(f);
                            }}
                            onClick={() => document.getElementById("resumeInput").click()}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.22)" }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </div>
                            {resumeFile ? (
                                <div className="text-center">
                                    <p className="text-sm font-medium" style={{ color: "#a78bfa" }}>{resumeFile.name}</p>
                                    <p className="text-white/25 text-xs mt-0.5">Click to change file</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-white/40">Drop your PDF here or <span style={{ color: "#a78bfa" }}>browse</span></p>
                                    <p className="text-white/20 text-xs mt-0.5">PDF files only</p>
                                </div>
                            )}
                            <input id="resumeInput" type="file" accept=".pdf" className="hidden" onChange={(e) => setResumeFile(e.target.files[0])} />
                        </div>
                    </div>

                    {/* Job description */}
                    <div className="space-y-2">
                        <label className="text-white/40 font-medium tracking-widest uppercase" style={{ fontSize: "10px" }}>Job Description</label>
                        <textarea
                            rows={7}
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            placeholder="Paste the complete job description here..."
                            className="w-full rounded-2xl px-5 py-4 text-sm resize-none placeholder-white/20 transition-all duration-200"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.8)",
                                outline: "none",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "rgba(139,92,246,0.5)";
                                e.target.style.boxShadow   = "0 0 0 3px rgba(139,92,246,0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                                e.target.style.boxShadow   = "none";
                            }}
                        />
                    </div>

                    {/* Analyze button */}
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl font-semibold text-base text-white flex items-center justify-center gap-3 transition-all duration-200"
                        style={{
                            background: loading ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                            boxShadow:  loading ? "none" : "0 4px 24px rgba(124,58,237,0.35)",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 6px 32px rgba(124,58,237,0.5)"; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.35)"; }}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                                </svg>
                                Analyzing Resume…
                            </>
                        ) : (
                            <>
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                Analyze Resume
                            </>
                        )}
                    </button>
                </div>

                {/* ── Skeleton loader ── */}
                {loading && (
                    <div className="rounded-3xl p-7 space-y-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-2.5">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#a78bfa" }} />
                            <p className="text-white/30 text-sm">AI is analyzing your resume…</p>
                        </div>
                        <SkeletonLoader />
                    </div>
                )}

                {/* ── Result ── */}
                {result && !loading && (
                    <div ref={resultRef} className="space-y-5">

                        {/* Score banner */}
                        <div
                            className="rounded-3xl p-7 flex flex-col sm:flex-row items-center justify-between gap-8"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(139,92,246,0.2)" }}
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#a78bfa,#818cf8)" }} />
                                    <p className="text-white/30 font-medium tracking-widest uppercase" style={{ fontSize: "10px" }}>Analysis Result</p>
                                </div>
                                <h2 className="text-2xl font-bold text-white" style={{ letterSpacing: "-0.02em" }}>Match Overview</h2>
                                <p className="text-white/30 text-sm">Based on your resume vs the job description</p>
                            </div>
                            <ScoreRing score={result.score} />
                        </div>

                        {/* Section cards */}
                        {SECTIONS.map(({ key, label, icon, accent, bg, border }) => {
                            const lines = sections[key]?.filter((l) => l.trim());
                            if (!lines?.length) return null;
                            return (
                                <div key={key} className="rounded-3xl p-7 space-y-4" style={{ background: bg, border: `1px solid ${border}` }}>
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                             style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}28` }}>
                                            {icon}
                                        </div>
                                        <h3 className="font-semibold text-sm tracking-wide" style={{ color: accent }}>{label}</h3>
                                    </div>
                                    <div className="text-white/60 text-sm leading-relaxed pl-1">
                                        <ReactMarkdown
                                            components={{
                                                p:      ({ children }) => <p className="mb-2">{children}</p>,
                                                strong: ({ children }) => <strong className="font-semibold" style={{ color: accent }}>{children}</strong>,
                                                li:     ({ children }) => (
                                                    <li className="flex items-start gap-2 mb-1.5">
                                                        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accent }} />
                                                        <span>{children}</span>
                                                    </li>
                                                ),
                                                ul: ({ children }) => <ul className="space-y-0.5 mt-1">{children}</ul>,
                                            }}
                                        >
                                            {lines.join("\n")}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;