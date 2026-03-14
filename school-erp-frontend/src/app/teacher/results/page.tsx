"use client";

import { useEffect, useMemo, useState } from "react";
import { addResult, getMyClassStudents } from "@/services/api";
import { GraduationCap, Save, RefreshCcw, Trophy } from "lucide-react";

type StudentRow = {
    _id: string;
    userId?: {
        name?: string;
        email?: string;
    };
    classId?: {
        _id?: string;
        className?: string;
        section?: string;
    };
};

export default function TeacherResultsPage() {
    const [token, setToken] = useState<string | null>(null);

    const [classInfo, setClassInfo] = useState<any>(null);
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        studentId: "",
        subject: "",
        marksObtained: "",
        totalMarks: "",
        examType: "midterm" as "midterm" | "final" | "unit-test",
    });

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const loadStudents = async () => {
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
        if (!token) return;
        loadStudents();
    }, [token]);

    const selectedStudent = useMemo(() => {
        return students.find((s) => s._id === form.studentId) || null;
    }, [students, form.studentId]);

    const onChange = (key: string, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onSubmit = async () => {
        if (!token) return;

        if (!form.studentId) return alert("Please select student");
        if (!form.subject.trim()) return alert("Please enter subject");
        if (!form.marksObtained) return alert("Please enter obtained marks");
        if (!form.totalMarks) return alert("Please enter total marks");

        const marksObtained = Number(form.marksObtained);
        const totalMarks = Number(form.totalMarks);

        if (Number.isNaN(marksObtained) || Number.isNaN(totalMarks)) {
            return alert("Marks must be valid numbers");
        }

        if (marksObtained < 0 || totalMarks <= 0) {
            return alert("Marks values are invalid");
        }

        if (marksObtained > totalMarks) {
            return alert("Obtained marks cannot be greater than total marks");
        }

        if (!classInfo?._id) {
            return alert("No assigned class found");
        }

        try {
            setSaving(true);

            await addResult(token, {
                studentId: form.studentId,
                classId: classInfo._id,
                subject: form.subject.trim(),
                marksObtained,
                totalMarks,
                examType: form.examType,
            });

            alert("Result added successfully ✅");

            setForm({
                studentId: "",
                subject: "",
                marksObtained: "",
                totalMarks: "",
                examType: "midterm",
            });
        } catch (e: any) {
            alert(e?.message || "Failed to add result");
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
                        <h1 className="text-2xl font-bold">Add Results</h1>
                        <p className="text-sm opacity-80 mt-1">
                            Add subject-wise marks for students in your assigned
                            class.
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

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm p-5">
                    <div className="font-semibold text-slate-900 mb-4">
                        Enter Student Result
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Student *
                            </label>
                            <select
                                className="mt-1 w-full border rounded-xl p-3 bg-white"
                                value={form.studentId}
                                onChange={(e) =>
                                    onChange("studentId", e.target.value)
                                }
                            >
                                <option value="">-- Select Student --</option>
                                {students.map((student) => (
                                    <option
                                        key={student._id}
                                        value={student._id}
                                    >
                                        {student.userId?.name ||
                                            "Unnamed Student"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Subject *
                            </label>
                            <input
                                className="mt-1 w-full border rounded-xl p-3"
                                placeholder="e.g. Math"
                                value={form.subject}
                                onChange={(e) =>
                                    onChange("subject", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Marks Obtained *
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full border rounded-xl p-3"
                                placeholder="e.g. 78"
                                value={form.marksObtained}
                                onChange={(e) =>
                                    onChange("marksObtained", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Total Marks *
                            </label>
                            <input
                                type="number"
                                className="mt-1 w-full border rounded-xl p-3"
                                placeholder="e.g. 100"
                                value={form.totalMarks}
                                onChange={(e) =>
                                    onChange("totalMarks", e.target.value)
                                }
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700">
                                Exam Type *
                            </label>
                            <select
                                className="mt-1 w-full border rounded-xl p-3 bg-white"
                                value={form.examType}
                                onChange={(e) =>
                                    onChange("examType", e.target.value)
                                }
                            >
                                <option value="midterm">Midterm</option>
                                <option value="final">Final</option>
                                <option value="unit-test">Unit Test</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={onSubmit}
                        disabled={saving || loading}
                        className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                    >
                        <Save size={18} />
                        {saving ? "Saving..." : "Save Result"}
                    </button>
                </div>

                {/* Preview */}
                <div className="rounded-2xl border bg-white shadow-sm p-5">
                    <div className="font-semibold text-slate-900 mb-4">
                        Preview
                    </div>

                    <div className="rounded-2xl border bg-slate-50 p-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 rounded-2xl bg-white border flex items-center justify-center text-slate-700">
                                <GraduationCap size={22} />
                            </div>
                            <div>
                                <div className="font-semibold text-slate-900">
                                    {selectedStudent?.userId?.name ||
                                        "No student selected"}
                                </div>
                                <div className="text-sm text-slate-500">
                                    {selectedStudent?.userId?.email ||
                                        "Select student to preview"}
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-3 text-sm space-y-2">
                            <div>
                                <span className="font-medium text-slate-700">
                                    Subject:
                                </span>{" "}
                                <span className="text-slate-600">
                                    {form.subject || "-"}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">
                                    Marks:
                                </span>{" "}
                                <span className="text-slate-600">
                                    {form.marksObtained || 0} /{" "}
                                    {form.totalMarks || 0}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-700">
                                    Exam:
                                </span>{" "}
                                <span className="text-slate-600 capitalize">
                                    {form.examType}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">
                                <Trophy size={16} />
                                Result Entry Preview
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Students quick list */}
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Students in Assigned Class
                    </h2>
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
                            <div
                                key={student._id}
                                className="p-4 flex items-center justify-between gap-4"
                            >
                                <div>
                                    <div className="font-semibold text-slate-900">
                                        {student.userId?.name ||
                                            "Unnamed Student"}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {student.userId?.email || "No email"}
                                    </div>
                                </div>

                                <button
                                    onClick={() =>
                                        onChange("studentId", student._id)
                                    }
                                    className="px-4 py-2 rounded-xl border hover:bg-slate-50 text-sm font-semibold"
                                >
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
