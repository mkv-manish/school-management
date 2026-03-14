"use client";

type ClassOption = {
    _id: string;
    className?: string;
    section?: string;
};

type FeeTypeOption = {
    _id: string;
    name?: string;
    code?: string;
};

type FeeStructureFormValues = {
    classId: string;
    feeTypeId: string;
    amount: string;
    frequency: string;
    isOptional: boolean;
    notes: string;
};

export default function FeeStructureForm({
    classes,
    feeTypes,
    values,
    onChange,
    onSubmit,
    submitting,
    submitLabel,
    disableKeys = false,
}: {
    classes: ClassOption[];
    feeTypes: FeeTypeOption[];
    values: FeeStructureFormValues;
    onChange: (
        key: keyof FeeStructureFormValues,
        value: string | boolean,
    ) => void;
    onSubmit: () => void;
    submitting?: boolean;
    submitLabel?: string;
    disableKeys?: boolean;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="font-semibold text-slate-900 mb-4">
                {submitLabel === "Update Structure"
                    ? "Edit Fee Structure"
                    : "Create Fee Structure"}
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <select
                    className="border rounded-xl p-3 bg-white"
                    value={values.classId}
                    onChange={(e) => onChange("classId", e.target.value)}
                    disabled={disableKeys}
                >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.className || "-"} {c.section || ""}
                        </option>
                    ))}
                </select>

                <select
                    className="border rounded-xl p-3 bg-white"
                    value={values.feeTypeId}
                    onChange={(e) => onChange("feeTypeId", e.target.value)}
                    disabled={disableKeys}
                >
                    <option value="">Select Fee Type</option>
                    {feeTypes.map((f) => (
                        <option key={f._id} value={f._id}>
                            {f.name || "-"} ({f.code || "-"})
                        </option>
                    ))}
                </select>

                <input
                    className="border rounded-xl p-3"
                    type="number"
                    placeholder="Amount"
                    value={values.amount}
                    onChange={(e) => onChange("amount", e.target.value)}
                />

                <select
                    className="border rounded-xl p-3 bg-white"
                    value={values.frequency}
                    onChange={(e) => onChange("frequency", e.target.value)}
                >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                </select>

                <input
                    className="border rounded-xl p-3 md:col-span-2"
                    placeholder="Notes"
                    value={values.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                />

                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                        type="checkbox"
                        checked={values.isOptional}
                        onChange={(e) =>
                            onChange("isOptional", e.target.checked)
                        }
                    />
                    Optional Fee
                </label>
            </div>

            <button
                onClick={onSubmit}
                disabled={submitting}
                className="mt-4 px-5 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
            >
                {submitting ? "Saving..." : submitLabel || "Save Structure"}
            </button>
        </div>
    );
}
