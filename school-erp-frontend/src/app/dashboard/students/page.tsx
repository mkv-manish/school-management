"use client";

import { useEffect, useRef, useState } from "react";
import { approveUser, getAllStudents } from "@/services/api";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";
import {
    Search,
    RefreshCcw,
    CheckCircle2,
    Clock3,
    Users2,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    UserRound,
} from "lucide-react";

type StudentRow = {
    _id: string;
    fatherName?: string;
    motherName?: string;
    contactNumber?: string;
    address?: string;
    userId?: {
        _id: string;
        name: string;
        email: string;
        approved: boolean;
    };
    classId?: {
        className: string;
        section?: string;
    };
};

export default function StudentsPage() {
    const router = useRouter();
    const didMount = useRef(false);

    const [rows, setRows] = useState<StudentRow[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "true" | "false">("all");
    const [page, setPage] = useState(1);
    const limit = 10;

    const [approvingId, setApprovingId] = useState<string | null>(null);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const load = async (opts?: { keepPage?: boolean; forcePage?: number }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const targetPage =
            typeof opts?.forcePage === "number"
                ? opts.forcePage
                : opts?.keepPage
                  ? page
                  : 1;

        try {
            setLoading(true);
            setError("");

            const data = await getAllStudents(token, {
                page: targetPage,
                limit,
                search: search.trim() || undefined,
                approved: filter === "all" ? undefined : filter,
            });

            setRows(data.students || []);
            setTotal(data.total || 0);

            if (!opts?.keepPage && typeof opts?.forcePage !== "number") {
                setPage(1);
            }
        } catch (e: any) {
            setError(e?.message || "Failed to load students");
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
    }, [page, filter]);

    const onSearch = async () => {
        setPage(1);
        await load({ forcePage: 1 });
    };

    const onRefresh = async () => {
        await load({ keepPage: true });
    };

    const onApprove = async (userId: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            setApprovingId(userId);
            await approveUser(token, userId);
            await load({ keepPage: true });
        } catch (e: any) {
            alert(e?.message || "Approve failed");
        } finally {
            setApprovingId(null);
        }
    };

    const approvedCount = rows.filter((r) => r.userId?.approved).length;
    const pendingCount = rows.filter((r) => !r.userId?.approved).length;

    return (
        <div className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-sm">
                <div className="p-5 md:p-7 flex flex-col gap-5">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                                <GraduationCap size={16} />
                                Student Management
                            </div>

                            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                                Students
                            </h1>

                            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
                                Manage student records, review personal details,
                                and approve pending accounts from one place.
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
                                    placeholder="Search by student name or email..."
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
                                        setFilter("all");
                                        setPage(1);
                                    }}
                                    disabled={loading}
                                    className={[
                                        "px-3 py-2 rounded-lg text-sm font-semibold transition",
                                        filter === "all"
                                            ? "bg-white text-slate-900"
                                            : "text-slate-200 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter("true");
                                        setPage(1);
                                    }}
                                    disabled={loading}
                                    className={[
                                        "px-3 py-2 rounded-lg text-sm font-semibold transition",
                                        filter === "true"
                                            ? "bg-white text-slate-900"
                                            : "text-slate-200 hover:bg-white/10",
                                    ].join(" ")}
                                >
                                    Approved
                                </button>
                                <button
                                    onClick={() => {
                                        setFilter("false");
                                        setPage(1);
                                    }}
                                    disabled={loading}
                                    className={[
                                        "px-3 py-2 rounded-lg text-sm font-semibold transition",
                                        filter === "false"
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
                    title="Loaded Students"
                    value={String(rows.length)}
                    subtitle="Currently visible records"
                    icon={<Users2 size={18} />}
                />
                <SummaryCard
                    title="Approved"
                    value={String(approvedCount)}
                    subtitle="Students with active access"
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
                        Student Records
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Full student details including family and contact
                        information.
                    </p>
                </div>

                {error ? (
                    <div className="p-5 text-red-600">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="sticky top-0 z-10 bg-slate-50 border-b">
                                <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                                    <th className="px-5 py-3">Student</th>
                                    <th className="px-5 py-3">Class</th>
                                    <th className="px-5 py-3">Father</th>
                                    <th className="px-5 py-3">Mother</th>
                                    <th className="px-5 py-3">Contact</th>
                                    <th className="px-5 py-3">Address</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {loading ? (
                                    <tr>
                                        <td className="px-5 py-6" colSpan={8}>
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                                                Loading students...
                                            </div>
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-5 py-6 text-slate-600"
                                            colSpan={8}
                                        >
                                            No students found.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((s, idx) => {
                                        const approved = s.userId?.approved;
                                        const userId = s.userId?._id;

                                        return (
                                            <tr
                                                key={s._id}
                                                className={
                                                    idx % 2 === 0
                                                        ? "bg-white"
                                                        : "bg-slate-50/40"
                                                }
                                            >
                                                <td className="px-5 py-4 align-top">
                                                    <div className="flex items-start gap-3 min-w-[220px]">
                                                        <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0">
                                                            {(
                                                                s.userId
                                                                    ?.name?.[0] ||
                                                                "S"
                                                            ).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-slate-900">
                                                                {s.userId
                                                                    ?.name ||
                                                                    "-"}
                                                            </div>

                                                            <div className="mt-1 text-sm text-slate-500 inline-flex items-center gap-2">
                                                                <Mail
                                                                    size={14}
                                                                />
                                                                <span className="break-all">
                                                                    {s.userId
                                                                        ?.email ||
                                                                        "-"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    {s.classId?.className ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-semibold text-sm whitespace-nowrap">
                                                            {
                                                                s.classId
                                                                    .className
                                                            }{" "}
                                                            {s.classId
                                                                .section || ""}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500">
                                                            -
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="inline-flex items-center gap-2 text-slate-800 font-medium min-w-[140px]">
                                                        <UserRound
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {s.fatherName || "-"}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="inline-flex items-center gap-2 text-slate-800 font-medium min-w-[140px]">
                                                        <UserRound
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {s.motherName || "-"}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    <div className="inline-flex items-center gap-2 text-slate-800 min-w-[150px]">
                                                        <Phone
                                                            size={14}
                                                            className="text-slate-400"
                                                        />
                                                        {s.contactNumber || "-"}
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top max-w-[260px]">
                                                    <div className="inline-flex items-start gap-2 text-slate-800">
                                                        <MapPin
                                                            size={14}
                                                            className="text-slate-400 mt-0.5 shrink-0"
                                                        />
                                                        <span className="line-clamp-3">
                                                            {s.address || "-"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 align-top">
                                                    {approved ? (
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
                                                    {approved ? (
                                                        <span className="text-slate-400">
                                                            —
                                                        </span>
                                                    ) : userId ? (
                                                        <button
                                                            onClick={() =>
                                                                onApprove(
                                                                    userId,
                                                                )
                                                            }
                                                            disabled={
                                                                approvingId ===
                                                                userId
                                                            }
                                                            className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60 whitespace-nowrap"
                                                        >
                                                            {approvingId ===
                                                            userId
                                                                ? "Approving..."
                                                                : "Approve"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400">
                                                            No User
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
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
