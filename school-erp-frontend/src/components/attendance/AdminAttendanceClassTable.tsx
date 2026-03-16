"use client";

import Link from "next/link";
import { Eye, Mail } from "lucide-react";

type Row = {
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

export default function AdminAttendanceClassTable({
    rows,
    date,
}: {
    rows: Row[];
    date: string;
}) {
    return (
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900">
                    Class-wise Attendance
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Review class attendance summary for {date}
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="sticky top-0 z-10 bg-slate-50 border-b">
                        <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-5 py-3">Class</th>
                            <th className="px-5 py-3">Teacher</th>
                            <th className="px-5 py-3">Students</th>
                            <th className="px-5 py-3">Present</th>
                            <th className="px-5 py-3">Absent</th>
                            <th className="px-5 py-3">Attendance %</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-5 py-6 text-slate-600"
                                >
                                    No attendance records found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => (
                                <tr
                                    key={row.classId}
                                    className={
                                        idx % 2 === 0
                                            ? "bg-white"
                                            : "bg-slate-50/40"
                                    }
                                >
                                    <td className="px-5 py-4 align-top">
                                        <div className="font-semibold text-slate-900">
                                            {row.className} {row.section || ""}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 align-top min-w-[220px]">
                                        <div className="font-medium text-slate-900">
                                            {row.classTeacher?.name ||
                                                "Not assigned"}
                                        </div>
                                        <div className="mt-1 text-sm text-slate-500 inline-flex items-center gap-2">
                                            <Mail size={14} />
                                            <span className="break-all">
                                                {row.classTeacher?.email || "-"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 align-top">
                                        {row.totalStudents}
                                    </td>

                                    <td className="px-5 py-4 align-top text-green-600 font-semibold">
                                        {row.present}
                                    </td>

                                    <td className="px-5 py-4 align-top text-red-600 font-semibold">
                                        {row.absent}
                                    </td>

                                    <td className="px-5 py-4 align-top">
                                        {row.percentage}%
                                    </td>

                                    <td className="px-5 py-4 align-top">
                                        {row.marked ? (
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-semibold whitespace-nowrap">
                                                Marked
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 text-sm font-semibold whitespace-nowrap">
                                                Not Marked
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-5 py-4 align-top">
                                        <Link
                                            href={`/dashboard/attendance/${row.classId}?date=${date}`}
                                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold whitespace-nowrap"
                                        >
                                            <Eye size={16} />
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
