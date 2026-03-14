"use client";

import { useEffect, useState } from "react";
import { getTeacherHomework, getHomeworkSubmissions } from "@/services/api";
import { FileText, Download, Clock3, Users, CheckCircle2 } from "lucide-react";

type HomeworkRow = {
    _id: string;
    title: string;
    type: "note" | "pdf";
    dueDate?: string;
    createdAt: string;
};

type SubmissionRow = {
    _id: string;
    studentId?: {
        _id?: string;
        name?: string;
        email?: string;
    };
    fileUrl?: string;
    fileName?: string;
    submittedAt?: string;
    marks?: number;
    feedback?: string;
};

const FILE_BASE = "http://localhost:5000";

export default function TeacherSubmissionsPage() {
    const [token, setToken] = useState<string | null>(null);

    const [homeworkList, setHomeworkList] = useState<HomeworkRow[]>([]);
    const [selectedHomeworkId, setSelectedHomeworkId] = useState<string>("");
    const [selectedHomeworkTitle, setSelectedHomeworkTitle] =
        useState<string>("");

    const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
    const [loadingHomework, setLoadingHomework] = useState(true);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    useEffect(() => {
        if (!token) return;

        (async () => {
            try {
                setLoadingHomework(true);
                setError("");

                const data = await getTeacherHomework(token);
                const list = data.list || [];
                setHomeworkList(list);

                if (list.length > 0) {
                    setSelectedHomeworkId(list[0]._id);
                    setSelectedHomeworkTitle(list[0].title);
                }
            } catch (e: any) {
                setError(e?.message || "Failed to load homework");
            } finally {
                setLoadingHomework(false);
            }
        })();
    }, [token]);

    useEffect(() => {
        if (!token || !selectedHomeworkId) return;

        (async () => {
            try {
                setLoadingSubmissions(true);
                setError("");
                const data = await getHomeworkSubmissions(
                    token,
                    selectedHomeworkId,
                );
                setSubmissions(data.list || []);
            } catch (e: any) {
                setError(e?.message || "Failed to load submissions");
                setSubmissions([]);
            } finally {
                setLoadingSubmissions(false);
            }
        })();
    }, [token, selectedHomeworkId]);

    const onSelectHomework = (hw: HomeworkRow) => {
        setSelectedHomeworkId(hw._id);
        setSelectedHomeworkTitle(hw.title);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Homework Submissions</h1>
                <p className="text-sm opacity-80 mt-1">
                    View student submissions for the homework you posted.
                </p>
            </div>

            {error ? (
                <div className="rounded-2xl border bg-red-50 text-red-700 p-4">
                    {error}
                </div>
            ) : null}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Homework list */}
                <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Your Homework
                        </h2>
                    </div>

                    {loadingHomework ? (
                        <div className="p-6 text-slate-600">
                            Loading homework...
                        </div>
                    ) : homeworkList.length === 0 ? (
                        <div className="p-6 text-slate-600">
                            No homework found.
                        </div>
                    ) : (
                        <div className="divide-y">
                            {homeworkList.map((hw) => (
                                <button
                                    key={hw._id}
                                    onClick={() => onSelectHomework(hw)}
                                    className={[
                                        "w-full text-left p-4 transition",
                                        selectedHomeworkId === hw._id
                                            ? "bg-slate-900 text-white"
                                            : "hover:bg-slate-50 text-slate-900",
                                    ].join(" ")}
                                >
                                    <div className="font-semibold">
                                        {hw.title}
                                    </div>
                                    <div
                                        className={[
                                            "text-xs mt-1",
                                            selectedHomeworkId === hw._id
                                                ? "text-slate-200"
                                                : "text-slate-500",
                                        ].join(" ")}
                                    >
                                        {hw.type.toUpperCase()}
                                        {hw.dueDate
                                            ? ` • Due: ${hw.dueDate}`
                                            : ""}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submission list */}
                <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Submissions
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {selectedHomeworkTitle ||
                                    "Select homework to view submissions"}
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                            <Users size={16} />
                            {submissions.length} Submitted
                        </div>
                    </div>

                    {!selectedHomeworkId ? (
                        <div className="p-6 text-slate-600">
                            Select a homework item first.
                        </div>
                    ) : loadingSubmissions ? (
                        <div className="p-6 text-slate-600">
                            Loading submissions...
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                <FileText
                                    className="text-slate-500"
                                    size={22}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                No submissions yet
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Students have not submitted this homework yet.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {submissions.map((row) => (
                                <div key={row._id} className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2
                                                    size={18}
                                                    className="text-emerald-600"
                                                />
                                                <div className="font-semibold text-slate-900">
                                                    {row.studentId?.name ||
                                                        "Unknown Student"}
                                                </div>
                                            </div>

                                            <div className="text-sm text-slate-500">
                                                {row.studentId?.email ||
                                                    "No email"}
                                            </div>

                                            <div className="text-sm text-slate-500 inline-flex items-center gap-2">
                                                <Clock3 size={14} />
                                                {row.submittedAt
                                                    ? new Date(
                                                          row.submittedAt,
                                                      ).toLocaleString()
                                                    : "Unknown submission time"}
                                            </div>

                                            {(row.marks || row.feedback) && (
                                                <div className="mt-2 rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
                                                    {row.marks !== undefined ? (
                                                        <div>
                                                            <span className="font-semibold">
                                                                Marks:
                                                            </span>{" "}
                                                            {row.marks}
                                                        </div>
                                                    ) : null}
                                                    {row.feedback ? (
                                                        <div className="mt-1">
                                                            <span className="font-semibold">
                                                                Feedback:
                                                            </span>{" "}
                                                            {row.feedback}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>

                                        <div className="w-full md:w-auto">
                                            {row.fileUrl ? (
                                                <a
                                                    href={`${FILE_BASE}${row.fileUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border hover:bg-slate-50 text-slate-800 font-semibold"
                                                >
                                                    <Download size={16} />
                                                    Download{" "}
                                                    {row.fileName
                                                        ? row.fileName
                                                        : "File"}
                                                </a>
                                            ) : (
                                                <div className="text-sm text-slate-500">
                                                    No file uploaded
                                                </div>
                                            )}
                                        </div>
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
