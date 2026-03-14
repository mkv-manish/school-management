"use client";

import { useEffect, useMemo, useState } from "react";
import {
    assignTeacherToClass,
    createClass,
    deleteClass,
    getClasses,
    getTeachers,
    updateClass,
} from "@/services/api";
import {
    BookOpen,
    Plus,
    Search,
    RefreshCcw,
    Pencil,
    Trash2,
    UserPlus,
    X,
    CheckCircle2,
} from "lucide-react";

type ClassRow = {
    _id: string;
    className: string;
    section?: string;
    classTeacher?: {
        _id: string;
        name: string;
        email: string;
        approved?: boolean;
    };
    createdAt: string;
};

type Teacher = {
    _id: string;
    name: string;
    email: string;
    approved: boolean;
};

export default function ClassesPage() {
    const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const [rows, setRows] = useState<ClassRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // create form
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");

    // search
    const [search, setSearch] = useState("");

    // teachers (dropdown)
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [teacherLoading, setTeacherLoading] = useState(false);

    // modals
    const [editOpen, setEditOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editClassName, setEditClassName] = useState("");
    const [editSection, setEditSection] = useState("");

    const [assigningClassId, setAssigningClassId] = useState<string | null>(
        null,
    );
    const [assignTeacherId, setAssignTeacherId] = useState<string>("");

    const [busyId, setBusyId] = useState<string | null>(null);

    const load = async () => {
        if (!token) return;
        try {
            setLoading(true);
            setError("");
            const data = await getClasses(token, search.trim() || undefined);
            setRows(data || []);
        } catch (e: any) {
            setError(e?.message || "Failed to load classes");
        } finally {
            setLoading(false);
        }
    };

    const loadTeachers = async () => {
        if (!token) return;
        try {
            setTeacherLoading(true);
            const data = await getTeachers(token, {
                page: 1,
                limit: 200,
                approved: "true", // ✅ only approved teachers for assignment
            });
            setTeachers(data.teachers || []);
        } finally {
            setTeacherLoading(false);
        }
    };

    useEffect(() => {
        load();
        loadTeachers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCreate = async () => {
        if (!token) return;
        if (!className.trim()) return alert("Class name required");

        try {
            setBusyId("create");
            await createClass(token, {
                className: className.trim(),
                section: section.trim(),
            });
            setClassName("");
            setSection("");
            await load();
        } catch (e: any) {
            alert(e?.message || "Create failed");
        } finally {
            setBusyId(null);
        }
    };

    const onOpenEdit = (c: ClassRow) => {
        setEditId(c._id);
        setEditClassName(c.className || "");
        setEditSection(c.section || "");
        setEditOpen(true);
    };

    const onSaveEdit = async () => {
        if (!token || !editId) return;
        if (!editClassName.trim()) return alert("Class name required");

        try {
            setBusyId(editId);
            await updateClass(token, editId, {
                className: editClassName.trim(),
                section: editSection.trim(),
            });
            setEditOpen(false);
            setEditId(null);
            await load();
        } catch (e: any) {
            alert(e?.message || "Update failed");
        } finally {
            setBusyId(null);
        }
    };

    const onDelete = async (id: string) => {
        if (!token) return;
        const ok = confirm("Delete this class? This cannot be undone.");
        if (!ok) return;

        try {
            setBusyId(id);
            await deleteClass(token, id);
            await load();
        } catch (e: any) {
            alert(e?.message || "Delete failed");
        } finally {
            setBusyId(null);
        }
    };

    const onOpenAssign = (classId: string) => {
        setAssigningClassId(classId);
        setAssignTeacherId("");
    };

    const onAssign = async () => {
        if (!token || !assigningClassId) return;
        if (!assignTeacherId) return alert("Select a teacher");

        try {
            setBusyId(assigningClassId);
            await assignTeacherToClass(
                token,
                assigningClassId,
                assignTeacherId,
            );
            setAssigningClassId(null);
            setAssignTeacherId("");
            await load();
        } catch (e: any) {
            alert(e?.message || "Assign failed");
        } finally {
            setBusyId(null);
        }
    };

    const stats = useMemo(() => {
        const total = rows.length;
        const assigned = rows.filter((r) => r.classTeacher?._id).length;
        const unassigned = total - assigned;
        return { total, assigned, unassigned };
    }, [rows]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen />
                        Classes
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Create classes, manage sections, and assign class
                        teachers.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">
                        Total: {stats.total}
                    </span>
                    <span className="px-3 py-2 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-semibold">
                        Assigned: {stats.assigned}
                    </span>
                    <span className="px-3 py-2 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 text-sm font-semibold">
                        Unassigned: {stats.unassigned}
                    </span>

                    <button
                        onClick={load}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCcw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Create + Search Row */}
            <div className="grid lg:grid-cols-3 gap-5">
                {/* Create Card */}
                <div className="rounded-2xl border bg-white shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                            <Plus size={18} />
                            Create Class
                        </div>
                    </div>

                    <div className="space-y-3">
                        <input
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                            placeholder="Class Name (e.g. 10)"
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />

                        <input
                            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                            placeholder="Section (optional e.g. A)"
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                        />

                        <button
                            onClick={onCreate}
                            disabled={busyId === "create"}
                            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                        >
                            {busyId === "create" ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>

                {/* Search Card */}
                <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm p-5">
                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        <div className="font-semibold text-slate-900">
                            Search Classes
                        </div>

                        <div className="flex w-full md:max-w-xl gap-2">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    placeholder="Search by class / section..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && load()
                                    }
                                />
                            </div>

                            <button
                                onClick={load}
                                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99] transition"
                            >
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-500">
                        Tip: Example searches —{" "}
                        <span className="font-semibold">10</span>,{" "}
                        <span className="font-semibold">A</span>,{" "}
                        <span className="font-semibold">10 A</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                {error ? (
                    <div className="p-6 text-red-600">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="sticky top-0 z-10 bg-slate-50 border-b">
                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3">Class</th>
                                    <th className="px-5 py-3">Class Teacher</th>
                                    <th className="px-5 py-3">Created</th>
                                    <th className="px-5 py-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td className="px-5 py-6" colSpan={4}>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                                                Loading classes...
                                            </div>
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-5 py-6 text-slate-600"
                                            colSpan={4}
                                        >
                                            No classes found.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((c, idx) => {
                                        const display = `${c.className}${c.section ? ` ${c.section}` : ""}`;
                                        const busy = busyId === c._id;

                                        return (
                                            <tr
                                                key={c._id}
                                                className={
                                                    idx % 2
                                                        ? "bg-slate-50/40"
                                                        : "bg-white"
                                                }
                                            >
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                                                            {(
                                                                c
                                                                    .className?.[0] ||
                                                                "C"
                                                            ).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">
                                                                {display}
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                ID:{" "}
                                                                {c._id.slice(
                                                                    0,
                                                                    8,
                                                                )}
                                                                ...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    {c.classTeacher?._id ? (
                                                        <div className="space-y-1">
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-semibold">
                                                                <CheckCircle2
                                                                    size={16}
                                                                />
                                                                {
                                                                    c
                                                                        .classTeacher
                                                                        .name
                                                                }
                                                            </div>
                                                            <div className="text-xs text-slate-500">
                                                                {
                                                                    c
                                                                        .classTeacher
                                                                        .email
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 text-sm font-semibold">
                                                            Not assigned
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {new Date(
                                                        c.createdAt,
                                                    ).toLocaleDateString()}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            onClick={() =>
                                                                onOpenAssign(
                                                                    c._id,
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white hover:bg-slate-50"
                                                        >
                                                            <UserPlus
                                                                size={16}
                                                            />
                                                            Assign
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                onOpenEdit(c)
                                                            }
                                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-white hover:bg-slate-50"
                                                        >
                                                            <Pencil size={16} />
                                                            Edit
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                onDelete(c._id)
                                                            }
                                                            disabled={busy}
                                                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-60"
                                                        >
                                                            <Trash2 size={16} />
                                                            {busy
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assign Teacher Modal */}
            {assigningClassId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setAssigningClassId(null)}
                    />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">
                                Assign Class Teacher
                            </div>
                            <button
                                className="p-2 rounded-xl border hover:bg-slate-50"
                                onClick={() => setAssigningClassId(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <div className="text-sm text-slate-600">
                                Select an{" "}
                                <span className="font-semibold">approved</span>{" "}
                                teacher.
                            </div>

                            <select
                                className="w-full border rounded-xl p-3 bg-white"
                                value={assignTeacherId}
                                onChange={(e) =>
                                    setAssignTeacherId(e.target.value)
                                }
                                disabled={teacherLoading}
                            >
                                <option value="">-- Select Teacher --</option>
                                {teachers.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.name} ({t.email})
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={onAssign}
                                disabled={
                                    !assignTeacherId ||
                                    busyId === assigningClassId
                                }
                                className="w-full px-5 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                            >
                                {busyId === assigningClassId
                                    ? "Assigning..."
                                    : "Assign Teacher"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setEditOpen(false)}
                    />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-lg font-bold">Edit Class</div>
                            <button
                                className="p-2 rounded-xl border hover:bg-slate-50"
                                onClick={() => setEditOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="Class Name"
                                value={editClassName}
                                onChange={(e) =>
                                    setEditClassName(e.target.value)
                                }
                            />

                            <input
                                className="w-full border rounded-xl p-3"
                                placeholder="Section (optional)"
                                value={editSection}
                                onChange={(e) => setEditSection(e.target.value)}
                            />

                            <button
                                onClick={onSaveEdit}
                                disabled={!editId || busyId === editId}
                                className="w-full px-5 py-3 rounded-xl text-white font-semibold
                bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                            >
                                {busyId === editId
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
