"use client";

type FeeTypeFormValues = {
    name: string;
    code: string;
    description: string;
    isActive: boolean;
};

export default function FeeTypeForm({
    values,
    onChange,
    onSubmit,
    submitting,
    submitLabel,
}: {
    values: FeeTypeFormValues;
    onChange: (key: keyof FeeTypeFormValues, value: string | boolean) => void;
    onSubmit: () => void;
    submitting?: boolean;
    submitLabel?: string;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="font-semibold text-slate-900 mb-4">
                {submitLabel === "Update Fee Type"
                    ? "Edit Fee Type"
                    : "Create Fee Type"}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <input
                    className="border rounded-xl p-3"
                    placeholder="Fee Type Name (e.g. Tuition Fee)"
                    value={values.name}
                    onChange={(e) => onChange("name", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
                    placeholder="Code (e.g. TUITION)"
                    value={values.code}
                    onChange={(e) =>
                        onChange("code", e.target.value.toUpperCase())
                    }
                />

                <textarea
                    className="border rounded-xl p-3 md:col-span-2 min-h-[100px]"
                    placeholder="Description"
                    value={values.description}
                    onChange={(e) => onChange("description", e.target.value)}
                />

                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <input
                        type="checkbox"
                        checked={values.isActive}
                        onChange={(e) => onChange("isActive", e.target.checked)}
                    />
                    Active
                </label>
            </div>

            <button
                onClick={onSubmit}
                disabled={submitting}
                className="mt-4 px-5 py-3 rounded-xl text-white font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
            >
                {submitting ? "Saving..." : submitLabel || "Save Fee Type"}
            </button>
        </div>
    );
}
