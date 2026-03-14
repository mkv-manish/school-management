"use client";

import Sidebar from "@/components/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedRole = localStorage.getItem("role");

        setRole(savedRole);

        if (!token) {
            router.push("/login");
            return;
        }

        if (savedRole !== "admin") {
            if (savedRole === "teacher") {
                router.push("/teacher");
                return;
            }

            if (savedRole === "student" || savedRole === "parent") {
                router.push("/student");
                return;
            }

            router.push("/login");
        }
    }, [router]);

    const title = useMemo(() => {
        const map: Record<string, string> = {
            "/dashboard": "Dashboard",
            "/dashboard/approvals": "Approvals",
            "/dashboard/students": "Students",
            "/dashboard/teachers": "Teachers",
            "/dashboard/classes": "Classes",
            "/dashboard/attendance": "Attendance",
            "/dashboard/results": "Results",
            "/dashboard/notices": "Notices",
            "/dashboard/fees": "Fees",
            "/dashboard/fee-types": "Fee Types",
            "/dashboard/fee-structure": "Fee Structure",
        };

        return map[pathname] || "Dashboard";
    }, [pathname]);

    const logout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile topbar */}
            <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-xl border bg-white hover:bg-slate-50"
                        aria-label="Open menu"
                    >
                        <Menu size={18} />
                    </button>

                    <div className="font-semibold">{title}</div>

                    <button
                        onClick={logout}
                        className="p-2 rounded-xl border bg-white hover:bg-slate-50"
                        aria-label="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Desktop sidebar */}
                <aside className="hidden md:block sticky top-0 h-screen flex-shrink-0 overflow-hidden">
                    <Sidebar />
                </aside>

                {/* Mobile drawer */}
                {open && (
                    <div className="md:hidden fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setOpen(false)}
                        />
                        <div className="absolute left-0 top-0 h-screen w-80 bg-white shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <div className="font-bold">School ERP</div>
                                <button
                                    className="p-2 rounded-xl border hover:bg-slate-50"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="h-[calc(100vh-61px)] overflow-hidden">
                                <Sidebar onNavigate={() => setOpen(false)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Main */}
                <main className="flex-1 min-w-0">
                    {/* Desktop topbar */}
                    <div className="hidden md:block sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
                        <div className="flex items-center justify-between px-6 py-4">
                            <div>
                                <div className="text-lg font-semibold">
                                    {title}
                                </div>
                                <div className="text-xs text-slate-500">
                                    Role:{" "}
                                    <span className="font-medium">
                                        {role || "-"}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 md:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
