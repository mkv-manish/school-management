"use client";

import { useEffect, useMemo, useState } from "react";
import {
    addFeePayment,
    createFee,
    createFeesForClass,
    deleteFee,
    getAllFees,
    getAllStudents,
    getClasses,
    updateFee,
    generateFeesFromStructure,
} from "@/services/api";
import BulkFeeForm from "@/components/fees/BulkFeeForm";
import FeeForm from "@/components/fees/FeeForm";
import FeePaymentForm from "@/components/fees/FeePaymentForm";
import FeePaymentHistory from "@/components/fees/FeePaymentHistory";
import FeeReceipt from "@/components/fees/FeeReceipt";
import FeeSummaryCards from "@/components/fees/FeeSummaryCards";
import FeeTable from "@/components/fees/FeeTable";
import GenerateFeeFromStructureForm from "@/components/fees/GenerateFeeFromStructureForm";

type StudentOption = {
    _id: string;
    classId?: { _id?: string; className?: string; section?: string };
    userId?: { name?: string; email?: string };
};

type ClassOption = {
    _id: string;
    className?: string;
    section?: string;
};

type FeeFormValues = {
    studentId: string;
    classId: string;
    month: string;
    totalAmount: string;
    paidAmount: string;
    dueDate: string;
    paymentDate: string;
    receiptNo: string;
    remarks: string;
};

type PaymentFormValues = {
    amount: string;
    paymentDate: string;
    receiptNo: string;
    method: string;
    remarks: string;
};

type BulkFeeFormValues = {
    classId: string;
    month: string;
    totalAmount: string;
    paidAmount: string;
    dueDate: string;
    paymentDate: string;
    receiptNo: string;
    remarks: string;
};

const initialValues: FeeFormValues = {
    studentId: "",
    classId: "",
    month: "",
    totalAmount: "",
    paidAmount: "",
    dueDate: "",
    paymentDate: "",
    receiptNo: "",
    remarks: "",
};

const initialPaymentValues: PaymentFormValues = {
    amount: "",
    paymentDate: "",
    receiptNo: "",
    method: "cash",
    remarks: "",
};

const initialBulkValues: BulkFeeFormValues = {
    classId: "",
    month: "",
    totalAmount: "",
    paidAmount: "",
    dueDate: "",
    paymentDate: "",
    receiptNo: "",
    remarks: "",
};

