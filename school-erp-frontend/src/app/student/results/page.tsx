"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Trophy, BookOpen, Percent } from "lucide-react";
import { getMyResults } from "@/services/api";

type ResultItem = {
    _id: string;
    subject: string;
    marksObtained: number;
    totalMarks: number;
    examType: "midterm" | "final" | "unit-test";
};

export default function StudentResultsPage() {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<ResultItem[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        (async () => {
            try {
                const data = await getMyResults(token);
                setResults(data.results || []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const percentages = useMemo(() => {
        return results.map((item) =>
            item.totalMarks
                ? Math.round((item.marksObtained / item.totalMarks) * 100)
                : 0,
        );
    }, [results]);

    const overallPercentage = useMemo(() => {
        if (!results.length) return 0;
        const total = percentages.reduce((sum, p) => sum + p, 0);
        return Math.round(total / results.length);
    }, [percentages, results.length]);

    const topSubject = useMemo(() => {
        if (!results.length) return null;
        return [...results].sort(
            (a, b) =>
                b.marksObtained / b.totalMarks - a.marksObtained / a.totalMarks,
        )[0];
    }, [results]);

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Results</h1>
                <p className="text-slate-600 mt-2">
                    Check subject-wise marks and performance summary.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card
                    title="Overall Percentage"
                    value={`${overallPercentage}%`}
                    subtitle="Academic performance"
                    icon={<Percent size={18} />}
                />
                <Card
                    title="Top Subject"
                    value={topSubject?.subject || "-"}
                    subtitle={
                        topSubject
                            ? `${topSubject.marksObtained}/${topSubject.totalMarks}`
                            : "No result data"
                    }
                    icon={<Trophy size={18} />}
                />
                <Card
                    title="Result Entries"
                    value={String(results.length)}
                    subtitle="Available records"
                    icon={<BookOpen size={18} />}
                />
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b bg-slate-50 flex items-center gap-2">
                    <BarChart3 size={18} className="text-slate-700" />
                    <h2 className="text-lg font-semibold text-slate-900">
                        Subject-wise Results
                    </h2>
                </div>

                {loading ? (
                    <div className="p-6 text-slate-600">Loading results...</div>
                ) : results.length === 0 ? (
                    <div className="p-6 text-slate-500">No results found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                                        Subject
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                                        Marks
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                                        Total
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                                        Percentage
                                    </th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-700">
                                        Exam Type
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item) => {
                                    const percentage = item.totalMarks
                                        ? Math.round(
                                              (item.marksObtained /
                                                  item.totalMarks) *
                                                  100,
                                          )
                                        : 0;

                                    return (
                                        <tr
                                            key={item._id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3 text-slate-900 font-medium">
                                                {item.subject}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.marksObtained}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.totalMarks}
                                            </td>
                                            <td className="px-4 py-3">
                                                {percentage}%
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 capitalize">
                                                    {item.examType}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function Card({
    title,
    value,
    subtitle,
    icon,
}: {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-white shadow-sm p-5">
            <div className="flex items-center justify-between">
                <div className="text-slate-500 text-sm font-medium">
                    {title}
                </div>
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    {icon}
                </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">
                {value}
            </div>
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
    );
}
