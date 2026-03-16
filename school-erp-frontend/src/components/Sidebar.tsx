"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    BookOpen,
    ClipboardList,
    FileText,
    Bell,
    LogOut,
    Sparkles,
    Trophy,
    CalendarDays,
    FolderCheck,
    Wallet,
    Receipt,
    Landmark,
} from "lucide-react";

type Props = { onNavigate?: () => void };

export default function Sidebar({ onNavigate }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);

    const logout = () => {
        localStorage.clear();
        router.push("/login");
    };

    const links = useMemo(() => {
        const base = [
            {
                label: "Dashboard",
                href:
                    role === "teacher"
                        ? "/teacher"
                        : role === "student" || role === "parent"
                          ? "/student"
                          : "/dashboard",
                icon: LayoutDashboard,
                roles: ["admin", "teacher", "student", "parent"],
            },
        ];

        const admin = [
            {
                label: "Approvals",
                href: "/dashboard/approvals",
                icon: Users,
            },
            {
                label: "Students",
                href: "/dashboard/students",
                icon: GraduationCap,
            },
            {
                label: "Teachers",
                href: "/dashboard/teachers",
                icon: Users,
            },
            {
                label: "Classes",
                href: "/dashboard/classes",
                icon: BookOpen,
            },
            {
                label: "Attendance",
                href: "/dashboard/attendance",
                icon: ClipboardList,
            },
            {
                label: "Notices",
                href: "/dashboard/notices",
                icon: Bell,
            },
            {
                label: "Fees",
                href: "/dashboard/fees",
                icon: Wallet,
            },
            {
                label: "Fee Types",
                href: "/dashboard/fee-types",
                icon: Receipt,
            },
            {
                label: "Fee Structure",
                href: "/dashboard/fee-structure",
                icon: Landmark,
            },
        ].map((x) => ({ ...x, roles: ["admin"] }));

        const teacher = [
            {
                label: "Attendance",
                href: "/teacher/attendance",
                icon: ClipboardList,
            },
            {
                label: "Homework",
                href: "/teacher/homework",
                icon: FileText,
            },
            {
                label: "Students",
                href: "/teacher/students",
                icon: GraduationCap,
            },
            {
                label: "Notices",
                href: "/teacher/notices",
                icon: Bell,
            },
            {
                label: "Submissions",
                href: "/teacher/submissions",
                icon: FolderCheck,
            },
            {
                label: "Results",
                href: "/teacher/results",
                icon: Trophy,
            },
        ].map((x) => ({ ...x, roles: ["teacher"] }));

        const student = [
            {
                label: "Homework",
                href: "/student/homework",
                icon: FileText,
            },
            {
                label: "Notices",
                href: "/student/notices",
                icon: Bell,
            },
            {
                label: "Attendance",
                href: "/student/attendance",
                icon: CalendarDays,
            },
            {
                label: "Results",
                href: "/student/results",
                icon: Trophy,
            },
            {
                label: "Fees",
                href: "/student/fees",
                icon: Wallet,
            },
        ].map((x) => ({ ...x, roles: ["student", "parent"] }));

        return [...base, ...admin, ...teacher, ...student].filter((l) =>
            role ? l.roles.includes(role) : false,
        );
    }, [role]);

    const isActive = (href: string) => {
        if (
            href === "/dashboard" ||
            href === "/teacher" ||
            href === "/student"
        ) {
            return pathname === href;
        }
        return pathname === href || pathname.startsWith(href + "/");
    };

    const panelLabel =
        role === "admin"
            ? "Admin Panel"
            : role === "teacher"
              ? "Teacher Panel"
              : role === "parent"
                ? "Parent Portal"
                : "Student Portal";

    return (
        <aside className="h-screen w-72 bg-white border-r flex flex-col overflow-hidden">
            <div className="px-5 py-5 border-b shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
                        SE
                    </div>
                    <div>
                        <div className="font-bold leading-tight flex items-center gap-2">
                            School ERP
                            <Sparkles size={16} className="text-slate-400" />
                        </div>
                        <div className="text-xs text-slate-500">
                            {panelLabel} •{" "}
                            <span className="font-semibold capitalize">
                                {role || "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="p-3 flex-1 overflow-hidden">
                <div className="text-xs font-semibold text-slate-500 px-3 py-2">
                    MENU
                </div>

                <div className="space-y-1">
                    {links.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);

                        return (
                            <Link
                                key={`${item.href}-${item.label}`}
                                href={item.href}
                                onClick={onNavigate}
                                className={[
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition",
                                    active
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "hover:bg-slate-100 text-slate-700",
                                ].join(" ")}
                            >
                                <Icon size={18} />
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-3 border-t shrink-0">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-red-600"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}
