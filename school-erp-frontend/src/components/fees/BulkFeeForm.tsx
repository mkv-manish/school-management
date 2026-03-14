"use client";

type ClassOption = {
    _id: string;
    className?: string;
    section?: string;
};

type BulkFeeValues = {
    classId: string;
    month: string;
    totalAmount: string;
    paidAmount: string;
    dueDate: string;
    paymentDate: string;
    receiptNo: string;
    remarks: string;
};

const year = new Date().getFullYear();
const months = [
    `January ${year}`,
    `February ${year}`,
    `March ${year}`,
    `April ${year}`,
    `May ${year}`,
    `June ${year}`,
    `July ${year}`,
    `August ${year}`,
    `September ${year}`,
    `October ${year}`,
    `November ${year}`,
    `December ${year}`,
];

export default function BulkFeeForm({
    classes,
    values,
    onChange,
    onSubmit,
    submitting,
}: {
    classes: ClassOption[];
    values: BulkFeeValues;
    onChange: (key: keyof BulkFeeValues, value: string) => void;
    onSubmit: () => void;
    submitting?: boolean;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="mb-4">
                <div className="text-lg font-semibold text-slate-900">
                    Generate Fees For Class
                </div>
                <p className="text-sm text-slate-500 mt-1">
                    Create same fee records for all students of a selected
                    class.
                </p>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                <select
                    className="border rounded-xl p-3 bg-white"
                    value={values.classId}
                    onChange={(e) => onChange("classId", e.target.value)}
                >
                    <option value="">Select Class *</option>
                    {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.className || "-"} {c.section || ""}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded-xl p-3 bg-white"
                    value={values.month}
                    onChange={(e) => onChange("month", e.target.value)}
                >
                    <option value="">Select Month *</option>
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>

                <input
                    className="border rounded-xl p-3"
                    type="number"
                    placeholder="Total Amount *"
                    value={values.totalAmount}
                    onChange={(e) => onChange("totalAmount", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    type="number"
                    placeholder="Paid Amount"
                    value={values.paidAmount}
                    onChange={(e) => onChange("paidAmount", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    type="date"
                    value={values.dueDate}
                    onChange={(e) => onChange("dueDate", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    type="date"
                    value={values.paymentDate}
                    onChange={(e) => onChange("paymentDate", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    placeholder="Receipt Number"
                    value={values.receiptNo}
                    onChange={(e) => onChange("receiptNo", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    placeholder="Remarks"
                    value={values.remarks}
                    onChange={(e) => onChange("remarks", e.target.value)}
                />
            </div>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs text-slate-500">
                    This creates one common fee setup for all students in the
                    selected class.
                </p>

                <button
                    onClick={onSubmit}
                    disabled={submitting}
                    className="px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-slate-900 to-slate-700 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
                >
                    {submitting ? "Generating..." : "Generate Class Fees"}
                </button>
            </div>
        </div>
    );
}
