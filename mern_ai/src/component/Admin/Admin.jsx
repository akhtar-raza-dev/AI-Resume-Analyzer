
import ReactMarkdown from "react-markdown";
import WithAuthHOC from "../../utils/HOC/withAuthHOC";
import { useState, useEffect } from "react";
import axios from "../../utils/axios";

/* ── helpers ── */
const scoreConfig = (s) => {
    if (s >= 75) return { text: "#34d399", bg: "rgba(52,211,153,0.08)",  border: "rgba(52,211,153,0.22)",  label: "Strong"  };
    if (s >= 50) return { text: "#fbbf24", bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.22)",  label: "Partial" };
    return         { text: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)", label: "Weak"    };
};

const parseSections = (markdown = "") => {
    const sections = { strength: [], weakness: [], improvement: [], other: [] };
    let current = "other";
    markdown.split("\n").forEach((line) => {
        const low = line.toLowerCase();
        if (low.includes("strength"))                                  current = "strength";
        else if (low.includes("weakness"))                             current = "weakness";
        else if (low.includes("improvement") || low.includes("area")) current = "improvement";
        sections[current].push(line);
    });
    return sections;
};

const SECTIONS = [
    { key: "strength",    label: "Strengths",            accent: "#34d399", bg: "rgba(52,211,153,0.06)",  border: "rgba(52,211,153,0.16)"  },
    { key: "weakness",    label: "Weaknesses",           accent: "#f87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.16)" },
    { key: "improvement", label: "Areas of Improvement", accent: "#fbbf24", bg: "rgba(251,191,36,0.06)",  border: "rgba(251,191,36,0.16)"  },
    { key: "other",       label: "Additional Notes",     accent: "#818cf8", bg: "rgba(129,140,248,0.06)", border: "rgba(129,140,248,0.16)" },
];

