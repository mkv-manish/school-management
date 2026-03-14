"use client";

import { useState } from "react";
import { loginUser } from "@/services/api";
import { useRouter } from "next/navigation";
import { Lock, Mail, LogIn, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email.trim() || !password)
            return alert("Email & password required");

        try {
            setLoading(true);
            const data = await loginUser({ email, password });

            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                if (data.role === "admin") router.push("/dashboard");
                else if (data.role === "teacher") router.push("/teacher");
                else router.push("/student");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (e: any) {
            alert(e?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm overflow-hidden">
                {/* Top Banner */}
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <ShieldCheck />
                                School ERP Login
                            </h1>
                            <p className="text-sm opacity-80 mt-1">
                                Secure access for Admin / Teacher / Student /
                                Parent
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Email
                        </label>
                        <div className="mt-1 relative">
                            <Mail
                                size={16}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />
                            <input
                                type="email"
                                placeholder="Enter email"
                                className="w-full border rounded-xl p-3 pl-9 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <Lock
                                size={16}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />
                            <input
                                type="password"
                                placeholder="Enter password"
                                className="w-full border rounded-xl p-3 pl-9 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                onKeyDown={(e) =>
                                    e.key === "Enter" && handleLogin()
                                }
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold
            bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                    >
                        <LogIn size={18} />
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Quick Links */}
                    <div className="pt-3 border-t text-sm text-slate-600 flex flex-wrap gap-2 justify-between">
                        <a className="hover:underline" href="/register-student">
                            Register Student
                        </a>
                        <a className="hover:underline" href="/register-teacher">
                            Register Teacher
                        </a>
                        <a className="hover:underline" href="/admin-setup">
                            Admin Setup
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
