"use client";

import { useEffect, useMemo, useState } from "react";
import { approveUser, getPendingUsers } from "@/services/api";
import {
    CheckCircle2,
    RefreshCcw,
    Search,
    ShieldCheck,
    Users,
    GraduationCap,
} from "lucide-react";

type PendingUser = {
    _id: string;
    name?: string;
    email?: string;
    role?: "teacher" | "student" | "parent" | "admin";
    approved?: boolean;
    createdAt?: string;
    teacherProfile?: {
        qualification?: string;
        experienceYears?: number;
        subjectSpeciality?: string;
        contactNumber?: string;
        address?: string;
        profileBio?: string;
    } | null;
    studentProfile?: {
        fatherName?: string;
        motherName?: string;
        contactNumber?: string;
        address?: string;
        className?: string;
        section?: string;
        parentName?: string;
        parentEmail?: string;
    } | null;
};

export default function AdminApprovalsPage() {
    const [token, setToken] = useState<string | null>(null);
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const loadPending = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError("");
            const data = await getPendingUsers(token);
            setUsers(Array.isArray(data) ? data : data.users || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load pending users");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        loadPending();
    }, [token]);

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return users;

        return users.filter(
            (u) =>
                (u.name || "").toLowerCase().includes(q) ||
                (u.email || "").toLowerCase().includes(q) ||
                (u.role || "").toLowerCase().includes(q) ||
                (u.teacherProfile?.qualification || "")
                    .toLowerCase()
                    .includes(q) ||
                (u.teacherProfile?.subjectSpeciality || "")
                    .toLowerCase()
                    .includes(q) ||
                (u.studentProfile?.className || "").toLowerCase().includes(q) ||
                (u.studentProfile?.parentEmail || "").toLowerCase().includes(q),
        );
    }, [users, search]);

    const teacherCount = filteredUsers.filter(
        (u) => u.role === "teacher",
    ).length;
    const studentCount = filteredUsers.filter(
        (u) => u.role === "student",
    ).length;
    const parentCount = filteredUsers.filter((u) => u.role === "parent").length;

    const onApprove = async (id: string) => {
        if (!token) return;

        try {
            setApprovingId(id);
            await approveUser(token, id);
            await loadPending();
        } catch (e: any) {
            alert(e?.message || "Approve failed");
        } finally {
            setApprovingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 md:p-8 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                            <ShieldCheck size={16} />
                            Admin Approval Center
                        </div>
                        <h1 className="mt-4 text-3xl md:text-4xl font-bold">
                            Pending Approvals
                        </h1>
                        <p className="mt-2 text-slate-200 max-w-2xl">
                            Review teacher and student registration details
                            before approving access to the system.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-fit">
                        <MiniStat
                            label="Total"
                            value={String(filteredUsers.length)}
                        />
                        <MiniStat
                            label="Teachers"
                            value={String(teacherCount)}
                        />
                        <MiniStat
                            label="Students"
                            value={String(studentCount)}
                        />
                        <MiniStat label="Parents" value={String(parentCount)} />
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border bg-red-50 text-red-700 p-4">
                    {error}
                </div>
            ) : null}

            <div className="rounded-2xl border bg-white shadow-sm p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <div className="font-semibold text-slate-900">
                            Search Pending Users
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Find pending registrations by name, email, role,
                            class, subject, or parent email.
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search
                                size={16}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />
                            <input
                                className="w-full border rounded-xl p-3 pl-9"
                                placeholder="Search pending users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={loadPending}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                        >
                            <RefreshCcw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <SummaryCard
                    title="Pending Users"
                    value={String(filteredUsers.length)}
                    subtitle="Total awaiting approval"
                    icon={<Users size={18} />}
                />
                <SummaryCard
                    title="Teachers"
                    value={String(teacherCount)}
                    subtitle="Pending teacher accounts"
                    icon={<GraduationCap size={18} />}
                />
                <SummaryCard
                    title="Students"
                    value={String(studentCount)}
                    subtitle="Pending student accounts"
                    icon={<Users size={18} />}
                />
                <SummaryCard
                    title="Parents"
                    value={String(parentCount)}
                    subtitle="Pending parent accounts"
                    icon={<ShieldCheck size={18} />}
                />
            </div>

            <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Pending Approval List
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Review each registration and approve when ready.
                    </p>
                </div>

                {loading ? (
                    <div className="p-6 text-slate-600">
                        Loading pending users...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <ShieldCheck className="text-slate-500" size={22} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            No pending approvals
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            All registrations are approved right now.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {filteredUsers.map((user) => (
                            <div key={user._id} className="p-5">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-lg font-semibold text-slate-900">
                                                {user.name || "Unnamed User"}
                                            </div>
                                            <RoleBadge role={user.role} />
                                        </div>

                                        <div className="mt-2 text-sm text-slate-600">
                                            {user.email || "No email"}
                                        </div>

                                        <div className="mt-2 text-xs text-slate-500">
                                            Registered:{" "}
                                            {user.createdAt
                                                ? new Date(
                                                      user.createdAt,
                                                  ).toLocaleString()
                                                : "-"}
                                        </div>

                                        {user.role === "teacher" &&
                                        user.teacherProfile ? (
                                            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-slate-600 rounded-2xl bg-slate-50 p-4 border">
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Qualification:
                                                    </span>{" "}
                                                    {user.teacherProfile
                                                        .qualification || "-"}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Experience:
                                                    </span>{" "}
                                                    {user.teacherProfile
                                                        .experienceYears ??
                                                        0}{" "}
                                                    years
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Subject:
                                                    </span>{" "}
                                                    {user.teacherProfile
                                                        .subjectSpeciality ||
                                                        "-"}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Contact:
                                                    </span>{" "}
                                                    {user.teacherProfile
                                                        .contactNumber || "-"}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <span className="font-medium text-slate-700">
                                                        Address:
                                                    </span>{" "}
                                                    {user.teacherProfile
                                                        .address || "-"}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <span className="font-medium text-slate-700">
                                                        Bio:
                                                    </span>{" "}
                                                    {user.teacherProfile
                                                        .profileBio || "-"}
                                                </div>
                                            </div>
                                        ) : null}

                                        {user.role === "student" &&
                                        user.studentProfile ? (
                                            <div className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-slate-600 rounded-2xl bg-slate-50 p-4 border">
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Class:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .className || "-"}{" "}
                                                    {user.studentProfile
                                                        .section || ""}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Contact:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .contactNumber || "-"}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Father:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .fatherName || "-"}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Mother:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .motherName || "-"}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Parent Name:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .parentName || "-"}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-slate-700">
                                                        Parent Email:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .parentEmail || "-"}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <span className="font-medium text-slate-700">
                                                        Address:
                                                    </span>{" "}
                                                    {user.studentProfile
                                                        .address || "-"}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onApprove(user._id)}
                                            disabled={approvingId === user._id}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 font-semibold"
                                        >
                                            <CheckCircle2 size={17} />
                                            {approvingId === user._id
                                                ? "Approving..."
                                                : "Approve"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function MiniStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/10 px-4 py-3">
            <div className="text-xs text-slate-200">{label}</div>
            <div className="mt-1 text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="flex items-center justify-between">
                <div className="text-slate-500 text-sm font-medium">
                    {title}
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    {icon}
                </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">
                {value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
    );
}

function RoleBadge({ role }: { role?: string }) {
    const style =
        role === "teacher"
            ? "bg-blue-50 text-blue-700 border-blue-100"
            : role === "student"
              ? "bg-green-50 text-green-700 border-green-100"
              : role === "parent"
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-slate-50 text-slate-700 border-slate-200";

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
        >
            {(role || "user").toUpperCase()}
        </span>
    );
}
