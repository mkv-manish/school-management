"use client";

import { useEffect, useState } from "react";
import { getMyFees } from "@/services/api";
import FeeSummaryCards from "@/components/fees/FeeSummaryCards";
import FeeTable from "@/components/fees/FeeTable";
import FeeDueCard from "@/components/fees/FeeDueCard";
import { Wallet, ReceiptText } from "lucide-react";

export default function StudentFeesPage() {
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role") || "";
        setRole(savedRole);

        if (!token) return;

        (async () => {
            try {
                setLoading(true);
                const data = await getMyFees(token);
                setFees(Array.isArray(data) ? data : []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="space-y-5">
            {/* Hero */}
            <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white shadow-sm">
                <div className="p-5 md:p-7 flex flex-col gap-5">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sm font-medium">
                                <Wallet size={16} />
                                Fee Portal
                            </div>

                            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
                                {role === "parent"
                                    ? "Child Fee Details"
                                    : "My Fees"}
                            </h1>

                            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
                                {role === "parent"
                                    ? "Track your child fee records, payment summary, and pending dues."
                                    : "View your fee records, payment summary, and pending dues."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <MiniCard
                                label="Records"
                                value={String(fees.length)}
                            />
                            <MiniCard
                                label="Mode"
                                value={role === "parent" ? "PARENT" : "STUDENT"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="rounded-2xl border bg-white shadow-sm p-5">
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="h-4 w-4 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
                        Loading fee records...
                    </div>
                </div>
            ) : fees.length === 0 ? (
                <div className="rounded-2xl border bg-white shadow-sm p-10 text-center">
                    <div className="mx-auto h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <ReceiptText className="text-slate-500" size={22} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        No fee records found
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                        Fee records will appear here when created by admin.
                    </p>
                </div>
            ) : (
                <>
                    <FeeDueCard rows={fees} />
                    <FeeSummaryCards rows={fees} />
                    <FeeTable rows={fees} />
                </>
            )}
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
