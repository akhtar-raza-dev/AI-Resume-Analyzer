
import { useContext } from "react";
import { AuthContext } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { auth, provider } from "../../utils/firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {
    const { setLogin, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userData = {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL,
            };

            const response = await axios.post("/api/user", userData);

            setUserInfo(response.data.user);
            setLogin(true);

            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("isLogin", "true");

            navigate("/dashboard");
        } catch (err) {
            console.log(err);
            alert("Login Failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">

            {/* Ambient glow blobs */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-700/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-fuchsia-900/10 blur-[140px] pointer-events-none" />

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Card */}
            <div className="relative z-10 w-[420px] mx-4">

                {/* Glass card */}
                <div
                    className="rounded-3xl p-[1px]"
                    style={{
                        background: "linear-gradient(135deg, rgba(139,92,246,0.5) 0%, rgba(99,102,241,0.2) 50%, rgba(139,92,246,0.1) 100%)",
                    }}
                >
                    <div className="bg-[#0f0f1a]/90 backdrop-blur-2xl rounded-3xl p-10 space-y-9">

                        {/* Logo mark */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">

                                {/* SmartHire custom SVG logo: Resume + AI brain circuit */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, #1a0f35 0%, #0f0a22 100%)",
                                        border: "1px solid rgba(139,92,246,0.35)",
                                        boxShadow: "0 8px 32px rgba(139,92,246,0.25)",
                                    }}
                                >
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="resumeGrad" x1="4" y1="4" x2="22" y2="32" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#c084fc" />
                                                <stop offset="1" stopColor="#818cf8" />
                                            </linearGradient>
                                            <linearGradient id="aiGrad" x1="20" y1="10" x2="38" y2="34" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#818cf8" />
                                                <stop offset="1" stopColor="#38bdf8" />
                                            </linearGradient>
                                        </defs>

                                        {/* Document / Resume */}
                                        <rect x="4" y="5" width="17" height="22" rx="2.5" stroke="url(#resumeGrad)" strokeWidth="1.6" fill="none" />
                                        {/* avatar circle on doc */}
                                        <circle cx="12.5" cy="10" r="2" stroke="url(#resumeGrad)" strokeWidth="1.3" fill="none" />
                                        {/* text lines */}
                                        <line x1="7.5" y1="15" x2="18" y2="15" stroke="url(#resumeGrad)" strokeWidth="1.3" strokeLinecap="round" />
                                        <line x1="7.5" y1="18.5" x2="18" y2="18.5" stroke="url(#resumeGrad)" strokeWidth="1.3" strokeLinecap="round" />
                                        <line x1="7.5" y1="22" x2="14" y2="22" stroke="url(#resumeGrad)" strokeWidth="1.3" strokeLinecap="round" />

                                        {/* Dashed connector bridge */}
                                        <line x1="21" y1="18" x2="25" y2="18" stroke="url(#aiGrad)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1.5 1.5" />

                                        {/* AI Brain — outer hexagon feel via circle */}
                                        <circle cx="30" cy="21" r="8" stroke="url(#aiGrad)" strokeWidth="1.5" fill="none" />

                                        {/* Neural node center */}
                                        <circle cx="30" cy="21" r="2" fill="url(#aiGrad)" />

                                        {/* Neural spokes */}
                                        <line x1="30" y1="13.5" x2="30" y2="19" stroke="url(#aiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                                        <line x1="30" y1="23" x2="30" y2="28.5" stroke="url(#aiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                                        <line x1="22.5" y1="21" x2="28" y2="21" stroke="url(#aiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                                        <line x1="32" y1="21" x2="37.5" y2="21" stroke="url(#aiGrad)" strokeWidth="1.2" strokeLinecap="round" />
                                        <line x1="24.5" y1="15.5" x2="28.6" y2="19.6" stroke="url(#aiGrad)" strokeWidth="1.1" strokeLinecap="round" />
                                        <line x1="31.4" y1="22.4" x2="35.5" y2="26.5" stroke="url(#aiGrad)" strokeWidth="1.1" strokeLinecap="round" />
                                        <line x1="35.5" y1="15.5" x2="31.4" y2="19.6" stroke="url(#aiGrad)" strokeWidth="1.1" strokeLinecap="round" />
                                        <line x1="28.6" y1="22.4" x2="24.5" y2="26.5" stroke="url(#aiGrad)" strokeWidth="1.1" strokeLinecap="round" />

                                        {/* Outer node dots */}
                                        <circle cx="30" cy="13" r="1.2" fill="url(#aiGrad)" />
                                        <circle cx="30" cy="29" r="1.2" fill="url(#aiGrad)" />
                                        <circle cx="22" cy="21" r="1.2" fill="url(#aiGrad)" />
                                        <circle cx="38" cy="21" r="1.2" fill="url(#aiGrad)" />
                                    </svg>
                                </div>

                                <div className="absolute -inset-1 rounded-2xl bg-violet-500/20 blur-md -z-10" />
                            </div>

                            <div className="text-center">
                                <h1
                                    className="text-[28px] font-bold tracking-tight text-white"
                                    style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
                                >
                                    SmartHire
                                </h1>
                                <p className="text-sm text-white/40 mt-1 font-medium tracking-widest uppercase" style={{ fontSize: "11px" }}>
                                    AI Resume Analyzer
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-white/[0.07]" />
                            <span className="text-white/25 text-xs tracking-widest uppercase">Continue with</span>
                            <div className="flex-1 h-px bg-white/[0.07]" />
                        </div>

                        {/* Google button */}
                        <button
                            onClick={handleLogin}
                            className="group w-full relative flex items-center justify-center gap-3 rounded-2xl py-3.5 px-5 font-medium text-[15px] transition-all duration-200 active:scale-[0.98]"
                            style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "rgba(255,255,255,0.85)",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.06) 100%)";
                                e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                                e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.15)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)";
                                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                className="w-5 h-5"
                                alt="google"
                            />
                            Sign in with Google
                        </button>

                        {/* Footer note */}
                        <p className="text-center text-white/20 text-xs leading-relaxed">
                            By signing in, you agree to our{" "}
                            <span className="text-violet-400/70 hover:text-violet-400 cursor-pointer transition-colors">Terms</span>{" "}
                            &amp;{" "}
                            <span className="text-violet-400/70 hover:text-violet-400 cursor-pointer transition-colors">Privacy Policy</span>
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;