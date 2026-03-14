"use client";

import { useState } from "react";
import { registerTeacher } from "@/services/api";
import { useRouter } from "next/navigation";
import { Users, Mail, Lock, Phone, MapPin, BadgeCheck } from "lucide-react";

export default function RegisterTeacherPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        qualification: "",
        experienceYears: "",
        subjectSpeciality: "",
        contactNumber: "",
        address: "",
        profileBio: "",
    });

    const onChange = (k: string, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    const onSubmit = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.password) {
            return alert("Name, email and password required.");
        }

        try {
            setLoading(true);
            await registerTeacher({
                ...form,
                experienceYears: form.experienceYears
                    ? Number(form.experienceYears)
                    : undefined,
            });
            alert("Teacher registered! Await admin approval.");
            router.push("/login");
        } catch (e: any) {
            alert(e?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users /> Teacher Registration
                    </h1>
                    <p className="text-sm opacity-80 mt-1">
                        Teacher self-registration (admin approval required)
                    </p>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name *"
                        value={form.name}
                        onChange={(v) => onChange("name", v)}
                    />
                    <Input
                        icon={<Mail size={16} />}
                        label="Email *"
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
                        icon={<BadgeCheck size={16} />}
                        label="Qualification"
                        value={form.qualification}
                        onChange={(v) => onChange("qualification", v)}
                    />

                    <Input
                        label="Experience (Years)"
                        value={form.experienceYears}
                        onChange={(v) => onChange("experienceYears", v)}
                    />
                    <Input
                        label="Subject Speciality"
                        value={form.subjectSpeciality}
                        onChange={(v) => onChange("subjectSpeciality", v)}
                    />

                    <Input
                        icon={<Phone size={16} />}
                        label="Contact Number"
                        value={form.contactNumber}
                        onChange={(v) => onChange("contactNumber", v)}
                    />

                    <Input
                        icon={<MapPin size={16} />}
                        label="Address"
                        value={form.address}
                        onChange={(v) => onChange("address", v)}
                    />

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Profile Bio
                        </label>
                        <textarea
                            className="mt-1 w-full min-h-[110px] border rounded-xl p-3"
                            value={form.profileBio}
                            onChange={(e) =>
                                onChange("profileBio", e.target.value)
                            }
                            placeholder="About you..."
                        />
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            className="flex-1 px-5 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? "Submitting..." : "Register Teacher"}
                        </button>
                        <button
                            onClick={() => router.push("/login")}
                            className="px-5 py-3 rounded-xl border hover:bg-slate-50"
                        >
                            Back to Login
                        </button>
                    </div>
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
