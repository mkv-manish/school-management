"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboardStats } from "@/services/api";
import {
    Users,
    GraduationCap,
    BookOpen,
    UserRound,
    ClipboardList,
    Trophy,
    Bell,
    ShieldCheck,
    ArrowRight,
    Wallet,
    Receipt,
} from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getDashboardStats(token).then(setStats);
        }
    }, []);

    if (!stats) {
        return (
            <div className="p-6">
                <div className="animate-pulse grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="h-32 rounded-2xl bg-white shadow-sm border"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 md:p-8 shadow-lg">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                            <ShieldCheck size={16} />
                            Admin Control Center
                        </div>

                        <h2 className="mt-4 text-3xl md:text-4xl font-bold">
                            Welcome Back 👋
                        </h2>
                        <p className="text-sm md:text-base opacity-80 mt-2 max-w-2xl">
                            Manage users, classes, notices, results, attendance,
                            and fees from one central admin dashboard.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 min-w-fit">
                        <MiniHeroCard
                            label="Students"
                            value={String(stats.totalStudents || 0)}
                        />
                        <MiniHeroCard
                            label="Teachers"
                            value={String(stats.totalTeachers || 0)}
                        />
                        <MiniHeroCard
                            label="Classes"
                            value={String(stats.totalClasses || 0)}
                        />
                        <MiniHeroCard
                            label="Fees"
                            value={String(stats.totalFeeRecords || 0)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    subtitle="Registered students in system"
                    icon={<GraduationCap size={20} />}
                    tint="blue"
                />

                <StatCard
                    title="Total Teachers"
                    value={stats.totalTeachers}
                    subtitle="Active teaching staff"
                    icon={<Users size={20} />}
                    tint="green"
                />

                <StatCard
                    title="Total Parents"
                    value={stats.totalParents}
                    subtitle="Linked parent accounts"
                    icon={<UserRound size={20} />}
                    tint="amber"
                />

                <StatCard
                    title="Total Classes"
                    value={stats.totalClasses}
                    subtitle="Available class groups"
                    icon={<BookOpen size={20} />}
                    tint="purple"
                />

                <StatCard
                    title="Today Attendance"
                    value={stats.todayAttendance}
                    subtitle="Attendance entries today"
                    icon={<ClipboardList size={20} />}
                    tint="rose"
                />

                <StatCard
                    title="Total Results"
                    value={stats.totalResults}
                    subtitle="Exam result records"
                    icon={<Trophy size={20} />}
                    tint="slate"
                />

                <StatCard
                    title="Fee Records"
                    value={stats.totalFeeRecords}
                    subtitle="Generated fee entries"
                    icon={<Receipt size={20} />}
                    tint="blue"
                />

                <StatCard
                    title="Unpaid Fees"
                    value={stats.unpaidFeeCount}
                    subtitle="Pending full payments"
                    icon={<Wallet size={20} />}
                    tint="amber"
                />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <MoneyCard
                    title="Total Collected"
                    value={`₹${stats.totalCollected || 0}`}
                    subtitle="Paid amount received"
                />
                <MoneyCard
                    title="Total Due"
                    value={`₹${stats.totalDue || 0}`}
                    subtitle="Remaining pending amount"
                />
                <MoneyCard
                    title="Partial Fees"
                    value={String(stats.partialFeeCount || 0)}
                    subtitle="Partially paid records"
                />
            </div>

            <div className="rounded-3xl border bg-white shadow-sm p-5">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Quick Actions
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        Jump directly to important admin tasks.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-4">
                    <QuickAction
                        href="/dashboard/approvals"
                        title="Approvals"
                        subtitle="Approve pending users"
                        icon={<Users size={20} />}
                    />
                    <QuickAction
                        href="/dashboard/students"
                        title="Students"
                        subtitle="Manage student records"
                        icon={<GraduationCap size={20} />}
                    />
                    <QuickAction
                        href="/dashboard/teachers"
                        title="Teachers"
                        subtitle="Manage teaching staff"
                        icon={<Users size={20} />}
                    />
                    <QuickAction
                        href="/dashboard/classes"
                        title="Classes"
                        subtitle="Manage class groups"
                        icon={<BookOpen size={20} />}
                    />
                    <QuickAction
                        href="/dashboard/notices"
                        title="Notices"
                        subtitle="Create school updates"
                        icon={<Bell size={20} />}
                    />
                    <QuickAction
                        href="/dashboard/fees"
                        title="Fees"
                        subtitle="Manage fee records"
                        icon={<Wallet size={20} />}
                    />
                </div>
            </div>

            <div className="grid xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 rounded-3xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50">
                        <h3 className="text-lg font-semibold text-slate-900">
                            School Overview
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Current high-level system summary
                        </p>
                    </div>

                    <div className="p-5 grid md:grid-cols-2 gap-4">
                        <OverviewRow
                            label="Students vs Teachers"
                            value={`${stats.totalStudents || 0} / ${stats.totalTeachers || 0}`}
                        />
                        <OverviewRow
                            label="Parents in System"
                            value={String(stats.totalParents || 0)}
                        />
                        <OverviewRow
                            label="Classes Running"
                            value={String(stats.totalClasses || 0)}
                        />
                        <OverviewRow
                            label="Results Stored"
                            value={String(stats.totalResults || 0)}
                        />
                        <OverviewRow
                            label="Attendance Logged Today"
                            value={String(stats.todayAttendance || 0)}
                        />
                        <OverviewRow
                            label="Total Fee Due"
                            value={`₹${stats.totalDue || 0}`}
                        />
                    </div>
                </div>

                <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50">
                        <h3 className="text-lg font-semibold text-slate-900">
                            Admin Shortcuts
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Frequently used management sections
                        </p>
                    </div>

                    <div className="divide-y">
                        <ShortcutRow
                            href="/dashboard/approvals"
                            label="Open Approvals"
                        />
                        <ShortcutRow
                            href="/dashboard/students"
                            label="Manage Students"
                        />
                        <ShortcutRow
                            href="/dashboard/teachers"
                            label="Manage Teachers"
                        />
                        <ShortcutRow
                            href="/dashboard/classes"
                            label="Manage Classes"
                        />
                        <ShortcutRow
                            href="/dashboard/notices"
                            label="Create Notice"
                        />
                        <ShortcutRow href="/dashboard/fees" label="Open Fees" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MiniHeroCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/10 px-4 py-3">
            <div className="text-xs text-slate-200">{label}</div>
            <div className="mt-1 text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon,
    tint,
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    tint: "blue" | "green" | "amber" | "purple" | "rose" | "slate";
}) {
    const tintMap: Record<string, string> = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        amber: "bg-amber-100 text-amber-600",
        purple: "bg-purple-100 text-purple-600",
        rose: "bg-rose-100 text-rose-600",
        slate: "bg-slate-100 text-slate-600",
    };

    return (
        <div className="rounded-2xl bg-white border shadow-sm p-6 transition hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-between">
                <div className="text-slate-500 text-sm font-medium">
                    {title}
                </div>
                <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center ${tintMap[tint]}`}
                >
                    {icon}
                </div>
            </div>

            <div className="mt-4 text-3xl font-bold text-slate-900">
                {value}
            </div>
            <div className="mt-2 text-xs text-slate-400">{subtitle}</div>
        </div>
    );
}

function MoneyCard({
    title,
    value,
    subtitle,
}: {
    title: string;
    value: string;
    subtitle: string;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-6">
            <div className="text-sm text-slate-500 font-medium">{title}</div>
            <div className="mt-3 text-3xl font-bold text-slate-900">
                {value}
            </div>
            <div className="mt-2 text-xs text-slate-400">{subtitle}</div>
        </div>
    );
}

function QuickAction({
    href,
    title,
    subtitle,
    icon,
}: {
    href: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="rounded-2xl border bg-white p-5 hover:bg-slate-50 hover:shadow-sm transition block"
        >
            <div className="h-11 w-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3">
                {icon}
            </div>
            <div className="font-semibold text-slate-900">{title}</div>
            <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
        </Link>
    );
}

function OverviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
                {value}
            </div>
        </div>
    );
}

function ShortcutRow({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition"
        >
            <span className="font-medium text-slate-900">{label}</span>
            <ArrowRight size={16} className="text-slate-400" />
        </Link>
    );
}
