"use client";

import { useEffect, useState } from "react";
import {
    createFeeType,
    deleteFeeType,
    getFeeTypes,
    updateFeeType,
} from "@/services/api";
import FeeTypeForm from "@/components/fees/FeeTypeForm";
import FeeTypeTable from "@/components/fees/FeeTypeTable";

const initialValues = {
    name: "",
    code: "",
    description: "",
    isActive: true,
};

export default function FeeTypesPage() {
    const [token, setToken] = useState<string | null>(null);
    const [rows, setRows] = useState<any[]>([]);
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
            const data = await getFeeTypes(authToken);
            setRows(data || []);
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
        if (!form.name || !form.code) {
            return alert("name and code required");
        }

        try {
            setPosting(true);

            if (editingId) {
                await updateFeeType(token, editingId, form);
                alert("Fee type updated ✅");
            } else {
                await createFeeType(token, form);
                alert("Fee type created ✅");
            }

            resetForm();
            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to save fee type");
        } finally {
            setPosting(false);
        }
    };

    const onEdit = (row: any) => {
        setEditingId(row._id);
        setForm({
            name: row.name || "",
            code: row.code || "",
            description: row.description || "",
            isActive: !!row.isActive,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onDelete = async (row: any) => {
        if (!token) return;

        const ok = confirm(`Delete fee type "${row.name}"?`);
        if (!ok) return;

        try {
            await deleteFeeType(token, row._id);
            await load(token);
        } catch (e: any) {
            alert(e?.message || "Failed to delete fee type");
        }
    };

    return (
        <div className="space-y-5">
            <FeeTypeForm
                values={form}
                onChange={onChange}
                onSubmit={onSubmit}
                submitting={posting}
                submitLabel={editingId ? "Update Fee Type" : "Save Fee Type"}
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
                <div className="p-5 text-slate-600">Loading fee types...</div>
            ) : (
                <FeeTypeTable rows={rows} onEdit={onEdit} onDelete={onDelete} />
            )}
        </div>
    );
}
