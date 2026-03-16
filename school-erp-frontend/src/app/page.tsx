"use client";

import Link from "next/link";
import {
    GraduationCap,
    Users,
    BookOpen,
    ClipboardList,
    Wallet,
    Bell,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                            SE
                        </div>
                        <span className="font-bold text-lg">School ERP</span>
                    </div>

                    <Link
                        href="/login"
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                    >
                        Login
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">
                            <ShieldCheck size={16} />
                            School Management Platform
                        </div>

                        <h1 className="mt-6 text-4xl md:text-5xl font-bold text-slate-900">
                            Complete School ERP System
                        </h1>

                        <p className="mt-4 text-slate-600 text-lg max-w-xl">
                            Manage students, teachers, attendance, homework,
                            results, notices, and fees from one centralized
                            platform designed for schools.
                        </p>

                        <div className="mt-8 flex gap-4">
                            <Link
                                href="/login"
                                className="px-6 py-3 rounded-xl bg-slate-900 text-white flex items-center gap-2 hover:bg-slate-800"
                            >
                                Login to Dashboard
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FeatureCard
                            icon={<GraduationCap size={22} />}
                            title="Student Management"
                        />
                        <FeatureCard
                            icon={<Users size={22} />}
                            title="Teacher Management"
                        />
                        <FeatureCard
                            icon={<ClipboardList size={22} />}
                            title="Attendance System"
                        />
                        <FeatureCard
                            icon={<BookOpen size={22} />}
                            title="Class Management"
                        />
                        <FeatureCard
                            icon={<Wallet size={22} />}
                            title="Fee Management"
                        />
                        <FeatureCard
                            icon={<Bell size={22} />}
                            title="Notice System"
                        />
                    </div>
                </div>
            </section>

            {/* Roles */}
            <section className="bg-white border-t border-b py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-slate-900">
                        Built for Every Role
                    </h2>

                    <div className="mt-10 grid md:grid-cols-4 gap-6">
                        <RoleCard
                            title="Admin"
                            description="Manage users, classes, results, notices and full system control."
                        />
                        <RoleCard
                            title="Teacher"
                            description="Manage attendance, homework, results and student records."
                        />
                        <RoleCard
                            title="Student"
                            description="View homework, results, notices and fee records."
                        />
                        <RoleCard
                            title="Parent"
                            description="Track child progress, attendance and fee payments."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-slate-900">
                    Start Managing Your School Efficiently
                </h2>

                <p className="mt-4 text-slate-600">
                    Secure, modern and scalable ERP system built for schools.
                </p>

                <Link
                    href="/login"
                    className="inline-flex mt-6 px-8 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                >
                    Login to System
                </Link>
            </section>

            {/* Footer */}
            <footer className="border-t bg-white">
                <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
                    <span>
                        © {new Date().getFullYear()} God Father International
                        School, Naitand. All rights reserved.
                    </span>

                    <span>
                        Developed & Maintaine by{" "}
                        <span className="font-semibold text-slate-700">
                            Manish Kumar
                        </span>
                    </span>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                {icon}
            </div>
            <div className="mt-4 font-semibold text-slate-900">{title}</div>
        </div>
    );
}

function RoleCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border bg-slate-50 p-6 text-center">
            <div className="font-semibold text-lg text-slate-900">{title}</div>
            <p className="text-sm text-slate-600 mt-2">{description}</p>
        </div>
    );
}
