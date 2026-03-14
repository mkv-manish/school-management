"use client";

type PaymentRow = {
    amount: number;
    paymentDate?: string;
    receiptNo?: string;
    method?: string;
    remarks?: string;
};

export default function FeePaymentHistory({
    payments,
}: {
    payments: PaymentRow[];
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b bg-slate-50">
                <div className="font-semibold text-slate-900">
                    Payment History
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50 border-b">
                        <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                            <th className="px-5 py-3">Amount</th>
                            <th className="px-5 py-3">Payment Date</th>
                            <th className="px-5 py-3">Receipt</th>
                            <th className="px-5 py-3">Method</th>
                            <th className="px-5 py-3">Remarks</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {payments.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-5 py-6 text-slate-600"
                                >
                                    No payment history found.
                                </td>
                            </tr>
                        ) : (
                            payments.map((p, i) => (
                                <tr key={i}>
                                    <td className="px-5 py-4">₹{p.amount}</td>
                                    <td className="px-5 py-4">
                                        {p.paymentDate || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {p.receiptNo || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {p.method || "-"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {p.remarks || "-"}
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
