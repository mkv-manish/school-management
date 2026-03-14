"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyHomework, getNotices } from "@/services/api";
import {
    ClipboardList,
    Bell,
    Clock3,
    BadgeCheck,
    BookOpen,
} from "lucide-react";
import Link from "next/link";

type HomeworkItem = {
    _id: string;
    title: string;
    description?: string;
    type: "note" | "pdf";
    noteText?: string;
    fileUrl?: string;
    fileName?: string;
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

export default function StudentDashboardPage() {
    const [role, setRole] = useState<string>("");
    const [homework, setHomework] = useState<HomeworkItem[]>([]);
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token) return;
        setRole(userRole || "");

        loadData(token);
    }, []);

    const loadData = async (token: string) => {
        try {
            setLoading(true);

            const [hwRes, noticeRes] = await Promise.allSettled([
                getMyHomework(token),
                getNotices(token),
            ]);

            if (hwRes.status === "fulfilled") {
                setHomework(
                    Array.isArray(hwRes.value)
                        ? hwRes.value
                        : hwRes.value.list || [],
                );
            } else {
                setHomework([]);
            }

            if (noticeRes.status === "fulfilled") {
                setNotices(
                    Array.isArray(noticeRes.value)
                        ? noticeRes.value
                        : noticeRes.value.notices || [],
                );
            } else {
                setNotices([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const recentHomework = useMemo(() => {
        return [...homework]
            .sort(
                (a, b) =>
                    new Date(b.createdAt || "").getTime() -
                    new Date(a.createdAt || "").getTime(),
            )
            .slice(0, 3);
    }, [homework]);

    const upcomingHomework = useMemo(() => {
        return homework
            .filter((item) => item.dueDate)
            .sort(
                (a, b) =>
                    new Date(a.dueDate || "").getTime() -
                    new Date(b.dueDate || "").getTime(),
            )
            .slice(0, 5);
    }, [homework]);

    const totalHomework = homework.length;
    const withFiles = homework.filter((h) => h.fileUrl).length;
    const upcomingCount = homework.filter(
        (h) => h.dueDate && new Date(h.dueDate).getTime() >= Date.now(),
    ).length;

    return (
        <div className="min-h-screen">
            <div className="border-b bg-white">
                <div className="px-4 md:px-6 py-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        {role === "parent"
                            ? "Parent Dashboard"
                            : "Student Dashboard"}
                    </h1>
                    <p className="mt-2 text-slate-600">
                        {role === "parent"
                            ? "Monitor homework, deadlines, notices, attendance and results."
                            : "Track your studies, deadlines and school updates from one place."}
                    </p>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <SummaryCard
                        title="Total Homework"
                        value={loading ? "..." : String(totalHomework)}
                        subtitle="Assigned by teachers"
                        icon={<ClipboardList size={18} />}
                    />
                    <SummaryCard
                        title="Upcoming Deadlines"
                        value={loading ? "..." : String(upcomingCount)}
                        subtitle="Needs attention"
                        icon={<Clock3 size={18} />}
                    />
                    <SummaryCard
                        title="Files Available"
                        value={loading ? "..." : String(withFiles)}
                        subtitle="Downloadable files"
                        icon={<BadgeCheck size={18} />}
                    />
                    <SummaryCard
                        title="Notices"
                        value={loading ? "..." : String(notices.length)}
                        subtitle="School updates"
                        icon={<Bell size={18} />}
                    />
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    <Link
                        href="/student/homework"
                        className="rounded-2xl border bg-white shadow-sm p-5 hover:bg-slate-50 transition"
                    >
                        <div className="font-semibold text-slate-900">
                            Homework Center
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Open all assignments
                        </div>
                    </Link>

                    <Link
                        href="/student/notices"
                        className="rounded-2xl border bg-white shadow-sm p-5 hover:bg-slate-50 transition"
                    >
                        <div className="font-semibold text-slate-900">
                            School Notices
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Check announcements
                        </div>
                    </Link>

                    <Link
                        href="/student/attendance"
                        className="rounded-2xl border bg-white shadow-sm p-5 hover:bg-slate-50 transition"
                    >
                        <div className="font-semibold text-slate-900">
                            Attendance
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            View attendance summary
                        </div>
                    </Link>

                    <Link
                        href="/student/results"
                        className="rounded-2xl border bg-white shadow-sm p-5 hover:bg-slate-50 transition"
                    >
                        <div className="font-semibold text-slate-900">
                            Results
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Check marks and performance
                        </div>
                    </Link>
                </div>

                <div className="grid xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b bg-slate-50">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Recent Homework
                                </h2>
                            </div>

                            {loading ? (
                                <div className="p-6 text-slate-600">
                                    Loading homework...
                                </div>
                            ) : recentHomework.length === 0 ? (
                                <EmptyState
                                    title="No homework found"
                                    description="Assigned homework will appear here."
                                />
                            ) : (
                                <div className="divide-y">
                                    {recentHomework.map((item) => (
                                        <div key={item._id} className="p-5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {item.title}
                                                </h3>
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                                    {item.type === "pdf"
                                                        ? "PDF Homework"
                                                        : "Note Homework"}
                                                </span>
                                                {item.dueDate ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                        Due{" "}
                                                        {new Date(
                                                            item.dueDate,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <p className="mt-3 text-sm text-slate-600 whitespace-pre-line">
                                                {item.description ||
                                                    item.noteText ||
                                                    "No description provided."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b bg-slate-50">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Latest Notices
                                </h2>
                            </div>

                            {loading ? (
                                <div className="p-6 text-slate-600">
                                    Loading notices...
                                </div>
                            ) : notices.length === 0 ? (
                                <EmptyState
                                    title="No notices available"
                                    description="School notices will appear here."
                                />
                            ) : (
                                <div className="divide-y">
                                    {notices.slice(0, 5).map((notice) => (
                                        <div key={notice._id} className="p-5">
                                            <h3 className="font-semibold text-slate-900">
                                                {notice.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-slate-600">
                                                {notice.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <div className="space-y-6">
                        <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                            <div className="px-5 py-4 border-b bg-slate-50">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Upcoming Deadlines
                                </h2>
                            </div>

                            {loading ? (
                                <div className="p-6 text-slate-600">
                                    Loading deadlines...
                                </div>
                            ) : upcomingHomework.length === 0 ? (
                                <div className="p-6 text-sm text-slate-500">
                                    No upcoming deadlines.
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {upcomingHomework.map((item) => (
                                        <div key={item._id} className="p-4">
                                            <div className="font-semibold text-slate-900">
                                                {item.title}
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1 capitalize">
                                                {item.type === "pdf"
                                                    ? "PDF Homework"
                                                    : "Note Homework"}
                                            </div>
                                            <div className="text-sm text-amber-700 font-medium mt-2">
                                                Due{" "}
                                                {item.dueDate
                                                    ? new Date(
                                                          item.dueDate,
                                                      ).toLocaleDateString()
                                                    : "-"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
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

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="p-10 text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <BookOpen className="text-slate-500" size={22} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
    );
}
