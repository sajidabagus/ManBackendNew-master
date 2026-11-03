"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  fetchUsers,
  fetchRoles,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/api/users";
import { getApiErrorMessage } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { DataTable, type Column } from "@/components/admin/ui/DataTable";
import { TableSkeleton } from "@/components/admin/ui/LoadingSkeleton";
import { Pagination } from "@/components/admin/ui/Pagination";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { FormField, inputClass, selectClass } from "@/components/admin/ui/FormField";
import type { ApiUser, PaginatedMeta } from "@/types/api";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8).optional().or(z.literal("")),
  phone: z.string().optional(),
  role: z.string().min(1),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export default function UsersPage() {
  const [items, setItems] = useState<ApiUser[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ApiUser | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchUsers({ page })
      .then((res) => {
        setItems(res.data);
        setMeta(res.meta);
      })
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => {
    load();
    fetchRoles().then(setRoles).catch(console.error);
  }, [load]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditing(null);
    reset({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "operator",
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (user: ApiUser) => {
    setEditing(user);
    reset({
      name: user.name,
      email: user.email,
      password: "",
      phone: user.phone ?? "",
      role: user.roles?.[0] ?? "operator",
      is_active: true,
    });
    setModalOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = { ...values };
        if (!values.password) delete payload.password;
        await updateUser(editing.id, payload);
      } else {
        if (!values.password) {
          alert("Password wajib diisi untuk user baru.");
          return;
        }
        await createUser({
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          phone: values.phone,
          is_active: values.is_active,
        });
      }
      setModalOpen(false);
      load();
    } catch (e) {
      alert(getApiErrorMessage(e));
    }
  };

  const columns: Column<ApiUser>[] = [
    { key: "name", header: "Nama", render: (r) => r.name },
    { key: "email", header: "Email", render: (r) => r.email },
    {
      key: "role",
      header: "Role",
      render: (r) => (
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          {r.roles?.[0] ?? "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openEdit(r)}
            className="rounded-lg p-2 text-primary hover:bg-primary/10"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteId(r.id)}
            className="rounded-lg p-2 text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pengguna & Role"
        description="Kelola akun admin, operator, dan guru"
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </button>
        }
      />

      {loading ? (
        <TableSkeleton />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={items}
            keyExtractor={(r) => r.id}
            emptyMessage="Belum ada pengguna."
          />
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Pengguna" : "Tambah Pengguna"}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Nama" error={errors.name?.message} required>
            <input className={inputClass} {...register("name")} />
          </FormField>
          <FormField label="Email" error={errors.email?.message} required>
            <input className={inputClass} {...register("email")} />
          </FormField>
          <FormField
            label={editing ? "Password (kosongkan jika tidak diubah)" : "Password"}
            error={errors.password?.message}
            required={!editing}
          >
            <input type="password" className={inputClass} {...register("password")} />
          </FormField>
          <FormField label="Telepon">
            <input className={inputClass} {...register("phone")} />
          </FormField>
          <FormField label="Role" required>
            <select className={selectClass} {...register("role")}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("is_active")} />
            Aktif
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-primary py-2.5 font-semibold text-white"
          >
            Simpan
          </button>
        </form>
      </AdminModal>

      <AdminModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Pengguna"
        size="sm"
      >
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setDeleteId(null)}>
            Batal
          </button>
          <button
            type="button"
            className="rounded-xl bg-red-500 px-4 py-2 text-sm text-white"
            onClick={async () => {
              if (!deleteId) return;
              try {
                await deleteUser(deleteId);
                setDeleteId(null);
                load();
              } catch (e) {
                alert(getApiErrorMessage(e));
              }
            }}
          >
            Hapus
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
