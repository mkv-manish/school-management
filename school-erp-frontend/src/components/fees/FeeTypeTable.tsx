"use client";

type FeeTypeRow = {
    _id: string;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
};

export default function FeeTypeTable({
    rows,
    onEdit,
    onDelete,
}: {
    rows: FeeTypeRow[];
    onEdit?: (row: FeeTypeRow) => void;
    onDelete?: (row: FeeTypeRow) => void;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-slate-50">
                <div className="font-semibold text-slate-900">Fee Types</div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Code</th>
                            <th className="px-5 py-3">Description</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-6 text-slate-600"
                                >
                                    No fee types found.
                                </td>
                            </tr>
                        ) : (
                            rows.map((row) => (
                                <tr key={row._id}>
                                    <td className="px-5 py-4 font-semibold text-slate-900">
                                        {row.name}
                                    </td>
                                    <td className="px-5 py-4">{row.code}</td>
                                    <td className="px-5 py-4">
                                        {row.description || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={[
                                                "px-2.5 py-1 rounded-full text-xs font-semibold border",
                                                row.isActive
                                                    ? "bg-green-50 text-green-700 border-green-100"
                                                    : "bg-slate-100 text-slate-600 border-slate-200",
                                            ].join(" ")}
                                        >
                                            {row.isActive
                                                ? "ACTIVE"
                                                : "INACTIVE"}
                                        </span>
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
