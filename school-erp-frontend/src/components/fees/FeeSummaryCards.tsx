"use client";

type FeeRow = {
    totalAmount: number;
    paidAmount: number;
    status: "paid" | "partial" | "unpaid";
};

export default function FeeSummaryCards({ rows }: { rows: FeeRow[] }) {
    const totalFees = rows.reduce(
        (sum, row) => sum + Number(row.totalAmount || 0),
        0,
    );
    const totalPaid = rows.reduce(
        (sum, row) => sum + Number(row.paidAmount || 0),
        0,
    );
    const totalDue = totalFees - totalPaid;

    const paidCount = rows.filter((r) => r.status === "paid").length;
    const partialCount = rows.filter((r) => r.status === "partial").length;
    const unpaidCount = rows.filter((r) => r.status === "unpaid").length;

    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
            <Card title="Total Fees" value={`₹${totalFees}`} />
            <Card title="Total Paid" value={`₹${totalPaid}`} />
            <Card title="Total Due" value={`₹${totalDue}`} />
            <Card title="Paid Records" value={String(paidCount)} />
            <Card
                title="Pending Records"
                value={String(partialCount + unpaidCount)}
            />
        </div>
    );
}

function Card({ title, value }: { title: string; value: string }) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="text-sm text-slate-500 font-medium">{title}</div>
            <div className="mt-2 text-2xl font-bold text-slate-900">
                {value}
            </div>
        </div>
    );
}
