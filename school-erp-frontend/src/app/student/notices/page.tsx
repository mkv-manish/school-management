"use client";

import { useEffect, useState } from "react";
import { getNotices } from "@/services/api";
import { Bell } from "lucide-react";

type NoticeItem = {
    _id: string;
    title: string;
    description?: string;
    createdAt?: string;
    attachment?: string;
};

const FILE_BASE = "http://localhost:5000";

export default function StudentNoticesPage() {
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        (async () => {
            try {
                const data = await getNotices(token);
                setNotices(Array.isArray(data) ? data : data.notices || []);
            } catch {
                setNotices([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900">
                    School Notices
                </h1>
                <p className="text-slate-600 mt-2">
                    Stay updated with recent school announcements.
                </p>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-slate-600">Loading notices...</div>
                ) : notices.length === 0 ? (
                    <div className="p-10 text-center text-slate-500">
                        No notices available.
                    </div>
                ) : (
                    <div className="divide-y">
                        {notices.map((notice) => (
                            <div key={notice._id} className="p-5">
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                                        <Bell size={18} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-semibold text-slate-900">
                                            {notice.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {notice.description ||
                                                "No description provided."}
                                        </p>

                                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                                            {notice.createdAt ? (
                                                <span>
                                                    {new Date(
                                                        notice.createdAt,
                                                    ).toLocaleDateString()}
                                                </span>
                                            ) : null}

                                            {notice.attachment ? (
                                                <a
                                                    href={`${FILE_BASE}${notice.attachment}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-slate-900 font-medium hover:underline"
                                                >
                                                    View attachment
                                                </a>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
