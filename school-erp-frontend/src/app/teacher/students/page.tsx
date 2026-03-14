"use client";

import { useEffect, useState } from "react";
import { getMyClassStudents } from "@/services/api";
import { Users, Mail, GraduationCap, RefreshCcw } from "lucide-react";

type StudentRow = {
    _id: string;
    fatherName?: string;
    motherName?: string;
    contactNumber?: string;
    address?: string;
    userId?: {
        name?: string;
        email?: string;
        approved?: boolean;
    };
};

export default function TeacherStudentsPage() {
    const [classInfo, setClassInfo] = useState<any>(null);
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStudents = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);
            setError("");

            const data = await getMyClassStudents(token);
            setClassInfo(data.class || null);
            setStudents(data.students || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load students");
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">My Students</h1>
                        <p className="text-sm opacity-80 mt-1">
                            View students from your assigned class.
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
                        onClick={loadStudents}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20"
                    >
                        <RefreshCcw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {error ? (
                <div className="rounded-2xl border bg-red-50 text-red-700 p-4">
                    {error}
                </div>
            ) : null}

            {/* Summary */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-slate-500">
                            Assigned Class
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {classInfo
                                ? `${classInfo.className} ${classInfo.section || ""}`
                                : "Not Assigned"}
                        </div>
                    </div>
                    <GraduationCap className="text-slate-400" size={36} />
                </div>

                <div className="bg-white border rounded-2xl shadow-sm p-6 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-slate-500">
                            Total Students
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {students.length}
                        </div>
                    </div>
                    <Users className="text-slate-400" size={36} />
                </div>
            </div>

            {/* Students List */}
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Students List
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        All students in your class
                    </p>
                </div>

                {loading ? (
                    <div className="p-6 text-slate-600">
                        Loading students...
                    </div>
                ) : students.length === 0 ? (
                    <div className="p-6 text-slate-600">No students found.</div>
                ) : (
                    <div className="divide-y">
                        {students.map((student) => (
                            <div key={student._id} className="p-5">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div>
                                        <div className="text-lg font-semibold text-slate-900">
                                            {student.userId?.name ||
                                                "Unnamed Student"}
                                        </div>

                                        <div className="mt-2 text-sm text-slate-500 inline-flex items-center gap-2">
                                            <Mail size={14} />
                                            {student.userId?.email ||
                                                "No email"}
                                        </div>

                                        <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-slate-600">
                                            <div>
                                                <span className="font-medium">
                                                    Father:
                                                </span>{" "}
                                                {student.fatherName || "-"}
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Mother:
                                                </span>{" "}
                                                {student.motherName || "-"}
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Contact:
                                                </span>{" "}
                                                {student.contactNumber || "-"}
                                            </div>
                                            <div>
                                                <span className="font-medium">
                                                    Status:
                                                </span>{" "}
                                                {student.userId?.approved
                                                    ? "Approved"
                                                    : "Pending"}
                                            </div>
                                        </div>

                                        {student.address ? (
                                            <div className="mt-2 text-sm text-slate-600">
                                                <span className="font-medium">
                                                    Address:
                                                </span>{" "}
                                                {student.address}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div>
                                        <span
                                            className={[
                                                "px-3 py-1.5 rounded-xl text-sm font-semibold border",
                                                student.userId?.approved
                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                    : "bg-amber-50 text-amber-700 border-amber-100",
                                            ].join(" ")}
                                        >
                                            {student.userId?.approved
                                                ? "Approved"
                                                : "Pending"}
                                        </span>
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
