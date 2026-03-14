"use client";

export default function FeeDueCard({ rows }: { rows: any[] }) {
    const totalFees = rows.reduce(
        (sum, row) => sum + Number(row.totalAmount || 0),
        0,
    );
    const totalPaid = rows.reduce(
        (sum, row) => sum + Number(row.paidAmount || 0),
        0,
    );
    const totalDue = totalFees - totalPaid;

    const nextDue = rows.find((row) => row.status !== "paid" && row.dueDate);

    return (
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-5 shadow-sm">
            <div className="text-sm text-slate-200">Fee Due Summary</div>
            <div className="mt-2 text-3xl font-bold">₹{totalDue}</div>
            <div className="mt-2 text-sm text-slate-200">
                {nextDue?.dueDate
                    ? `Next due date: ${nextDue.dueDate}`
                    : "No upcoming due date"}
            </div>
        </div>
    );
}
