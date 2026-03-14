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

export default function TeacherNoticesPage() {
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
        <div className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 shadow-sm">
                <h1 className="text-2xl font-bold">Notices</h1>
                <p className="text-sm opacity-80 mt-1">
                    View school announcements shared by admin.
                </p>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-6 text-slate-600">Loading notices...</div>
                ) : notices.length === 0 ? (
                    <div className="p-6 text-slate-600">
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
