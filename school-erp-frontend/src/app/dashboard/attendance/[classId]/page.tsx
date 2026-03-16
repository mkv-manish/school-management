"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { getAdminAttendanceClassDetails } from "@/services/api";

type ClassData = {
    class?: {
        _id?: string;
        className?: string;
        section?: string;
        classTeacher?: {
            _id?: string;
            name?: string;
            email?: string;
        } | null;
    };
    attendanceMeta?: {
        _id?: string;
        markedBy?: {
            _id?: string;
            name?: string;
            email?: string;
        } | null;
        markedAt?: string;
    } | null;
    summary?: {
        totalStudents: number;
        present: number;
        absent: number;
        notMarked: number;
        percentage: number;
    };
    records?: {
        studentId: string;
        userId?: string;
        name: string;
        email: string;
        fatherName?: string;
        motherName?: string;
        contactNumber?: string;
        status: "present" | "absent" | "not-marked";
    }[];
};

export default function AdminAttendanceClassDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const classId = String(params.classId);
    const initialDate =
        searchParams.get("date") || new Date().toISOString().split("T")[0];

    const [date, setDate] = useState(initialDate);
    const [data, setData] = useState<ClassData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = async (selectedDate: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            setError("");
            const res = await getAdminAttendanceClassDetails(
                token,
                classId,
                selectedDate,
            );
            setData(res);
        } catch (e: any) {
            setError(e?.message || "Failed to load class attendance");
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(date);
    }, [classId]);

    return (
        <div className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-sm">
                <div className="p-5 md:p-7 flex flex-col gap-5">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <Link
                                href="/dashboard/attendance"
                                className="inline-flex items-center gap-2 text-sm text-slate-200 hover:text-white"
                            >
                                <ArrowLeft size={16} />
                                Back to Attendance
                            </Link>

                            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                                {data?.class?.className || "-"}{" "}
                                {data?.class?.section || ""}
                            </h1>

                            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
                                Review class-wise student attendance details.
                            </p>
                        </div>

                        <div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    load(e.target.value);
                                }}
                                className="px-4 py-3 rounded-xl bg-white text-slate-900 border border-white/10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border bg-red-50 text-red-700 p-4">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="rounded-3xl border bg-white shadow-sm p-6 text-slate-600">
                    Loading class attendance...
                </div>
            ) : data ? (
                <>
                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                        <InfoCard
                            label="Students"
                            value={String(data.summary?.totalStudents || 0)}
                        />
                        <InfoCard
                            label="Present"
                            value={String(data.summary?.present || 0)}
                        />
                        <InfoCard
                            label="Absent"
                            value={String(data.summary?.absent || 0)}
                        />
                        <InfoCard
                            label="Attendance %"
                            value={`${data.summary?.percentage || 0}%`}
                        />
                    </div>

                    <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b bg-slate-50">
                            <h2 className="text-lg font-semibold text-slate-900">
                                Student Attendance Records
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {data.attendanceMeta?.markedBy?.name
                                    ? `Marked by ${data.attendanceMeta.markedBy.name}`
                                    : "Attendance not marked yet"}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="sticky top-0 z-10 bg-slate-50 border-b">
                                    <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                        <th className="px-5 py-3">Student</th>
                                        <th className="px-5 py-3">Email</th>
                                        <th className="px-5 py-3">Father</th>
                                        <th className="px-5 py-3">Mother</th>
                                        <th className="px-5 py-3">Contact</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {data.records?.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-5 py-6 text-slate-600"
                                            >
                                                No student records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        data.records?.map((row, idx) => (
                                            <tr
                                                key={row.studentId}
                                                className={
                                                    idx % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-slate-50/40"
                                                }
                                            >
                                                <td className="px-5 py-4 align-top font-medium text-slate-900">
                                                    {row.name}
                                                </td>

                                                <td className="px-5 py-4 align-top text-slate-600">
                                                    <div className="inline-flex items-center gap-2">
                                                        <Mail
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {row.email}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top text-slate-600">
                                                    {row.fatherName || "-"}
                                                </td>

                                                <td className="px-5 py-4 align-top text-slate-600">
                                                    {row.motherName || "-"}
                                                </td>

                                                <td className="px-5 py-4 align-top text-slate-600">
                                                    <div className="inline-flex items-center gap-2">
                                                        <Phone
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {row.contactNumber ||
                                                            "-"}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    {row.status ===
                                                    "present" ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-semibold whitespace-nowrap">
                                                            Present
                                                        </span>
                                                    ) : row.status ===
                                                      "absent" ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm font-semibold whitespace-nowrap">
                                                            Absent
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 text-sm font-semibold whitespace-nowrap">
                                                            Not Marked
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="text-sm text-slate-500 font-medium">{label}</div>
            <div className="mt-3 text-2xl font-bold text-slate-900">
                {value}
            </div>
        </div>
    );
}
