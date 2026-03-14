"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    getTeacherDashboard,
    getTeacherHomework,
    getNotices,
} from "@/services/api";
import {
    BookOpen,
    Users,
    ClipboardList,
    FileText,
    Bell,
    Trophy,
    FolderCheck,
    CalendarDays,
    ArrowRight,
} from "lucide-react";

type HomeworkRow = {
    _id: string;
    title: string;
    type: "note" | "pdf";
    dueDate?: string;
    createdAt?: string;
};

type NoticeItem = {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
    attachment?: string;
};

export default function TeacherDashboard() {
    const [dashboard, setDashboard] = useState<any>(null);
    const [homework, setHomework] = useState<HomeworkRow[]>([]);
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        (async () => {
            try {
                setLoading(true);

                const [dashboardData, homeworkData, noticeData] =
                    await Promise.all([
                        getTeacherDashboard(token),
                        getTeacherHomework(token),
                        getNotices(token),
                    ]);

                setDashboard(dashboardData || null);
                setHomework(homeworkData?.list || []);
                setNotices(
                    Array.isArray(noticeData)
                        ? noticeData
                        : noticeData?.notices || [],
                );
            } catch (e) {
                console.error(e);
                setDashboard(null);
                setHomework([]);
                setNotices([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const classLabel = useMemo(() => {
        if (!dashboard?.class) return "Not Assigned";
        return `${dashboard.class.className} ${dashboard.class.section || ""}`.trim();
    }, [dashboard]);

    const recentHomework = useMemo(() => {
        return [...homework]
            .sort(
                (a, b) =>
                    new Date(b.createdAt || "").getTime() -
                    new Date(a.createdAt || "").getTime(),
            )
            .slice(0, 5);
    }, [homework]);

    const latestNotices = useMemo(() => {
        return [...notices]
            .sort(
                (a, b) =>
                    new Date(b.createdAt || "").getTime() -
                    new Date(a.createdAt || "").getTime(),
            )
            .slice(0, 4);
    }, [notices]);

    if (loading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            {/* Hero */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white p-6 md:p-8 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                            Teacher Workspace
                        </div>
                        <h1 className="mt-4 text-3xl md:text-4xl font-bold">
                            Teacher Dashboard
                        </h1>
                        <p className="mt-2 text-slate-200 max-w-2xl">
                            Manage attendance, homework, students, submissions,
                            results, and school updates from one place.
                        </p>
                        <div className="mt-4 text-sm text-slate-200">
                            Assigned Class:{" "}
                            <span className="font-semibold text-white">
                                {classLabel}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 min-w-fit">
                        <MiniHeroCard
                            label="Students"
                            value={String(dashboard?.totalStudents || 0)}
                        />
                        <MiniHeroCard
                            label="Homework"
                            value={String(dashboard?.totalHomework || 0)}
                        />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    title="Assigned Class"
                    value={classLabel}
                    subtitle="Current assigned class"
                    icon={<BookOpen size={18} />}
                />
                <StatCard
                    title="Total Students"
                    value={String(dashboard?.totalStudents || 0)}
                    subtitle="Students in your class"
                    icon={<Users size={18} />}
                />
                <StatCard
                    title="Homework Posted"
                    value={String(dashboard?.totalHomework || 0)}
                    subtitle="Assignments created"
                    icon={<FileText size={18} />}
                />
                <StatCard
                    title="Latest Notices"
                    value={String(latestNotices.length)}
                    subtitle="Recent school updates"
                    icon={<Bell size={18} />}
                />
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border bg-white shadow-sm p-5">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Quick Actions
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Jump directly to your most-used teacher tools.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <QuickActionCard
                        href="/teacher/attendance"
                        icon={<ClipboardList size={20} />}
                        title="Mark Attendance"
                        subtitle="Record daily class attendance"
                    />
                    <QuickActionCard
                        href="/teacher/homework"
                        icon={<FileText size={20} />}
                        title="Upload Homework"
                        subtitle="Post notes and PDF assignments"
                    />
                    <QuickActionCard
                        href="/teacher/students"
                        icon={<Users size={20} />}
                        title="View Students"
                        subtitle="See students in your class"
                    />
                    <QuickActionCard
                        href="/teacher/submissions"
                        icon={<FolderCheck size={20} />}
                        title="Submissions"
                        subtitle="Check submitted homework"
                    />
                    <QuickActionCard
                        href="/teacher/results"
                        icon={<Trophy size={20} />}
                        title="Add Results"
                        subtitle="Enter exam marks"
                    />
                    <QuickActionCard
                        href="/teacher/notices"
                        icon={<Bell size={20} />}
                        title="Notices"
                        subtitle="Read school announcements"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="grid xl:grid-cols-3 gap-6">
                {/* Recent Homework */}
                <div className="xl:col-span-2 rounded-3xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Recent Homework
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Latest assignments posted by you
                            </p>
                        </div>

                        <Link
                            href="/teacher/homework"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                        >
                            View all
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {recentHomework.length === 0 ? (
                        <div className="p-6 text-slate-600">
                            No homework posted yet.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {recentHomework.map((item) => (
                                <div key={item._id} className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                        <div>
                                            <div className="font-semibold text-slate-900">
                                                {item.title}
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium capitalize">
                                                    {item.type === "pdf"
                                                        ? "PDF Homework"
                                                        : "Note Homework"}
                                                </span>

                                                {item.dueDate ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                                                        Due {item.dueDate}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="text-sm text-slate-500 inline-flex items-center gap-2">
                                            <CalendarDays size={14} />
                                            {item.createdAt
                                                ? new Date(
                                                      item.createdAt,
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notices */}
                <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Latest Notices
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Recent updates from admin
                            </p>
                        </div>

                        <Link
                            href="/teacher/notices"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                        >
                            View all
                            <ArrowRight size={16} />
                        </Link>
                    </div>

                    {latestNotices.length === 0 ? (
                        <div className="p-6 text-slate-600">
                            No notices available.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {latestNotices.map((notice) => (
                                <div key={notice._id} className="p-4">
                                    <div className="font-semibold text-slate-900 line-clamp-1">
                                        {notice.title}
                                    </div>
                                    <div className="text-sm text-slate-600 mt-1 line-clamp-2">
                                        {notice.description ||
                                            "No description provided."}
                                    </div>
                                    <div className="mt-2 text-xs text-slate-500">
                                        {notice.createdAt
                                            ? new Date(
                                                  notice.createdAt,
                                              ).toLocaleDateString()
                                            : "-"}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MiniHeroCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/10 px-4 py-3">
            <div className="text-xs text-slate-200">{label}</div>
            <div className="text-2xl font-bold text-white mt-1">{value}</div>
        </div>
    );
}

function StatCard({
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
            <div className="mt-3 text-2xl font-bold text-slate-900 break-words">
                {value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
    );
}

function QuickActionCard({
    href,
    icon,
    title,
    subtitle,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
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
