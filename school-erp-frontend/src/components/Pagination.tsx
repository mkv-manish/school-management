"use client";

type PaginationProps = {
    page: number;
    totalPages: number;
    loading?: boolean;
    onPrev: () => void;
    onNext: () => void;
    label?: string;
};

export default function Pagination({
    page,
    totalPages,
    loading = false,
    onPrev,
    onNext,
    label,
}: PaginationProps) {
    return (
        <div className="border-t bg-white px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-slate-500">
                {label ? (
                    <>
                        {label} •{" "}
                        <span className="font-semibold text-slate-900">
                            Page {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">
                            {totalPages}
                        </span>
                    </>
                ) : (
                    <>
                        Page{" "}
                        <span className="font-semibold text-slate-900">
                            {page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">
                            {totalPages}
                        </span>
                    </>
                )}
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50"
                    disabled={page === 1 || loading}
                    onClick={onPrev}
                >
                    Prev
                </button>

                <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-900 font-semibold">
                    Page {page}
                </span>

                <button
                    className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50"
                    disabled={loading || page >= totalPages}
                    onClick={onNext}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
