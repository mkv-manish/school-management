"use client";

import { useEffect, useState } from "react";
import { registerStudent, getClassesPublic } from "@/services/api";
import { GraduationCap, User, Mail, Lock, Home, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

type ClassRow = { _id: string; className: string; section?: string };

export default function RegisterStudentPage() {
    const router = useRouter();
    const [classes, setClasses] = useState<ClassRow[]>([]);
    const [loadingClasses, setLoadingClasses] = useState(true);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        classId: "",
        fatherName: "",
        motherName: "",
        parentEmail: "",
        contactNumber: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                setLoadingClasses(true);
                const data = await getClassesPublic();
                setClasses(Array.isArray(data) ? data : data.classes || []);
            } catch {
                setClasses([]);
            } finally {
                setLoadingClasses(false);
            }
        })();
    }, []);

    const onChange = (k: string, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    const handleContactNumberChange = (value: string) => {
        const numericOnly = value.replace(/\D/g, "").slice(0, 10);
        onChange("contactNumber", numericOnly);
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const onSubmit = async () => {
        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.password.trim() ||
            !form.classId ||
            !form.fatherName.trim() ||
            !form.motherName.trim() ||
            !form.parentEmail.trim()
        ) {
            return alert("Please fill all required fields.");
        }

        if (!isValidEmail(form.email.trim())) {
            return alert("Please enter a valid student email address.");
        }

        if (!isValidEmail(form.parentEmail.trim())) {
            return alert("Please enter a valid parent email address.");
        }

        if (form.password.length < 6) {
            return alert("Password must be at least 6 characters.");
        }

        if (form.contactNumber && form.contactNumber.length !== 10) {
            return alert("Contact number must be exactly 10 digits.");
        }

        try {
            setLoading(true);
            await registerStudent({
                ...form,
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                fatherName: form.fatherName.trim(),
                motherName: form.motherName.trim(),
                parentEmail: form.parentEmail.trim().toLowerCase(),
                contactNumber: form.contactNumber.trim(),
                address: form.address.trim(),
            });
            alert("Student registered! Await admin approval.");
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
                        <GraduationCap /> Student Registration
                    </h1>
                    <p className="text-sm opacity-80 mt-1">
                        Student self-registration (admin approval required)
                    </p>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-4">
                    <Input
                        icon={<User size={16} />}
                        label="Student Name *"
                        value={form.name}
                        onChange={(v) => onChange("name", v)}
                    />
                    <Input
                        icon={<Mail size={16} />}
                        label="Student Email *"
                        type="email"
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

                    <div>
                        <label className="text-sm font-semibold text-slate-700">
                            Class *
                        </label>
                        <select
                            className="mt-1 w-full border rounded-xl p-3 bg-white"
                            value={form.classId}
                            onChange={(e) =>
                                onChange("classId", e.target.value)
                            }
                            disabled={loadingClasses}
                        >
                            <option value="">
                                {loadingClasses
                                    ? "Loading classes..."
                                    : "-- Select Class --"}
                            </option>
                            {classes.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.className} {c.section || ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Father Name *"
                        value={form.fatherName}
                        onChange={(v) => onChange("fatherName", v)}
                    />
                    <Input
                        label="Mother Name *"
                        value={form.motherName}
                        onChange={(v) => onChange("motherName", v)}
                    />

                    <Input
                        icon={<Mail size={16} />}
                        label="Parent Email *"
                        type="email"
                        value={form.parentEmail}
                        onChange={(v) => onChange("parentEmail", v)}
                    />
                    <Input
                        icon={<Phone size={16} />}
                        label="Contact Number"
                        type="tel"
                        value={form.contactNumber}
                        onChange={handleContactNumberChange}
                        inputMode="numeric"
                        maxLength={10}
                    />

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">
                            Address
                        </label>
                        <div className="mt-1 relative">
                            <Home
                                size={16}
                                className="absolute left-3 top-4 text-slate-400"
                            />
                            <textarea
                                className="w-full min-h-[90px] pl-9 pr-3 py-3 border rounded-xl"
                                value={form.address}
                                onChange={(e) =>
                                    onChange("address", e.target.value)
                                }
                                placeholder="Full address..."
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 flex gap-3">
                        <button
                            onClick={onSubmit}
                            disabled={loading}
                            className="flex-1 px-5 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? "Submitting..." : "Register Student"}
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
    inputMode,
    maxLength,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    icon?: React.ReactNode;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    maxLength?: number;
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
                    inputMode={inputMode}
                    maxLength={maxLength}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}