export default function AdminFeesPage() {
    const [token, setToken] = useState<string | null>(null);

    const [students, setStudents] = useState<StudentOption[]>([]);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [fees, setFees] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [paymentSubmitting, setPaymentSubmitting] = useState(false);
    const [bulkSubmitting, setBulkSubmitting] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedFee, setSelectedFee] = useState<any | null>(null);

    const [form, setForm] = useState<FeeFormValues>(initialValues);
    const [paymentForm, setPaymentForm] =
        useState<PaymentFormValues>(initialPaymentValues);
    const [bulkForm, setBulkForm] =
        useState<BulkFeeFormValues>(initialBulkValues);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "" | "paid" | "partial" | "unpaid"
    >("");
    const [monthFilter, setMonthFilter] = useState("");

    const [structureSubmitting, setStructureSubmitting] = useState(false);

    const [structureForm, setStructureForm] = useState({
        classId: "",
        month: "",
        dueDate: "",
        remarks: "",
    });

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const load = async (authToken: string) => {
        try {
            setLoading(true);

            const [studentData, feeData, classData] = await Promise.all([
                getAllStudents(authToken, { page: 1, limit: 100 }),
                getAllFees(authToken),
                getClasses(authToken),
            ]);

            setStudents(studentData.students || []);
            setFees(Array.isArray(feeData) ? feeData : []);
            setClasses(
                Array.isArray(classData) ? classData : classData?.classes || [],
            );

            if (selectedFee?._id) {
                const freshSelected = (
                    Array.isArray(feeData) ? feeData : []
                ).find((row: any) => row._id === selectedFee._id);
                setSelectedFee(freshSelected || null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        load(token);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const filteredFees = useMemo(() => {
        return fees.filter((row) => {
            const studentName =
                row.studentId?.userId?.name?.toLowerCase() || "";
            const studentEmail =
                row.studentId?.userId?.email?.toLowerCase() || "";
            const month = row.month?.toLowerCase() || "";
            const feeType = row.feeTypeId?.name?.toLowerCase() || "";
            const q = search.trim().toLowerCase();

            const matchSearch =
                !q ||
                studentName.includes(q) ||
                studentEmail.includes(q) ||
                month.includes(q) ||
                feeType.includes(q);

            const matchStatus = !statusFilter || row.status === statusFilter;
            const matchMonth =
                !monthFilter ||
                month.includes(monthFilter.trim().toLowerCase());

            return matchSearch && matchStatus && matchMonth;
        });
    }, [fees, search, statusFilter, monthFilter]);

    const onChange = (key: keyof FeeFormValues, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const onPaymentChange = (key: keyof PaymentFormValues, value: string) => {
        setPaymentForm((prev) => ({ ...prev, [key]: value }));
    };

    const onBulkChange = (key: keyof BulkFeeFormValues, value: string) => {
        setBulkForm((prev) => ({ ...prev, [key]: value }));
    };

    const onStudentChange = (id: string) => {
        const found = students.find((s) => s._id === id);

        setForm((prev) => ({
            ...prev,
            studentId: id,
            classId: found?.classId?._id || "",
        }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(initialValues);
    };

    const onSubmit = async () => {
        if (!token) return;

        if (
            !form.studentId ||
            !form.classId ||
            !form.month ||
            !form.totalAmount
        ) {
            return alert("student, class, month, total amount required");
        }

        try {
            setPosting(true);

            const payload = {
                studentId: form.studentId,
                classId: form.classId,
                month: form.month,
                totalAmount: Number(form.totalAmount),
                paidAmount: Number(form.paidAmount || 0),
                dueDate: form.dueDate,
                paymentDate: form.paymentDate,
                receiptNo: form.receiptNo,
                remarks: form.remarks,
            };

            if (editingId) {
                await updateFee(token, editingId, payload);
                alert("Fee updated ✅");
            } else {
                await createFee(token, payload);
                alert("Fee created ✅");
            }

            resetForm();
            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to save fee");
        } finally {
            setPosting(false);
        }
    };

    const onBulkSubmit = async () => {
        if (!token) return;

        if (!bulkForm.classId || !bulkForm.month || !bulkForm.totalAmount) {
            return alert("class, month, total amount required");
        }

        try {
            setBulkSubmitting(true);

            const data = await createFeesForClass(token, {
                classId: bulkForm.classId,
                month: bulkForm.month,
                totalAmount: Number(bulkForm.totalAmount),
                paidAmount: Number(bulkForm.paidAmount || 0),
                dueDate: bulkForm.dueDate,
                paymentDate: bulkForm.paymentDate,
                receiptNo: bulkForm.receiptNo,
                remarks: bulkForm.remarks,
            });

            alert(
                `Done ✅ Created: ${data.createdCount || 0}, Skipped: ${data.skippedCount || 0}`,
            );

            setBulkForm(initialBulkValues);
            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to generate class fees");
        } finally {
            setBulkSubmitting(false);
        }
    };

    const onStructureChange = (
        key: keyof typeof structureForm,
        value: string,
    ) => {
        setStructureForm((prev) => ({ ...prev, [key]: value }));
    };

    const onGenerateFromStructure = async () => {
        if (!token) return;

        if (!structureForm.classId || !structureForm.month) {
            return alert("class and month required");
        }

        try {
            setStructureSubmitting(true);

            const data = await generateFeesFromStructure(token, {
                classId: structureForm.classId,
                month: structureForm.month,
                dueDate: structureForm.dueDate,
                remarks: structureForm.remarks,
            });

            alert(
                `Done ✅ Created: ${data.createdCount || 0}, Skipped: ${data.skippedCount || 0}`,
            );

            setStructureForm({
                classId: "",
                month: "",
                dueDate: "",
                remarks: "",
            });

            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to generate fees");
        } finally {
            setStructureSubmitting(false);
        }
    };

    const onEdit = (row: any) => {
        setEditingId(row._id);
        setSelectedFee(row);

        setForm({
            studentId: row.studentId?._id || "",
            classId: row.classId?._id || "",
            month: row.month || "",
            totalAmount: String(row.totalAmount ?? ""),
            paidAmount: String(row.paidAmount ?? ""),
            dueDate: row.dueDate || "",
            paymentDate: row.paymentDate || "",
            receiptNo: row.receiptNo || "",
            remarks: row.remarks || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (row: any) => {
        if (!token) return;

        const ok = confirm(
            `Delete fee record for ${row.studentId?.userId?.name || "student"}?`,
        );
        if (!ok) return;

        try {
            await deleteFee(token, row._id);

            if (selectedFee?._id === row._id) {
                setSelectedFee(null);
            }

            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to delete fee");
        }
    };

    const onAddPayment = async () => {
        if (!token || !selectedFee) return;
        if (!paymentForm.amount) return alert("Payment amount required");

        try {
            setPaymentSubmitting(true);

            await addFeePayment(token, selectedFee._id, {
                amount: Number(paymentForm.amount),
                paymentDate: paymentForm.paymentDate,
                receiptNo: paymentForm.receiptNo,
                method: paymentForm.method,
                remarks: paymentForm.remarks,
            });

            setPaymentForm(initialPaymentValues);
            await load(token);
            alert("Payment added ✅");
        } catch (e: any) {
            alert(e?.message || "Failed to add payment");
        } finally {
            setPaymentSubmitting(false);
        }
    };

    return (
        <div className="space-y-5">
            <FeeForm
                students={students}
                values={form}
                onChange={onChange}
                onStudentChange={onStudentChange}
                onSubmit={onSubmit}
                submitting={posting}
                submitLabel={editingId ? "Update Fee" : "Save Fee"}
                disableStudent={!!editingId}
            />

            {editingId ? (
                <div className="flex justify-end">
                    <button
                        onClick={resetForm}
                        className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50 font-semibold"
                    >
                        Cancel Edit
                    </button>
                </div>
            ) : null}

            <BulkFeeForm
                classes={classes}
                values={bulkForm}
                onChange={onBulkChange}
                onSubmit={onBulkSubmit}
                submitting={bulkSubmitting}
            />

            <GenerateFeeFromStructureForm
                classes={classes}
                values={structureForm}
                onChange={onStructureChange}
                onSubmit={onGenerateFromStructure}
                submitting={structureSubmitting}
            />

            <FeeSummaryCards rows={filteredFees} />

            <div className="rounded-2xl border bg-white shadow-sm p-5">
                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        className="border rounded-xl p-3"
                        placeholder="Search student / email / month"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <input
                        className="border rounded-xl p-3"
                        placeholder="Filter by month"
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                    />

                    <select
                        className="border rounded-xl p-3 bg-white"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as
                                    | ""
                                    | "paid"
                                    | "partial"
                                    | "unpaid",
                            )
                        }
                    >
                        <option value="">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="partial">Partial</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
            </div>

            {selectedFee ? (
                <>
                    <FeePaymentForm
                        values={paymentForm}
                        onChange={onPaymentChange}
                        onSubmit={onAddPayment}
                        submitting={paymentSubmitting}
                    />

                    <FeeReceipt fee={selectedFee} />

                    <FeePaymentHistory payments={selectedFee.payments || []} />
                </>
            ) : null}

            {loading ? (
                <div className="p-5 text-slate-600">Loading fees...</div>
            ) : (
                <FeeTable
                    rows={filteredFees}
                    showStudent
                    onSelect={setSelectedFee}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}
