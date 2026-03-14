"use client";

import { useState } from "react";
import { registerAdmin } from "@/services/api";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, KeyRound, User } from "lucide-react";

export default function AdminSetupPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        setupKey: "",
    });

    const onChange = (k: string, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    const onSubmit = async () => {
        if (!form.name || !form.email || !form.password) {
            return alert("Name, email, password required.");
        }

        try {
            setLoading(true);
            await registerAdmin(form);
            alert("Admin created successfully. Now login.");
            router.push("/login");
        } catch (e: any) {
            alert(e?.message || "Admin setup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield /> Admin Setup
                    </h1>
                    <p className="text-sm opacity-80 mt-1">
                        One-time admin creation (use setup key if enabled)
                    </p>
                </div>

                <div className="p-6 space-y-4">
                    <Input
                        icon={<User size={16} />}
                        label="Admin Name *"
                        value={form.name}
                        onChange={(v) => onChange("name", v)}
                    />
                    <Input
                        icon={<Mail size={16} />}
                        label="Admin Email *"
                        value={form.email}
                        onChange={(v) => onChange("email", v)}
                    />
                    <Input
                        icon={<Lock size={16} />}
                        label="Password *"
                        type="password"
                        value={form.password}
                        onChange={(v) => onChange("password", v)}
                    />
                    <Input
                        icon={<KeyRound size={16} />}
                        label="Setup Key (optional)"
                        value={form.setupKey}
                        onChange={(v) => onChange("setupKey", v)}
                    />

                    <button
                        onClick={onSubmit}
                        disabled={loading}
                        className="w-full px-5 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
                    >
                        {loading ? "Creating..." : "Create Admin"}
                    </button>

                    <button
                        onClick={() => router.push("/login")}
                        className="w-full px-5 py-3 rounded-xl border hover:bg-slate-50"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    type = "text",
    icon,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div>
            <label className="text-sm font-semibold text-slate-700">
                {label}
            </label>
            <div className="mt-1 relative">
                {icon ? (
                    <span className="absolute left-3 top-3.5 text-slate-400">
                        {icon}
                    </span>
                ) : null}
                <input
                    className={`w-full border rounded-xl p-3 ${icon ? "pl-9" : ""}`}
                    value={value}
                    type={type}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
