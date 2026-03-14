"use client";

import { useEffect, useMemo, useState } from "react";
import {
    createHomework,
    deleteHomework,
    getTeacherHomework,
} from "@/services/api";
import {
    FileUp,
    NotebookPen,
    RefreshCcw,
    CalendarDays,
    FileText,
    Trash2,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";

type HW = {
    _id: string;
    title: string;
    description?: string;
    type: "note" | "pdf" | "image";
    noteText?: string;
    fileUrl?: string;
    fileName?: string;
    dueDate?: string;
    createdAt: string;
};

export default function TeacherHomeworkPage() {
    const [token, setToken] = useState<string | null>(null);

    const [classInfo, setClassInfo] = useState<any>(null);
    const [list, setList] = useState<HW[]>([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    const [deletingId, setDeletingId] = useState<string | null>(null);

    const [type, setType] = useState<"note" | "pdf" | "image">("note");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [noteText, setNoteText] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const fileHint = useMemo(() => {
        if (file) return file.name;
        if (type === "pdf") return "Upload PDF (max 5MB)";
        if (type === "image") return "Upload Image (jpg, png, webp)";
        return "";
    }, [file, type]);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const load = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError("");
            const data = await getTeacherHomework(token);
            setClassInfo(data.class);
            setList(data.list || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load homework");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const onSubmit = async () => {
        if (!token) return;
        if (!title.trim()) return alert("Title required");

        if (type === "note" && !noteText.trim()) {
            return alert("Note text required");
        }
        if (type === "pdf" && !file) {
            return alert("PDF file required");
        }
        if (type === "image" && !file) {
            return alert("Image file required");
        }

        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        fd.append("type", type);
        if (dueDate) fd.append("dueDate", dueDate);

        if (type === "note") fd.append("noteText", noteText.trim());
        if ((type === "pdf" || type === "image") && file) {
            fd.append("file", file);
        }

        try {
            setPosting(true);
            await createHomework(token, fd);

            setTitle("");
            setDescription("");
            setNoteText("");
            setDueDate("");
            setFile(null);
            setType("note");

            await load();
            alert("Homework posted ✅");
        } catch (e: any) {
            alert(e?.message || "Post failed");
        } finally {
            setPosting(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!token) return;
        const ok = confirm("Delete this homework?");
        if (!ok) return;

        try {
            setDeletingId(id);
            await deleteHomework(token, id);
            await load();
        } catch (e: any) {
            alert(e?.message || "Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Homework</h1>
                        <p className="text-sm opacity-80 mt-1">
                            Create homework for your assigned class (note, PDF,
                            or image).
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
                        onClick={load}
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

            {/* Create */}
            <div className="rounded-2xl border bg-white shadow-sm p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="font-semibold text-slate-900">
                        Create Homework
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setType("note")}
                            className={[
                                "px-4 py-2 rounded-xl border font-semibold text-sm inline-flex items-center gap-2",
                                type === "note"
                                    ? "bg-slate-900 text-white"
                                    : "bg-white hover:bg-slate-50",
                            ].join(" ")}
                        >
                            <NotebookPen size={16} /> Note
                        </button>

                        <button
                            onClick={() => setType("pdf")}
                            className={[
                                "px-4 py-2 rounded-xl border font-semibold text-sm inline-flex items-center gap-2",
                                type === "pdf"
                                    ? "bg-slate-900 text-white"
                                    : "bg-white hover:bg-slate-50",
                            ].join(" ")}
                        >
                            <FileUp size={16} /> PDF
                        </button>

                        <button
                            onClick={() => setType("image")}
                            className={[
                                "px-4 py-2 rounded-xl border font-semibold text-sm inline-flex items-center gap-2",
                                type === "image"
                                    ? "bg-slate-900 text-white"
                                    : "bg-white hover:bg-slate-50",
                            ].join(" ")}
                        >
                            <ImageIcon size={16} /> Image
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <input
                            className="w-full border rounded-xl p-3"
                            placeholder="Title *"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            className="w-full min-h-[110px] border rounded-xl p-3"
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <div className="relative">
                            <CalendarDays
                                size={16}
                                className="absolute left-3 top-3.5 text-slate-400"
                            />
                            <input
                                type="date"
                                className="w-full border rounded-xl p-3 pl-9"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        {type === "pdf" || type === "image" ? (
                            <label className="w-full border rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                                <FileText
                                    size={18}
                                    className="text-slate-600"
                                />
                                <span className="text-sm text-slate-700">
                                    {fileHint}
                                </span>
                                <input
                                    type="file"
                                    accept={
                                        type === "pdf"
                                            ? "application/pdf"
                                            : "image/*"
                                    }
                                    className="hidden"
                                    onChange={(e) =>
                                        setFile(e.target.files?.[0] || null)
                                    }
                                />
                            </label>
                        ) : null}

                        <button
                            onClick={onSubmit}
                            disabled={posting}
                            className="w-full md:w-auto px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                        >
                            {posting ? "Posting..." : "Post Homework"}
                        </button>
                    </div>

                    <div>
                        {type === "note" ? (
                            <textarea
                                className="w-full min-h-[260px] border rounded-xl p-3"
                                placeholder="Write note text *"
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                            />
                        ) : (
                            <div className="rounded-2xl border bg-slate-50 p-5 text-slate-700">
                                <div className="font-semibold">
                                    {type === "pdf"
                                        ? "PDF Instructions"
                                        : "Image Instructions"}
                                </div>
                                <ul className="list-disc ml-5 mt-2 text-sm">
                                    <li>
                                        {type === "pdf"
                                            ? "Only PDF allowed"
                                            : "JPG, PNG, WEBP images allowed"}
                                    </li>
                                    <li>Max size 5MB</li>
                                    <li>
                                        Students/Parents will be able to view or
                                        download it
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-slate-600">
                        Loading homework...
                    </div>
                ) : list.length === 0 ? (
                    <div className="p-6 text-slate-600">
                        No homework posted yet.
                    </div>
                ) : (
                    <div className="divide-y">
                        {list.map((h) => (
                            <div key={h._id} className="p-5 md:p-6">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-lg font-bold text-slate-900">
                                            {h.title}
                                        </div>

                                        <div className="text-sm text-slate-500 mt-1">
                                            Type:{" "}
                                            <span className="font-semibold">
                                                {h.type}
                                            </span>
                                            {h.dueDate ? (
                                                <>
                                                    {" "}
                                                    • Due:{" "}
                                                    <span className="font-semibold">
                                                        {h.dueDate}
                                                    </span>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-xs text-slate-500">
                                            {new Date(
                                                h.createdAt,
                                            ).toLocaleString()}
                                        </div>

                                        <button
                                            onClick={() => onDelete(h._id)}
                                            disabled={deletingId === h._id}
                                            className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold hover:underline disabled:opacity-60"
                                        >
                                            {deletingId === h._id ? (
                                                <Loader2
                                                    size={16}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {h.description ? (
                                    <p className="text-slate-700 mt-3 whitespace-pre-line">
                                        {h.description}
                                    </p>
                                ) : null}

                                {h.type === "note" ? (
                                    <div className="mt-4 rounded-2xl border bg-slate-50 p-4 text-slate-800 whitespace-pre-line">
                                        {h.noteText}
                                    </div>
                                ) : h.type === "pdf" && h.fileUrl ? (
                                    <div className="mt-4">
                                        <a
                                            href={`http://localhost:5000${h.fileUrl}`}
                                            target="_blank"
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                                            rel="noreferrer"
                                        >
                                            <FileText size={18} />
                                            Download PDF{" "}
                                            {h.fileName
                                                ? `(${h.fileName})`
                                                : ""}
                                        </a>
                                    </div>
                                ) : h.type === "image" && h.fileUrl ? (
                                    <div className="mt-4">
                                        <img
                                            src={`http://localhost:5000${h.fileUrl}`}
                                            alt={h.title}
                                            className="rounded-2xl border max-h-80 object-contain"
                                        />
                                        <div className="mt-3">
                                            <a
                                                href={`http://localhost:5000${h.fileUrl}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                                                rel="noreferrer"
                                            >
                                                <FileText size={18} />
                                                Open Image{" "}
                                                {h.fileName
                                                    ? `(${h.fileName})`
                                                    : ""}
                                            </a>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
