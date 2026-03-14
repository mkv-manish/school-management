"use client";

import { useEffect, useMemo, useState } from "react";
import { createNotice, deleteNotice, getNotices } from "@/services/api";
import {
    ImagePlus,
    Megaphone,
    RefreshCcw,
    Trash2,
    Loader2,
    Bell,
} from "lucide-react";

type Notice = {
    _id: string;
    title: string;
    description: string;
    audience: "all" | "student" | "teacher" | "parent";
    imageUrl?: string;
    createdAt: string;
    createdBy?: { name: string; role: string };
};

const FILE_BASE = "http://localhost:5000";

export default function NoticesPage() {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const role =
        typeof window !== "undefined" ? localStorage.getItem("role") : null;

    const [list, setList] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [audience, setAudience] = useState<Notice["audience"]>("all");
    const [image, setImage] = useState<File | null>(null);

    const imagePreview = useMemo(() => {
        if (!image) return "";
        return URL.createObjectURL(image);
    }, [image]);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const load = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError("");
            const data = await getNotices(token);
            setList(Array.isArray(data) ? data : data?.notices || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load notices");
            setList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = async () => {
        if (!token) return;

        if (!title.trim() || !description.trim()) {
            alert("Title and description are required");
            return;
        }

        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        fd.append("audience", audience);
        if (image) fd.append("image", image);

        try {
            setPosting(true);
            await createNotice(token, fd);

            setTitle("");
            setDescription("");
            setAudience("all");
            setImage(null);

            await load();
            alert("Notice posted ✅");
        } catch (e: any) {
            alert(e?.message || "Failed to post notice");
        } finally {
            setPosting(false);
        }
    };

    const onDelete = async (id: string) => {
        if (!token) return;
        const ok = confirm("Delete this notice?");
        if (!ok) return;

        try {
            setDeletingId(id);
            await deleteNotice(token, id);
            await load();
        } catch (e: any) {
            alert(e?.message || "Failed to delete notice");
        } finally {
            setDeletingId(null);
        }
    };

    const canPost = role === "admin";
    const canDelete = role === "admin";

    return (
        <div className="space-y-5">
            {/* Hero */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-sm">
                <div className="p-5 md:p-7 flex flex-col gap-5">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                                <Megaphone size={16} />
                                Notice Management
                            </div>

                            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                                Notices
                            </h1>

                            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
                                Publish school announcements for students,
                                parents, and teachers from one place.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <MiniCard
                                label="Total Notices"
                                value={String(list.length)}
                            />
                            <MiniCard
                                label="Your Role"
                                value={(role || "-").toUpperCase()}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={load}
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/10 text-white hover:bg-white/15 disabled:opacity-60"
                            disabled={loading}
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

            {/* Create notice */}
            {canPost && (
                <div className="rounded-3xl border bg-white shadow-sm p-5 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="font-semibold text-slate-900">
                                Create Notice
                            </div>
                            <div className="text-sm text-slate-500 mt-1">
                                Post a new announcement for selected audience.
                            </div>
                        </div>
                        <div className="text-xs text-slate-500">
                            Image optional (max 3MB)
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <input
                                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <select
                                className="w-full border rounded-xl p-3 bg-white"
                                value={audience}
                                onChange={(e) =>
                                    setAudience(
                                        e.target.value as Notice["audience"],
                                    )
                                }
                            >
                                <option value="all">All</option>
                                <option value="student">Students</option>
                                <option value="parent">Parents</option>
                                <option value="teacher">Teachers</option>
                            </select>

                            <label className="w-full border rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                                <ImagePlus
                                    size={18}
                                    className="text-slate-600"
                                />
                                <span className="text-sm text-slate-700">
                                    {image
                                        ? image.name
                                        : "Upload image (jpg/png/webp)"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        setImage(e.target.files?.[0] || null)
                                    }
                                />
                            </label>

                            <button
                                onClick={onSubmit}
                                disabled={posting}
                                className="w-full md:w-auto px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                            >
                                {posting ? "Posting..." : "Post Notice"}
                            </button>
                        </div>

                        <div className="space-y-3">
                            <textarea
                                className="w-full min-h-[180px] border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                placeholder="Write description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {imagePreview ? (
                                <div className="rounded-2xl border overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imagePreview}
                                        alt="preview"
                                        className="w-full max-h-56 object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="rounded-2xl border bg-slate-50 p-5 text-sm text-slate-500">
                                    Image preview will appear here.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Notice Feed
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        All published announcements in chronological order.
                    </p>
                </div>

                {error ? (
                    <div className="p-5 text-red-600">{error}</div>
                ) : loading ? (
                    <div className="p-5">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                            Loading notices...
                        </div>
                    </div>
                ) : list.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <Bell className="text-slate-500" size={22} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            No notices yet
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">
                            Posted notices will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {list.map((n) => (
                            <div key={n._id} className="p-5 md:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-lg font-bold text-slate-900">
                                                {n.title}
                                            </div>
                                            <AudienceBadge
                                                audience={n.audience}
                                            />
                                        </div>

                                        <div className="text-sm text-slate-500 mt-2">
                                            Posted by{" "}
                                            <span className="font-semibold text-slate-700">
                                                {n.createdBy?.name || "—"}
                                            </span>
                                            {n.createdBy?.role ? (
                                                <>
                                                    {" "}
                                                    •{" "}
                                                    <span className="capitalize">
                                                        {n.createdBy.role}
                                                    </span>
                                                </>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        <span className="text-xs text-slate-500">
                                            {new Date(
                                                n.createdAt,
                                            ).toLocaleString()}
                                        </span>

                                        {canDelete ? (
                                            <button
                                                onClick={() => onDelete(n._id)}
                                                disabled={deletingId === n._id}
                                                className="inline-flex items-center gap-2 text-red-600 text-sm font-semibold hover:underline disabled:opacity-60"
                                            >
                                                {deletingId === n._id ? (
                                                    <Loader2
                                                        size={16}
                                                        className="animate-spin"
                                                    />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                                Delete
                                            </button>
                                        ) : null}
                                    </div>
                                </div>

                                <p className="text-slate-700 mt-3 whitespace-pre-line">
                                    {n.description}
                                </p>

                                {n.imageUrl ? (
                                    <div className="mt-4 rounded-2xl border overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`${FILE_BASE}${n.imageUrl}`}
                                            alt="notice"
                                            className="w-full max-h-96 object-cover"
                                        />
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

function MiniCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/10 px-4 py-3 min-w-[120px]">
            <div className="text-xs text-slate-200">{label}</div>
            <div className="mt-1 text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

function AudienceBadge({
    audience,
}: {
    audience: "all" | "student" | "teacher" | "parent";
}) {
    const styles =
        audience === "all"
            ? "bg-slate-100 text-slate-700 border-slate-200"
            : audience === "student"
              ? "bg-green-50 text-green-700 border-green-100"
              : audience === "teacher"
                ? "bg-blue-50 text-blue-700 border-blue-100"
                : "bg-amber-50 text-amber-700 border-amber-100";

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}
        >
            {audience.toUpperCase()}
        </span>
    );
}
