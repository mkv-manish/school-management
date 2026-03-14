"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, XCircle, Percent } from "lucide-react";
import { getMyAttendance } from "@/services/api";

type AttendanceRecord = {
    _id: string;
    date: string;
    status: "present" | "absent";
};

export default function StudentAttendancePage() {
    const [loading, setLoading] = useState(true);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [summary, setSummary] = useState({
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0,
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        (async () => {
            try {
                const data = await getMyAttendance(token);
                setRecords(data.records || []);
                setSummary(
                    data.summary || {
                        total: 0,
                        present: 0,
                        absent: 0,
                        percentage: 0,
                    },
                );
            } catch {
                setRecords([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">
                    Attendance
                </h1>
                <p className="text-slate-600 mt-2">
                    View attendance summary and daily records.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card
                    title="Present Days"
                    value={String(summary.present)}
                    subtitle="Days attended"
                    icon={<CheckCircle2 size={18} />}
                />
                <Card
                    title="Absent Days"
                    value={String(summary.absent)}
                    subtitle="Days missed"
                    icon={<XCircle size={18} />}
                />
                <Card
                    title="Attendance %"
                    value={`${summary.percentage}%`}
                    subtitle="Overall attendance"
                    icon={<Percent size={18} />}
                />
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Daily Records
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6 text-slate-600">
                        Loading attendance...
                    </div>
                ) : records.length === 0 ? (
                    <div className="p-6 text-slate-500">
                        No attendance records found.
                    </div>
                ) : (
                    <div className="divide-y">
                        {records.map((item) => (
                            <div
                                key={item._id}
                                className="p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                                        <CalendarDays size={18} />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">
                                            {new Date(
                                                item.date,
                                            ).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            School Day Record
                                        </div>
                                    </div>
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        item.status === "present"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                            : "bg-red-50 text-red-700 border border-red-200"
                                    }`}
                                >
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Card({
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