/* ── skeleton card ── */
const SkeletonCard = () => (
    <div className="rounded-3xl p-6 animate-pulse space-y-4"
         style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="space-y-2 flex-1">
                <div className="h-2.5 rounded-full w-1/2" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="h-2 rounded-full w-2/3"   style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
        <div className="flex justify-between">
            <div className="h-2 rounded-full w-20" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-6 w-16 rounded-xl"   style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
        <div className="space-y-2">
            {[85, 65].map((w, i) => (
                <div key={i} className="h-2 rounded-full" style={{ width: `${w}%`, background: "rgba(255,255,255,0.04)" }} />
            ))}
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════ */
const Admin = () => {
    const [data,         setData]         = useState([]);
    const [loader,       setLoader]       = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoader(true);
            try {
                const results = await axios.get("/api/resume/get");
                setData(results.data.resumes);
            } catch (err) {
                console.log(err);
                alert("Something went wrong");
            } finally {
                setLoader(false);
            }
        };
        fetchAllData();
    }, []);

    const modalSections = selectedItem
        ? parseSections(selectedItem.feedback?.replace(/^\*\*\s*/, ""))
        : null;

    return (
        <div className="min-h-screen w-full" style={{ background: "#0a0a13" }}>

            {/* Ambient blobs */}
            <div className="fixed top-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)", filter: "blur(70px)" }} />
            <div className="fixed bottom-[-60px] left-[15%] w-[320px] h-[320px] rounded-full pointer-events-none"
                 style={{ background: "radial-gradient(circle, rgba(79,70,229,0.09) 0%, transparent 70%)", filter: "blur(70px)" }} />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-8">

                {/* ── Header ── */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#a78bfa,#818cf8)" }} />
                        <p className="text-white/30 font-medium tracking-widest uppercase" style={{ fontSize: "10px" }}>Admin Panel</p>
                    </div>
                    <h1 className="text-3xl font-bold text-white" style={{ letterSpacing: "-0.03em" }}>All Resume Analyses</h1>
                    <p className="text-white/35 text-sm">View all resume analyses submitted by users.</p>
                </div>

                {/* ── Stats strip ── */}
                {!loader && data.length > 0 && (
                    <div className="flex items-center gap-6 flex-wrap">
                        {[
                            { label: "Total Analyses", value: data.length, color: "#a78bfa" },
                            { label: "Strong Matches",  value: data.filter(d => d.score >= 75).length, color: "#34d399" },
                            { label: "Partial Matches", value: data.filter(d => d.score >= 50 && d.score < 75).length, color: "#fbbf24" },
                            { label: "Weak Matches",    value: data.filter(d => d.score < 50).length,  color: "#f87171" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                                <span className="text-white/35 text-xs">{label}</span>
                                <span className="text-white/80 text-sm font-bold">{value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Skeleton ── */}
                {loader && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                )}

                {/* ── Empty state ── */}
                {!loader && data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-28 gap-5">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                             style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <p className="text-white/50 font-medium">No analyses yet</p>
                            <p className="text-white/25 text-sm mt-1">User submissions will appear here.</p>
                        </div>
                    </div>
                )}

                {/* ── Cards ── */}
                {!loader && data.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {data.map((item) => {
                            const c = scoreConfig(item.score);
                            return (
                                <div
                                    key={item._id}
                                    className="rounded-3xl p-6 flex flex-col gap-4 transition-all duration-200"
                                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.border     = "1px solid rgba(139,92,246,0.3)";
                                        e.currentTarget.style.background = "rgba(139,92,246,0.05)";
                                        e.currentTarget.style.boxShadow  = "0 8px 32px rgba(139,92,246,0.1)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.border     = "1px solid rgba(255,255,255,0.08)";
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                        e.currentTarget.style.boxShadow  = "none";
                                    }}
                                >
                                    {/* User info */}
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={item?.user?.photoUrl}
                                                alt={item?.user?.name}
                                                className="w-11 h-11 rounded-xl object-cover"
                                                style={{ border: "1px solid rgba(139,92,246,0.3)" }}
                                                referrerPolicy="no-referrer"
                                            />
                                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                                  style={{ background: "#34d399", borderColor: "#0a0a13" }} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-white/80 font-semibold text-sm truncate">{item?.user?.name}</p>
                                            <p className="text-white/30 text-xs truncate">{item?.user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Meta row */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-white/25 text-xs">{item.createdAt.slice(0, 10)}</p>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className="text-xl font-bold leading-none" style={{ color: c.text, letterSpacing: "-0.03em" }}>
                                                {item.score}<span className="text-sm" style={{ opacity: 0.7 }}>%</span>
                                            </span>
                                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                                  style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>
                                                {c.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score bar */}
                                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: c.text, boxShadow: `0 0 8px ${c.text}` }} />
                                    </div>

                                    {/* Resume name */}
                                    <p className="text-white/55 text-sm font-medium truncate">{item.resume_name}</p>

                                    {/* View details */}
                                    <button
                                        onClick={() => setSelectedItem(item)}
                                        className="mt-auto flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200"
                                        style={{ color: "#a78bfa" }}
                                        onMouseEnter={(e) => e.currentTarget.style.color = "#c4b5fd"}
                                        onMouseLeave={(e) => e.currentTarget.style.color = "#a78bfa"}
                                    >
                                        View Details
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══ MODAL ══ */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{ background: "rgba(5,5,15,0.75)", backdropFilter: "blur(8px)" }}
                        onClick={() => setSelectedItem(null)}
                    />

                    {/* Modal box */}
                    <div
                        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl flex flex-col"
                        style={{
                            background: "linear-gradient(135deg, #0f0f1e 0%, #0a0a15 100%)",
                            border: "1px solid rgba(139,92,246,0.25)",
                            boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1)",
                        }}
                    >
                        {/* Modal header */}
                        <div className="sticky top-0 z-10 px-7 pt-7 pb-5"
                             style={{ background: "linear-gradient(135deg, #0f0f1e 0%, #0a0a15 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>

                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 overflow-hidden flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(180deg,#a78bfa,#818cf8)" }} />
                                        <p className="text-white/25 font-medium tracking-widest uppercase" style={{ fontSize: "9px" }}>
                                            {selectedItem.createdAt.slice(0, 10)}
                                        </p>
                                    </div>
                                    <h2 className="text-lg font-bold text-white truncate" style={{ letterSpacing: "-0.02em" }}>
                                        {selectedItem.resume_name}
                                    </h2>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                    {/* Score pill */}
                                    {(() => {
                                        const c = scoreConfig(selectedItem.score);
                                        return (
                                            <span className="text-sm font-bold px-3 py-1.5 rounded-xl"
                                                  style={{ color: c.text, background: c.bg, border: `1px solid ${c.border}` }}>
                                                {selectedItem.score}%
                                            </span>
                                        );
                                    })()}
                                    {/* Close */}
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)" }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "white"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* User info strip */}
                            <div className="flex items-center gap-3 mt-4 px-3 py-2.5 rounded-xl"
                                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <img
                                    src={selectedItem?.user?.photoUrl}
                                    alt={selectedItem?.user?.name}
                                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                                    style={{ border: "1px solid rgba(139,92,246,0.3)" }}
                                    referrerPolicy="no-referrer"
                                />
                                <div className="overflow-hidden">
                                    <p className="text-white/70 text-sm font-semibold truncate">{selectedItem?.user?.name}</p>
                                    <p className="text-white/30 text-xs truncate">{selectedItem?.user?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal content — sections */}
                        <div className="px-7 py-6 space-y-4 flex-1">
                            {SECTIONS.map(({ key, label, accent, bg, border }) => {
                                const lines = modalSections[key]?.filter((l) => l.trim());
                                if (!lines?.length) return null;
                                return (
                                    <div key={key} className="rounded-2xl p-5 space-y-3" style={{ background: bg, border: `1px solid ${border}` }}>
                                        <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>{label}</h3>
                                        <div className="text-white/60 text-sm leading-relaxed">
                                            <ReactMarkdown
                                                components={{
                                                    p:      ({ children }) => <p className="mb-1.5">{children}</p>,
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

                        {/* Modal footer */}
                        <div className="sticky bottom-0 px-7 py-5 flex justify-end"
                             style={{ background: "linear-gradient(135deg, #0f0f1e 0%, #0a0a15 100%)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                                style={{
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    color: "rgba(255,255,255,0.5)",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "white"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithAuthHOC(Admin);