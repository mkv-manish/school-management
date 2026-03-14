"use client";

type StudentOption = {
    _id: string;
    classId?: { _id?: string; className?: string; section?: string };
    userId?: { name?: string; email?: string };
};

type FeeFormValues = {
    studentId: string;
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

export default function FeeForm({
    students,
    values,
    onChange,
    onStudentChange,
    onSubmit,
    submitting,
    submitLabel,
    disableStudent = false,
}: {
    students: StudentOption[];
    values: FeeFormValues;
    onChange: (key: keyof FeeFormValues, value: string) => void;
    onStudentChange: (id: string) => void;
    onSubmit: () => void;
    submitting?: boolean;
    submitLabel?: string;
    disableStudent?: boolean;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="font-semibold text-slate-900 mb-4">
                {submitLabel === "Update Fee" ? "Edit Fee" : "Create Fee"}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <select
                    className="border rounded-xl p-3 bg-white"
                    value={values.studentId}
                    onChange={(e) => onStudentChange(e.target.value)}
                    disabled={disableStudent}
                >
                    <option value="">Select Student *</option>
                    {students.map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.userId?.name || "-"} -{" "}
                            {s.classId?.className || "-"}{" "}
                            {s.classId?.section || ""}
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
                    placeholder="Total Amount *"
                    type="number"
                    value={values.totalAmount}
                    onChange={(e) => onChange("totalAmount", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    placeholder="Paid Amount"
                    type="number"
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
                    className="border rounded-xl p-3 md:col-span-2 xl:col-span-2"
                    placeholder="Remarks"
                    value={values.remarks}
                    onChange={(e) => onChange("remarks", e.target.value)}
                />
            </div>

            <button
                onClick={onSubmit}
                disabled={submitting}
                className="mt-4 px-5 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
            >
                {submitting ? "Saving..." : submitLabel || "Save Fee"}
            </button>
        </div>
    );
}
