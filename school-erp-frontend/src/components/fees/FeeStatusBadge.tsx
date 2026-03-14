"use client";

export default function FeeStatusBadge({
    status,
}: {
    status: "paid" | "partial" | "unpaid";
}) {
    const styles =
        status === "paid"
            ? "bg-green-50 text-green-700 border-green-100"
            : status === "partial"
              ? "bg-amber-50 text-amber-700 border-amber-100"
              : "bg-red-50 text-red-700 border-red-100";

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles}`}
        >
            {status.toUpperCase()}
        </span>
    );
}
