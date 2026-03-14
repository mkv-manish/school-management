"use client";

import FeeStatusBadge from "./FeeStatusBadge";

type FeeRow = {
    _id: string;
    month: string;
    totalAmount: number;
    paidAmount: number;
    dueDate?: string;
    paymentDate?: string;
    receiptNo?: string;
    remarks?: string;
    status: "paid" | "partial" | "unpaid";
    classId?: {
        _id?: string;
        className?: string;
        section?: string;
    };
    feeTypeId?: {
        _id?: string;
        name?: string;
        code?: string;
    };
    studentId?: {
        _id?: string;
        userId?: {
            name?: string;
            email?: string;
        };
    };
};

export default function FeeTable({
    rows,
    showStudent = false,
    onEdit,
    onDelete,
    onSelect,
}: {
    rows: FeeRow[];
    showStudent?: boolean;
    onEdit?: (row: FeeRow) => void;
    onDelete?: (row: FeeRow) => void;
    onSelect?: (row: FeeRow) => void;
}) {
    const hasAction = !!onEdit || !!onDelete || !!onSelect;
    const colSpan = showStudent ? (hasAction ? 12 : 11) : hasAction ? 11 : 10;

    const formatCurrency = (value: number) => `₹${Number(value || 0)}`;

    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Fee Records
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Fee type wise records with payment and receipt
                            details.
                        </p>
                    </div>

                    <div className="text-sm text-slate-500">
                        Total Records:{" "}
                        <span className="font-semibold text-slate-900">
                            {rows.length}
                        </span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                            {showStudent ? (
                                <th className="px-5 py-3">Student</th>
                            ) : null}
                            <th className="px-5 py-3">Fee Type</th>
                            <th className="px-5 py-3">Month</th>
                            <th className="px-5 py-3">Class</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Paid</th>
                            <th className="px-5 py-3">Due</th>
                            <th className="px-5 py-3">Due Date</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Payment Date</th>
                            <th className="px-5 py-3">Receipt</th>
                            {hasAction ? (
                                <th className="px-5 py-3">Action</th>
                            ) : null}
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={colSpan}
                                    className="px-5 py-10 text-center"
                                >
                                    <div className="text-slate-900 font-semibold">
                                        No fee records found
                                    </div>
                                    <div className="text-sm text-slate-500 mt-1">
                                        Matching fee records will appear here.
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, idx) => {
                                const due = Math.max(
                                    0,
                                    Number(row.totalAmount || 0) -
                                        Number(row.paidAmount || 0),
                                );

                                return (
                                    <tr
                                        key={row._id}
                                        className={
                                            idx % 2 === 0
                                                ? "bg-white"
                                                : "bg-slate-50/40"
                                        }
                                    >
                                        {showStudent ? (
                                            <td className="px-5 py-4 align-top min-w-[220px]">
                                                <div className="font-semibold text-slate-900">
                                                    {row.studentId?.userId
                                                        ?.name || "-"}
                                                </div>
                                                <div className="text-sm text-slate-500 break-all">
                                                    {row.studentId?.userId
                                                        ?.email || "-"}
                                                </div>
                                            </td>
                                        ) : null}

                                        <td className="px-5 py-4 align-top min-w-[170px]">
                                            <div className="font-semibold text-slate-900">
                                                {row.feeTypeId?.name || "-"}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">
                                                {row.feeTypeId?.code || "-"}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap font-medium text-slate-900">
                                            {row.month}
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap">
                                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-sm font-semibold">
                                                {row.classId?.className || "-"}{" "}
                                                {row.classId?.section || ""}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap font-medium text-slate-900">
                                            {formatCurrency(row.totalAmount)}
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap font-medium text-green-700">
                                            {formatCurrency(row.paidAmount)}
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap font-medium">
                                            <span
                                                className={
                                                    due > 0
                                                        ? "text-red-600"
                                                        : "text-slate-700"
                                                }
                                            >
                                                {formatCurrency(due)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap text-slate-700">
                                            {row.dueDate || "-"}
                                        </td>

                                        <td className="px-5 py-4 align-top">
                                            <FeeStatusBadge
                                                status={row.status}
                                            />
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap text-slate-700">
                                            {row.paymentDate || "-"}
                                        </td>

                                        <td className="px-5 py-4 align-top whitespace-nowrap">
                                            {row.receiptNo ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-sm font-medium">
                                                    {row.receiptNo}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">
                                                    -
                                                </span>
                                            )}
                                        </td>

                                        {hasAction ? (
                                            <td className="px-5 py-4 align-top min-w-[220px]">
                                                <div className="flex flex-wrap gap-2">
                                                    {onSelect ? (
                                                        <button
                                                            onClick={() =>
                                                                onSelect(row)
                                                            }
                                                            className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                                                        >
                                                            View
                                                        </button>
                                                    ) : null}

                                                    {onEdit ? (
                                                        <button
                                                            onClick={() =>
                                                                onEdit(row)
                                                            }
                                                            className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                                                        >
                                                            Edit
                                                        </button>
                                                    ) : null}

                                                    {onDelete ? (
                                                        <button
                                                            onClick={() =>
                                                                onDelete(row)
                                                            }
                                                            className="px-4 py-2 rounded-xl border text-red-600 hover:bg-red-50 font-semibold"
                                                        >
                                                            Delete
                                                        </button>
                                                    ) : null}
                                                </div>

                                                {row.remarks ? (
                                                    <div className="mt-2 text-xs text-slate-500 max-w-[220px] line-clamp-2">
                                                        {row.remarks}
                                                    </div>
                                                ) : null}
                                            </td>
                                        ) : null}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
