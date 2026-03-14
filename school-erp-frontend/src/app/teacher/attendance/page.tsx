"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getAttendanceByDate,
    getAttendanceHistory,
    getMyClassStudents,
    saveAttendance,
} from "@/services/api";
import {
    CalendarDays,
    CheckCircle2,
    RefreshCcw,
    Save,
    XCircle,
} from "lucide-react";

type StudentRow = {
    _id: string;
    userId?: { name: string; email: string };
};

type AttendanceDoc = {
    _id: string;
    date: string;
    records: { studentId: string; status: "present" | "absent" }[];
};

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function TeacherAttendancePage() {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const [classInfo, setClassInfo] = useState<any>(null);
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [history, setHistory] = useState<AttendanceDoc[]>([]);

    const [date, setDate] = useState(todayISO());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // local attendance state
    const [statusMap, setStatusMap] = useState<
        Record<string, "present" | "absent">
    >({});

    const loadStudentsAndHistory = async () => {
        if (!token) return;

        try {
            setLoading(true);
            setError("");

            const [sData, hData] = await Promise.all([
                getMyClassStudents(token),
                getAttendanceHistory(token),
            ]);

            setClassInfo(sData.class);
            setStudents(sData.students || []);
            setHistory(hData.history || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load attendance module");
        } finally {
            setLoading(false);
        }
    };

    const loadAttendanceForDate = async (d: string) => {
        if (!token) return;
        try {
            setError("");
            const aData = await getAttendanceByDate(token, d);
            const doc = aData.attendance as AttendanceDoc | null;

            if (doc?.records?.length) {
                const map: Record<string, "present" | "absent"> = {};
                doc.records.forEach((r) => (map[r.studentId] = r.status));
                setStatusMap(map);
            } else {
                // default: all present
                const map: Record<string, "present" | "absent"> = {};
                students.forEach((s) => (map[s._id] = "present"));
                setStatusMap(map);
            }
        } catch (e: any) {
            setError(e?.message || "Failed to load attendance for date");
        }
    };

    useEffect(() => {
        loadStudentsAndHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // when students loaded or date changes, load attendance doc
    useEffect(() => {
        if (students.length === 0) return;
        loadAttendanceForDate(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, students.length]);

    const presentCount = useMemo(
        () => Object.values(statusMap).filter((s) => s === "present").length,
        [statusMap],
    );
    const absentCount = useMemo(
        () => Object.values(statusMap).filter((s) => s === "absent").length,
        [statusMap],
    );

    const setAll = (val: "present" | "absent") => {
        const map: Record<string, "present" | "absent"> = {};
        students.forEach((s) => (map[s._id] = val));
        setStatusMap(map);
    };

    const toggle = (id: string, val: "present" | "absent") => {
        setStatusMap((p) => ({ ...p, [id]: val }));
    };

    const onSave = async () => {
        if (!token) return;
        if (!date) return alert("Select date");
        if (students.length === 0) return alert("No students in class");

        try {
            setSaving(true);

            const records = students.map((s) => ({
                studentId: s._id,
                status: statusMap[s._id] || "present",
            }));

            await saveAttendance(token, { date, records });

            // refresh history
            const hData = await getAttendanceHistory(token);
            setHistory(hData.history || []);

            alert("Attendance saved ✅");
        } catch (e: any) {
            alert(e?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Attendance</h1>
                        <p className="text-sm opacity-80 mt-1">
                            Mark daily attendance for your assigned class.
                        </p>
                        <div className="mt-3 text-sm">
                            Class:{" "}
                            <span className="font-semibold">
                                {classInfo
                                    ? `${classInfo.className} ${classInfo.section || ""}`
                                    : "-"}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={loadStudentsAndHistory}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20"
                        disabled={loading}
                    >
                        <RefreshCcw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Error */}
            {error ? (
                <div className="rounded-2xl border bg-red-50 text-red-700 p-4">
                    {error}
                </div>
            ) : null}

            {/* Controls */}
            <div className="grid lg:grid-cols-3 gap-5">
                <div className="rounded-2xl border bg-white shadow-sm p-5 space-y-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <CalendarDays size={18} />
                        Select Date
                    </div>

                    <input
                        type="date"
                        className="w-full border rounded-xl p-3"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => setAll("present")}
                            className="flex-1 px-3 py-2 rounded-xl border bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                        >
                            Mark All Present
                        </button>
                        <button
                            onClick={() => setAll("absent")}
                            className="flex-1 px-3 py-2 rounded-xl border bg-red-50 text-red-700 border-red-100 hover:bg-red-100"
                        >
                            Mark All Absent
                        </button>
                    </div>

                    <button
                        onClick={onSave}
                        disabled={saving || loading}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold
            bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Attendance"}
                    </button>
                </div>

                <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="font-semibold text-slate-900">
                            Students
                        </div>

                        <div className="flex gap-2 text-sm">
                            <span className="px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-100 font-semibold">
                                Present: {presentCount}
                            </span>
                            <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-100 font-semibold">
                                Absent: {absentCount}
                            </span>
                            <span className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-semibold">
                                Total: {students.length}
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-6 text-slate-600">
                            Loading students...
                        </div>
                    ) : students.length === 0 ? (
                        <div className="py-6 text-slate-600">
                            No students found in your class.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-slate-50 border-b">
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-4 py-3">Student</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {students.map((s) => {
                                        const status =
                                            statusMap[s._id] || "present";

                                        return (
                                            <tr
                                                key={s._id}
                                                className="hover:bg-slate-50/50"
                                            >
                                                <td className="px-4 py-3 font-semibold text-slate-900">
                                                    {s.userId?.name || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {s.userId?.email || "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                toggle(
                                                                    s._id,
                                                                    "present",
                                                                )
                                                            }
                                                            className={[
                                                                "inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition",
                                                                status ===
                                                                "present"
                                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                                    : "bg-white hover:bg-slate-50",
                                                            ].join(" ")}
                                                        >
                                                            <CheckCircle2
                                                                size={16}
                                                            />
                                                            Present
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                toggle(
                                                                    s._id,
                                                                    "absent",
                                                                )
                                                            }
                                                            className={[
                                                                "inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition",
                                                                status ===
                                                                "absent"
                                                                    ? "bg-red-50 text-red-700 border-red-100"
                                                                    : "bg-white hover:bg-slate-50",
                                                            ].join(" ")}
                                                        >
                                                            <XCircle
                                                                size={16}
                                                            />
                                                            Absent
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* History */}
            <div className="rounded-2xl border bg-white shadow-sm p-5">
                <div className="font-semibold text-slate-900 mb-3">
                    Recent History
                </div>
                {history.length === 0 ? (
                    <div className="text-slate-600">
                        No attendance history yet.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {history.map((h) => (
                            <button
                                key={h._id}
                                onClick={() => setDate(h.date)}
                                className="text-left rounded-2xl border p-4 hover:bg-slate-50 transition"
                            >
                                <div className="font-semibold text-slate-900">
                                    {h.date}
                                </div>
                                <div className="text-sm text-slate-600 mt-1">
                                    Records: {h.records?.length || 0}
                                </div>
                                <div className="text-xs text-slate-500 mt-2">
                                    Click to open
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
