"use client";

type FeeStructureRow = {
    _id: string;
    amount: number;
    frequency: string;
    isOptional: boolean;
    notes?: string;
    classId?: {
        className?: string;
        section?: string;
    };
    feeTypeId?: {
        name?: string;
        code?: string;
    };
};

export default function FeeStructureTable({
    rows,
    onEdit,
    onDelete,
}: {
    rows: FeeStructureRow[];
    onEdit?: (row: FeeStructureRow) => void;
    onDelete?: (row: FeeStructureRow) => void;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-slate-50">
                <div className="font-semibold text-slate-900">
                    Fee Structures
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-5 py-3">Class</th>
                            <th className="px-5 py-3">Fee Type</th>
                            <th className="px-5 py-3">Amount</th>
                            <th className="px-5 py-3">Frequency</th>
                            <th className="px-5 py-3">Optional</th>
                            <th className="px-5 py-3">Notes</th>
                            <th className="px-5 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-5 py-6 text-slate-600"
                                >
                                    No fee structures found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row._id}>
                                    <td className="px-5 py-4 font-semibold text-slate-900">
                                        {row.classId?.className || "-"}{" "}
                                        {row.classId?.section || ""}
                                    </td>
                                    <td className="px-5 py-4">
                                        {row.feeTypeId?.name || "-"} (
                                        {row.feeTypeId?.code || "-"})
                                    </td>
                                    <td className="px-5 py-4">₹{row.amount}</td>
                                    <td className="px-5 py-4 capitalize">
                                        {row.frequency}
                                    </td>
                                    <td className="px-5 py-4">
                                        {row.isOptional ? "Yes" : "No"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {row.notes || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit?.(row)}
                                                className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete?.(row)}
                                                className="px-4 py-2 rounded-xl border text-red-600 hover:bg-red-50 font-semibold"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
