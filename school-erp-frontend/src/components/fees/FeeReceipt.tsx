"use client";

export default function FeeReceipt({ fee }: { fee: any }) {
    const due = Math.max(
        0,
        Number(fee.totalAmount || 0) - Number(fee.paidAmount || 0),
    );

    const onPrint = () => {
        window.print();
    };

    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5 print:shadow-none print:border-none">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="text-2xl font-bold text-slate-900">
                        Fee Receipt
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                        Receipt No: {fee.receiptNo || "-"}
                    </div>
                </div>

                <button
                    onClick={onPrint}
                    className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold print:hidden"
                >
                    Print
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-slate-500">Student</div>
                    <div className="font-semibold text-slate-900">
                        {fee.studentId?.userId?.name || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Email</div>
                    <div className="font-semibold text-slate-900">
                        {fee.studentId?.userId?.email || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Class</div>
                    <div className="font-semibold text-slate-900">
                        {fee.classId?.className || "-"}{" "}
                        {fee.classId?.section || ""}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Month</div>
                    <div className="font-semibold text-slate-900">
                        {fee.month || "-"}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Total Amount</div>
                    <div className="font-semibold text-slate-900">
                        ₹{fee.totalAmount}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Paid Amount</div>
                    <div className="font-semibold text-slate-900">
                        ₹{fee.paidAmount}
                    </div>
                </div>

                <div>
                    <div className="text-slate-500">Due Amount</div>
                    <div className="font-semibold text-slate-900">₹{due}</div>
                </div>

                <div>
                    <div className="text-slate-500">Payment Date</div>
                    <div className="font-semibold text-slate-900">
                        {fee.paymentDate || "-"}
                    </div>
                </div>
            </div>
        </div>
    );
}
