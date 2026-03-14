"use client";

import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            router.push("/login");
            return;
        }

        if (role !== "teacher") {
            if (role === "admin") {
                router.push("/dashboard");
                return;
            }

            if (role === "student" || role === "parent") {
                router.push("/student");
                return;
            }

            router.push("/login");
        }
    }, [router]);

    return (
        <div className="h-screen bg-slate-50 overflow-hidden">
            <div className="flex h-full">
                <aside className="hidden md:block h-screen shrink-0 overflow-hidden">
                    <Sidebar />
                </aside>

                <main className="flex-1 min-w-0 h-screen overflow-y-auto p-4 md:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
