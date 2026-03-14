"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyHomework, submitHomework } from "@/services/api";
import {
    CalendarDays,
    Download,
    Upload,
    BadgeCheck,
    AlertCircle,
    BookOpen,
} from "lucide-react";

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

const FILE_BASE = "http://localhost:5000";

export default function StudentHomeworkOnlyPage() {
    const [role, setRole] = useState<string>("");
    const [homework, setHomework] = useState<HomeworkItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState<string | null>(null);
    const [files, setFiles] = useState<Record<string, File | null>>({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token) return;
        setRole(userRole || "");
        loadHomework(token);
    }, []);

    const loadHomework = async (token: string) => {
        try {
            setLoading(true);
            const data = await getMyHomework(token);
            setHomework(Array.isArray(data) ? data : data.list || []);
        } catch {
            setHomework([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (homeworkId: string, file: File | null) => {
        setFiles((prev) => ({ ...prev, [homeworkId]: file }));
    };

    const handleSubmitHomework = async (homeworkId: string) => {
        try {
            const token = localStorage.getItem("token");
            const file = files[homeworkId];

            if (!token) return;
            if (!file) return alert("Please choose a file first");

            const fd = new FormData();
            fd.append("homeworkId", homeworkId);
            fd.append("file", file);

            setSubmittingId(homeworkId);
            await submitHomework(token, fd);
            alert("Homework submitted successfully");

            setFiles((prev) => ({ ...prev, [homeworkId]: null }));
        } catch (e: any) {
            alert(e?.message || "Submission failed");
        } finally {
            setSubmittingId(null);
        }
    };

    const sortedHomework = useMemo(() => {
        return [...homework].sort(
            (a, b) =>
                new Date(b.createdAt || "").getTime() -
                new Date(a.createdAt || "").getTime(),
        );
    }, [homework]);

    return (
        <div className="min-h-screen">
            <div className="border-b bg-white">
                <div className="px-4 md:px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Homework
                            </h1>
                            <p className="mt-2 text-slate-600">
                                {role === "parent"
                                    ? "View all homework assigned to your child."
                                    : "View assignments, download files, and submit your work."}
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium capitalize w-fit">
                            {role === "parent" ? "Parent view" : "Student view"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 md:p-6">
                <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b bg-slate-50">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Assigned Homework
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Latest homework from your teachers
                        </p>
                    </div>

                    {loading ? (
                        <div className="p-6 text-slate-600">
                            Loading homework...
                        </div>
                    ) : sortedHomework.length === 0 ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                                <BookOpen
                                    className="text-slate-500"
                                    size={22}
                                />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                No homework found
                            </h3>
                            <p className="text-sm text-slate-600 mt-1">
                                Assigned homework will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {sortedHomework.map((item) => (
                                <div key={item._id} className="p-5">
                                    <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
                                        <div className="flex-1">
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

                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                                                {item.createdAt ? (
                                                    <span className="inline-flex items-center gap-1">
                                                        <CalendarDays
                                                            size={14}
                                                        />
                                                        Posted{" "}
                                                        {new Date(
                                                            item.createdAt,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                ) : null}

                                                {item.fileUrl ? (
                                                    <span className="inline-flex items-center gap-1 text-emerald-700">
                                                        <BadgeCheck size={14} />
                                                        File available
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-slate-400">
                                                        <AlertCircle
                                                            size={14}
                                                        />
                                                        No file attached
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-[320px] space-y-3">
                                            {item.fileUrl ? (
                                                <a
                                                    href={`${FILE_BASE}${item.fileUrl}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border hover:bg-slate-50 text-slate-800"
                                                >
                                                    <Download size={17} />
                                                    Download{" "}
                                                    {item.fileName
                                                        ? item.fileName
                                                        : "File"}
                                                </a>
                                            ) : (
                                                <div className="w-full px-4 py-3 rounded-xl bg-slate-50 text-sm text-slate-500 border">
                                                    No file uploaded
                                                </div>
                                            )}

                                            {role === "student" ? (
                                                <div className="rounded-2xl border p-4 bg-slate-50">
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                        Submit Homework
                                                    </label>

                                                    <input
                                                        type="file"
                                                        id={`file-${item._id}`}
                                                        accept=".pdf,image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleFileChange(
                                                                item._id,
                                                                e.target
                                                                    .files?.[0] ||
                                                                    null,
                                                            )
                                                        }
                                                    />

                                                    <label
                                                        htmlFor={`file-${item._id}`}
                                                        className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border bg-white hover:bg-slate-50 text-slate-800"
                                                    >
                                                        <Upload size={16} />
                                                        Choose File
                                                    </label>

                                                    <div className="mt-2 text-sm text-slate-500 break-all">
                                                        {files[item._id]
                                                            ?.name ||
                                                            "No file selected"}
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            handleSubmitHomework(
                                                                item._id,
                                                            )
                                                        }
                                                        disabled={
                                                            submittingId ===
                                                                item._id ||
                                                            !files[item._id]
                                                        }
                                                        className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60"
                                                    >
                                                        <Upload size={17} />
                                                        {submittingId ===
                                                        item._id
                                                            ? "Submitting..."
                                                            : "Submit Homework"}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="rounded-2xl border p-4 bg-slate-50 text-sm text-slate-600">
                                                    Parent account can only view
                                                    homework and files.
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
