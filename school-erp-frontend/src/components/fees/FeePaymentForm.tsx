"use client";

type PaymentValues = {
    amount: string;
    paymentDate: string;
    receiptNo: string;
    method: string;
    remarks: string;
};

export default function FeePaymentForm({
    values,
    onChange,
    onSubmit,
    submitting,
}: {
    values: PaymentValues;
    onChange: (key: keyof PaymentValues, value: string) => void;
    onSubmit: () => void;
    submitting?: boolean;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="font-semibold text-slate-900 mb-4">Add Payment</div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <input
                    className="border rounded-xl p-3"
                    placeholder="Amount"
                    type="number"
                    value={values.amount}
                    onChange={(e) => onChange("amount", e.target.value)}
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
                    placeholder="Method (cash / upi / online)"
                    value={values.method}
                    onChange={(e) => onChange("method", e.target.value)}
                />

                <input
                    className="border rounded-xl p-3"
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
                {submitting ? "Saving..." : "Add Payment"}
            </button>
        </div>
    );
}
