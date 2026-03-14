"use client";

import { useEffect, useRef, useState } from "react";
import { approveUser, getTeachers } from "@/services/api";
import Pagination from "@/components/Pagination";
import {
    Search,
    CheckCircle2,
    Clock3,
    Users2,
    RefreshCcw,
    Mail,
    GraduationCap,
    CalendarDays,
} from "lucide-react";

type Teacher = {
    _id: string;
    name: string;
    email: string;
    approved: boolean;
    createdAt: string;
};

export default function TeachersAdminPage() {
    const didMount = useRef(false);

    const [rows, setRows] = useState<Teacher[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const limit = 10;

    const [search, setSearch] = useState("");
    const [approvedFilter, setApprovedFilter] = useState<
        "all" | "true" | "false"
    >("all");
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const load = async (opts?: { keepPage?: boolean; forcePage?: number }) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        const targetPage =
            typeof opts?.forcePage === "number"
                ? opts.forcePage
                : opts?.keepPage
                  ? page
                  : 1;

        try {
            setLoading(true);
            setError("");

            const data = await getTeachers(token, {
                page: targetPage,
                limit,
                search: search.trim() || undefined,
                approved: approvedFilter === "all" ? undefined : approvedFilter,
            });

            setRows(data.teachers || []);
            setTotal(data.total || 0);

            if (!opts?.keepPage && typeof opts?.forcePage !== "number") {
                setPage(1);
            }
        } catch (e: any) {
            setError(e?.message || "Failed to load teachers");
            setRows([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load({ keepPage: true });
        didMount.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!didMount.current) return;
        load({ keepPage: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, approvedFilter]);

    const onSearch = async () => {
        setPage(1);
        await load({ forcePage: 1 });
    };

    const onApprove = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setApprovingId(id);
            await approveUser(token, id);
            await load({ keepPage: true });
        } catch (e: any) {
            alert(e?.message || "Approve failed");
        } finally {
            setApprovingId(null);
        }
    };

    const onRefresh = async () => {
        await load({ keepPage: true });
    };

    const approvedCount = rows.filter((r) => r.approved).length;
    const pendingCount = rows.filter((r) => !r.approved).length;

    return (
        <div className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-sm">
                <div className="p-5 md:p-7 flex flex-col gap-5">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                                <GraduationCap size={16} />
                                Teacher Management
                            </div>

                            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                                Teachers
                            </h1>

                            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
                                Review teacher accounts, search records, and
                                approve pending staff access.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <MiniCard
                                label="On this page"
                                value={String(rows.length)}
                            />
                            <MiniCard
                                label="Approved"
                                value={String(approvedCount)}
                            />
                            <MiniCard
                                label="Pending"
                                value={String(pendingCount)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex w-full xl:max-w-xl gap-2">
                            <div className="relative flex-1">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/10 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                    placeholder="Search teacher name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === "Enter" && onSearch()
                                    }
                                />
                            </div>

                            <button
                                onClick={onSearch}
                                disabled={loading}
                                className="px-5 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 active:scale-[0.99] transition disabled:opacity-60"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/10">
                                <button
                                    onClick={() => {
                                        setApprovedFilter("all");
                                        setPage(1);
                                    }}
                                    disabled={loading}
                                    className={[
                                        "px-3 py-2 rounded-lg text-sm font-semibold transition",
                                        approvedFilter === "all"
                                            ? "bg-white text-slate-900"
                                            : "text-slate-200 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => {
                                        setApprovedFilter("true");
                                        setPage(1);
                                    }}
                                    disabled={loading}
                                    className={[
                                        "px-3 py-2 rounded-lg text-sm font-semibold transition",
                                        approvedFilter === "true"
                                            ? "bg-white text-slate-900"
                                            : "text-slate-200 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => {
                                        setApprovedFilter("false");
                                        setPage(1);
                                    }}
                                    disabled={loading}
                                    className={[
                                        "px-3 py-2 rounded-lg text-sm font-semibold transition",
                                        approvedFilter === "false"
                                            ? "bg-white text-slate-900"
                                            : "text-slate-200 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    Pending
                                </button>
                            </div>

                            <button
                                onClick={onRefresh}
                                disabled={loading}
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/10 text-white hover:bg-white/15 transition disabled:opacity-60"
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
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <SummaryCard
                    title="Loaded Teachers"
                    value={String(rows.length)}
                    subtitle="Currently visible records"
                    icon={<Users2 size={18} />}
                />
                <SummaryCard
                    title="Approved"
                    value={String(approvedCount)}
                    subtitle="Teachers with active access"
                    icon={<CheckCircle2 size={18} />}
                />
                <SummaryCard
                    title="Pending"
                    value={String(pendingCount)}
                    subtitle="Awaiting admin approval"
                    icon={<Clock3 size={18} />}
                />
            </div>

            <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Teacher Records
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Review teacher account details and approval status.
                    </p>
                </div>

                {error ? (
                    <div className="p-5 text-red-600">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="sticky top-0 z-10 bg-slate-50 border-b">
                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3">Teacher</th>
                                    <th className="px-5 py-3">Created</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td className="px-5 py-6" colSpan={4}>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                                                Loading teachers...
                                            </div>
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-5 py-6 text-slate-600"
                                            colSpan={4}
                                        >
                                            No teachers found.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((t, idx) => (
                                        <tr
                                            key={t._id}
                                            className={
                                                idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-slate-50/40"
                                            }
                                        >
                                            <td className="px-5 py-4 align-top">
                                                <div className="flex items-start gap-3 min-w-[240px]">
                                                    <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                                                        {(
                                                            t.name?.[0] || "T"
                                                        ).toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="font-semibold text-slate-900">
                                                            {t.name || "-"}
                                                        </div>

                                                        <div className="mt-1 text-sm text-slate-500 inline-flex items-center gap-2">
                                                            <Mail size={14} />
                                                            <span className="break-all">
                                                                {t.email || "-"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 align-top">
                                                <div className="inline-flex items-center gap-2 text-slate-700 min-w-[170px]">
                                                    <CalendarDays
                                                        size={14}
                                                        className="text-slate-400"
                                                    />
                                                    {t.createdAt
                                                        ? new Date(
                                                              t.createdAt,
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 align-top">
                                                {t.approved ? (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-100 text-sm font-semibold whitespace-nowrap">
                                                        <CheckCircle2
                                                            size={16}
                                                        />
                                                        Approved
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-100 text-sm font-semibold whitespace-nowrap">
                                                        <Clock3 size={16} />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 align-top">
                                                {!t.approved ? (
                                                    <button
                                                        onClick={() =>
                                                            onApprove(t._id)
                                                        }
                                                        disabled={
                                                            approvingId ===
                                                            t._id
                                                        }
                                                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 whitespace-nowrap"
                                                    >
                                                        {approvingId === t._id
                                                            ? "Approving..."
                                                            : "Approve"}
                                                    </button>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination
                    page={page}
                    totalPages={totalPages}
                    loading={loading}
                    onPrev={() => setPage((p) => Math.max(1, p - 1))}
                    onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
            </div>
        </div>
    );
}

function MiniCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white/10 px-4 py-3 min-w-[110px]">
            <div className="text-xs text-slate-200">{label}</div>
            <div className="mt-1 text-2xl font-bold text-white">{value}</div>
        </div>
    );
}

function SummaryCard({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="flex items-center justify-between">
                <div className="text-slate-500 text-sm font-medium">
                    {title}
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    {icon}
                </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">
                {value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
    );
}
