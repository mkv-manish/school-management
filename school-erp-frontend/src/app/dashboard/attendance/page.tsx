"use client";

import { useEffect, useState } from "react";
import { ClipboardList, RefreshCcw } from "lucide-react";
import { getAdminAttendanceSummary } from "@/services/api";
import AdminAttendanceSummaryCards from "@/components/attendance/AdminAttendanceSummaryCards";
import AdminAttendanceClassTable from "@/components/attendance/AdminAttendanceClassTable";

type Summary = {
    totalStudents: number;
    totalPresent: number;
    totalAbsent: number;
    attendancePercentage: number;
};

type ClassRow = {
    classId: string;
    className: string;
    section?: string;
    classTeacher?: {
        _id?: string;
        name?: string;
        email?: string;
    } | null;
    totalStudents: number;
    present: number;
    absent: number;
    percentage: number;
    marked: boolean;
};

export default function AdminAttendancePage() {
    const [date, setDate] = useState("");
    const [rows, setRows] = useState<ClassRow[]>([]);
    const [summary, setSummary] = useState<Summary>({
        totalStudents: 0,
        totalPresent: 0,
        totalAbsent: 0,
        attendancePercentage: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async (selectedDate: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            setError("");

            const data = await getAdminAttendanceSummary(token, selectedDate);

            setRows(data.classes || []);
            setSummary(
                data.summary || {
                    totalStudents: 0,
                    totalPresent: 0,
                    totalAbsent: 0,
                    attendancePercentage: 0,
                },
            );
        } catch (e: any) {
            setError(e?.message || "Failed to load attendance summary");
            setRows([]);
            setSummary({
                totalStudents: 0,
                totalPresent: 0,
                totalAbsent: 0,
                attendancePercentage: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setDate(today);
        load(today);
    }, []);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-sm">
                <div className="p-5 md:p-7 flex flex-col gap-5">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                                <ClipboardList size={16} />
                                Attendance Management
                            </div>

                            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                                Attendance
                            </h1>

                            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
                                Monitor daily attendance and review class-wise
                                student presence records.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    load(e.target.value);
                                }}
                                className="px-4 py-3 rounded-xl bg-white text-slate-900 border border-white/10"
                            />

                            <button
                                onClick={() => load(date)}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/10 text-white hover:bg-white/15 transition disabled:opacity-60"
                            >
                                <RefreshCcw
                                    size={16}
                                    className={loading ? "animate-spin" : ""}
                                />
                                {loading ? "Loading" : "Refresh"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border bg-red-50 text-red-700 p-4">
                    {error}
                </div>
            ) : null}

            <AdminAttendanceSummaryCards
                totalStudents={summary.totalStudents}
                totalPresent={summary.totalPresent}
                totalAbsent={summary.totalAbsent}
                attendancePercentage={summary.attendancePercentage}
            />

            {loading ? (
                <div className="rounded-3xl border bg-white shadow-sm p-6 text-slate-600">
                    Loading attendance records...
                </div>
            ) : (
                <AdminAttendanceClassTable rows={rows} date={date} />
            )}
        </div>
    );
}
