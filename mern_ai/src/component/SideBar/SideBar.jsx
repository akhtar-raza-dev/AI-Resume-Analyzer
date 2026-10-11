
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setLogin, setUserInfo, userInfo } = useContext(AuthContext);
    console.log("USER INFO:", userInfo);

    const handleLogout = () => {
        localStorage.clear();
        setLogin(false);
        setUserInfo(null);
        navigate("/");
    };

    const navLinks = [
        { to: "/dashboard", label: "Dashboard", icon: <DashboardIcon fontSize="small" /> },
        { to: "/history",   label: "History",   icon: <ManageSearchIcon fontSize="small" /> },
        ...(userInfo?.role === "admin"
            ? [{ to: "/admin", label: "Admin", icon: <AdminPanelSettingsIcon fontSize="small" /> }]
            : []),
    ];

    return (
        <div
            className="w-64 min-h-screen flex flex-col justify-between relative overflow-hidden"
            style={{
                background: "linear-gradient(180deg, #0f0f1a 0%, #0a0a13 100%)",
                borderRight: "1px solid rgba(139,92,246,0.15)",
            }}
        >
            {/* Ambient glow top */}
            <div
                className="absolute top-[-60px] left-[-40px] w-[220px] h-[220px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)", filter: "blur(50px)" }}
            />
            {/* Ambient glow bottom */}
            <div
                className="absolute bottom-[-60px] right-[-40px] w-[180px] h-[180px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(79,70,229,0.14) 0%, transparent 70%)", filter: "blur(50px)" }}
            />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* ── TOP SECTION ── */}
            <div className="relative z-10 p-6 flex flex-col gap-8">

                {/* Brand */}
                <div className="flex items-center gap-3 px-1">
                    {/* Mini logo */}
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                            background: "linear-gradient(135deg, #1a0f35 0%, #0f0a22 100%)",
                            border: "1px solid rgba(139,92,246,0.35)",
                            boxShadow: "0 4px 16px rgba(139,92,246,0.2)",
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="sbResumeGrad" x1="4" y1="4" x2="22" y2="32" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#c084fc" />
                                    <stop offset="1" stopColor="#818cf8" />
                                </linearGradient>
                                <linearGradient id="sbAiGrad" x1="20" y1="10" x2="38" y2="34" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#818cf8" />
                                    <stop offset="1" stopColor="#38bdf8" />
                                </linearGradient>
                            </defs>
                            <rect x="4" y="5" width="17" height="22" rx="2.5" stroke="url(#sbResumeGrad)" strokeWidth="1.6" fill="none" />
                            <circle cx="12.5" cy="10" r="2" stroke="url(#sbResumeGrad)" strokeWidth="1.3" fill="none" />
                            <line x1="7.5" y1="15" x2="18" y2="15" stroke="url(#sbResumeGrad)" strokeWidth="1.3" strokeLinecap="round" />
                            <line x1="7.5" y1="18.5" x2="18" y2="18.5" stroke="url(#sbResumeGrad)" strokeWidth="1.3" strokeLinecap="round" />
                            <line x1="7.5" y1="22" x2="14" y2="22" stroke="url(#sbResumeGrad)" strokeWidth="1.3" strokeLinecap="round" />
                            <line x1="21" y1="18" x2="25" y2="18" stroke="url(#sbAiGrad)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5" />
                            <circle cx="30" cy="21" r="8" stroke="url(#sbAiGrad)" strokeWidth="1.5" fill="none" />
                            <circle cx="30" cy="21" r="2" fill="url(#sbAiGrad)" />
                            <line x1="30" y1="13.5" x2="30" y2="19" stroke="url(#sbAiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="30" y1="23" x2="30" y2="28.5" stroke="url(#sbAiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="22.5" y1="21" x2="28" y2="21" stroke="url(#sbAiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                            <line x1="32" y1="21" x2="37.5" y2="21" stroke="url(#sbAiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="30" cy="13" r="1.2" fill="url(#sbAiGrad)" />
                            <circle cx="30" cy="29" r="1.2" fill="url(#sbAiGrad)" />
                            <circle cx="22" cy="21" r="1.2" fill="url(#sbAiGrad)" />
                            <circle cx="38" cy="21" r="1.2" fill="url(#sbAiGrad)" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-[16px] font-bold text-white leading-none" style={{ letterSpacing: "-0.02em" }}>
                            SmartHire
                        </h1>
                        <p className="text-white/30 mt-0.5 font-medium tracking-widest uppercase" style={{ fontSize: "9px" }}>
                            AI Resume Analyzer
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/[0.06]" />

                {/* Nav links */}
                <nav className="flex flex-col gap-1">
                    {navLinks.map(({ to, label, icon }) => {
                        const isActive = location.pathname === to;
                        return (
                            <Link
                                key={to}
                                to={to}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                                style={
                                    isActive
                                        ? {
                                            background: "linear-gradient(135deg, rgba(139,92,246,0.22) 0%, rgba(99,102,241,0.12) 100%)",
                                            border: "1px solid rgba(139,92,246,0.35)",
                                            color: "#c4b5fd",
                                            boxShadow: "0 0 16px rgba(139,92,246,0.1)",
                                        }
                                        : {
                                            background: "transparent",
                                            border: "1px solid transparent",
                                            color: "rgba(255,255,255,0.4)",
                                        }
                                }
                                onMouseEnter={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                        e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "transparent";
                                        e.currentTarget.style.color = "rgba(255,255,255,0.4)";
                                    }
                                }}
                            >
                                <span style={{ opacity: isActive ? 1 : 0.6 }}>{icon}</span>
                                {label}
                                {isActive && (
                                    <span
                                        className="ml-auto w-1.5 h-1.5 rounded-full"
                                        style={{ background: "#a78bfa", boxShadow: "0 0 6px #a78bfa" }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* ── BOTTOM SECTION ── */}
            <div className="relative z-10 p-6 flex flex-col gap-4">

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full"
                    style={{
                        background: "transparent",
                        border: "1px solid transparent",
                        color: "rgba(255,255,255,0.35)",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                        e.currentTarget.style.color = "#f87171";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                    }}
                >
                    <LogoutIcon fontSize="small" />
                    Logout
                </button>

                {/* Divider */}
                <div className="h-px bg-white/[0.06]" />

                {/* User profile */}
                {userInfo && (
                    <div
                        className="flex items-center gap-3 px-3 py-3 rounded-xl"
                        style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={userInfo?.photoUrl}
                                alt="profile"
                                className="w-9 h-9 rounded-xl object-cover"
                                style={{ border: "1px solid rgba(139,92,246,0.4)" }}
                                referrerPolicy="no-referrer"
                            />
                            {/* Online dot */}
                            <span
                                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                style={{ background: "#34d399", borderColor: "#0f0f1a" }}
                            />
                        </div>

                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-white/85 truncate" style={{ letterSpacing: "-0.01em" }}>
                                {userInfo.name}
                            </span>
                            <span className="text-white/30 truncate" style={{ fontSize: "11px" }}>
                                {userInfo.email}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBar;