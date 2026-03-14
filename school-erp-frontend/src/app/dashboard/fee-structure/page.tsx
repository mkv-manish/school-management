"use client";

import { useEffect, useState } from "react";
import {
    createFeeStructure,
    deleteFeeStructure,
    getClasses,
    getFeeStructures,
    getFeeTypes,
    updateFeeStructure,
} from "@/services/api";
import FeeStructureForm from "@/components/fees/FeeStructureForm";
import FeeStructureTable from "@/components/fees/FeeStructureTable";

const initialValues = {
    classId: "",
    feeTypeId: "",
    amount: "",
    frequency: "monthly",
    isOptional: false,
    notes: "",
};

export default function FeeStructurePage() {
    const [token, setToken] = useState<string | null>(null);
    const [rows, setRows] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [feeTypes, setFeeTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(initialValues);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, []);

    const load = async (authToken: string) => {
        try {
            setLoading(true);

            const [structureData, classData, feeTypeData] = await Promise.all([
                getFeeStructures(authToken),
                getClasses(authToken),
                getFeeTypes(authToken),
            ]);

            setRows(Array.isArray(structureData) ? structureData : []);
            setClasses(
                Array.isArray(classData) ? classData : classData?.classes || [],
            );
            setFeeTypes(Array.isArray(feeTypeData) ? feeTypeData : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) return;
        load(token);
    }, [token]);

    const onChange = (key: string, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const resetForm = () => {
        setEditingId(null);
        setForm(initialValues);
    };

    const onSubmit = async () => {
        if (!token) return;
        if (!form.classId || !form.feeTypeId || !form.amount) {
            return alert("class, fee type and amount required");
        }

        try {
            setPosting(true);

            const payload = {
                classId: form.classId,
                feeTypeId: form.feeTypeId,
                amount: Number(form.amount),
                frequency: form.frequency,
                isOptional: form.isOptional,
                notes: form.notes,
            };

            if (editingId) {
                await updateFeeStructure(token, editingId, payload);
                alert("Fee structure updated ✅");
            } else {
                await createFeeStructure(token, payload);
                alert("Fee structure created ✅");
            }

            resetForm();
            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to save fee structure");
        } finally {
            setPosting(false);
        }
    };

    const onEdit = (row: any) => {
        setEditingId(row._id);
        setForm({
            classId: row.classId?._id || "",
            feeTypeId: row.feeTypeId?._id || "",
            amount: String(row.amount ?? ""),
            frequency: row.frequency || "monthly",
            isOptional: !!row.isOptional,
            notes: row.notes || "",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (row: any) => {
        if (!token) return;

        const ok = confirm("Delete this fee structure?");
        if (!ok) return;

        try {
            await deleteFeeStructure(token, row._id);
            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to delete fee structure");
        }
    };

    return (
        <div className="space-y-5">
            <FeeStructureForm
                classes={classes}
                feeTypes={feeTypes}
                values={form}
                onChange={onChange}
                onSubmit={onSubmit}
                submitting={posting}
                submitLabel={editingId ? "Update Structure" : "Save Structure"}
                disableKeys={!!editingId}
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

            {loading ? (
                <div className="p-5 text-slate-600">
                    Loading fee structures...
                </div>
            ) : (
                <FeeStructureTable
                    rows={rows}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            )}
        </div>
    );
}
