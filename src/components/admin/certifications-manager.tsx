"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Loader2, Award, ExternalLink } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuerUrl: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  issueDate: string;
  expiryDate: string | null;
  order: number;
  isActive: boolean;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function isExpired(expiryDate: string | null) {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    name: "", issuer: "", issuerUrl: "", credentialId: "",
    credentialUrl: "", imageUrl: "", issueDate: "", expiryDate: "", noExpiry: true,
  });

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/certifications");
      if (res.ok) setCertifications(await res.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForm = () => {
    setForm({ name: "", issuer: "", issuerUrl: "", credentialId: "", credentialUrl: "", imageUrl: "", issueDate: "", expiryDate: "", noExpiry: true });
    setEditingId(null);
    setFormError("");
  };

  const openNew = () => { resetForm(); setShowForm(true); };

  const openEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setForm({
      name: cert.name, issuer: cert.issuer, issuerUrl: cert.issuerUrl || "",
      credentialId: cert.credentialId || "", credentialUrl: cert.credentialUrl || "",
      imageUrl: cert.imageUrl || "", issueDate: cert.issueDate.split("T")[0],
      expiryDate: cert.expiryDate ? cert.expiryDate.split("T")[0] : "",
      noExpiry: !cert.expiryDate,
    });
    setShowForm(true);
  };

  const saveCertification = async () => {
    setIsSaving(true);
    setFormError("");
    try {
      const url = editingId ? `/api/admin/certifications/${editingId}` : "/api/admin/certifications";
      const method = editingId ? "PUT" : "POST";
      const body = {
        name: form.name,
        issuer: form.issuer,
        issuerUrl: form.issuerUrl || undefined,
        credentialId: form.credentialId || undefined,
        credentialUrl: form.credentialUrl || undefined,
        imageUrl: form.imageUrl || undefined,
        issueDate: form.issueDate,
        expiryDate: form.noExpiry ? undefined : form.expiryDate || undefined,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to save"); return; }
      setShowForm(false);
      resetForm();
      fetchData();
    } catch { setFormError("Something went wrong"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/certifications/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) { console.error("Failed to delete:", error); }
    finally { setIsDeleting(false); setDeleteTarget(null); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-slate-500 animate-spin" /></div>;
  }

  return (
    <>
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={openNew} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer">
          <Plus className="w-4 h-4 mr-1" />Add Certification
        </Button>
      </div>

      {/* List */}
      {certifications.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="flex flex-col items-center py-16">
            <Award className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">No certifications yet</h3>
            <p className="text-slate-500 text-sm mt-1">Tambahkan sertifikasi dan pencapaian kamu</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-amber-400 shrink-0" />
                      <h3 className="font-semibold text-white text-sm">{cert.name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm ml-6">{cert.issuer}</p>
                    <div className="flex items-center gap-2 ml-6 mt-2">
                      <span className="text-slate-500 text-xs">Issued {formatDate(cert.issueDate)}</span>
                      {cert.expiryDate ? (
                        <Badge variant="secondary" className={`text-xs border ${isExpired(cert.expiryDate) ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                          {isExpired(cert.expiryDate) ? "Expired" : `Expires ${formatDate(cert.expiryDate)}`}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-400 border-slate-700">No Expiry</Badge>
                      )}
                    </div>
                    {cert.credentialId && (
                      <p className="text-slate-500 text-xs ml-6 mt-1">ID: {cert.credentialId}</p>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-400 text-xs ml-6 mt-1 hover:underline">
                        <ExternalLink className="w-3 h-3" />Verify
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cert)} className="text-slate-400 hover:text-white cursor-pointer"><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ id: cert.id, name: cert.name })} className="text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); resetForm(); } }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editingId ? "Edit" : "Add"} Certification</DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingId ? "Update sertifikasi" : "Tambahkan sertifikasi baru"}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Certification Name *</Label>
              <Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. AWS Cloud Practitioner" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Issuer *</Label>
                <Input value={form.issuer} onChange={(e) => setForm(p => ({ ...p, issuer: e.target.value }))} placeholder="e.g. Amazon Web Services" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Issuer URL</Label>
                <Input value={form.issuerUrl} onChange={(e) => setForm(p => ({ ...p, issuerUrl: e.target.value }))} placeholder="https://..." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Credential ID</Label>
                <Input value={form.credentialId} onChange={(e) => setForm(p => ({ ...p, credentialId: e.target.value }))} placeholder="e.g. ABC-12345" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Credential URL</Label>
                <Input value={form.credentialUrl} onChange={(e) => setForm(p => ({ ...p, credentialUrl: e.target.value }))} placeholder="https://verify..." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Certificate Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-slate-300">Issue Date *</Label>
                <Input type="date" value={form.issueDate} onChange={(e) => setForm(p => ({ ...p, issueDate: e.target.value }))} className="bg-slate-800/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Expiry Date</Label>
                <Input type="date" value={form.expiryDate} onChange={(e) => setForm(p => ({ ...p, expiryDate: e.target.value }))} disabled={form.noExpiry} className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-50" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.noExpiry} onChange={(e) => setForm(p => ({ ...p, noExpiry: e.target.checked, expiryDate: e.target.checked ? "" : p.expiryDate }))} className="w-4 h-4 rounded border-slate-700 bg-slate-800" />
              <span className="text-sm text-slate-300">No expiration date</span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowForm(false); resetForm(); }} className="text-slate-400 hover:text-white cursor-pointer">Cancel</Button>
            <Button onClick={saveCertification} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {editingId ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Certification</DialogTitle>
            <DialogDescription className="text-slate-400">
              Apakah kamu yakin ingin menghapus &quot;{deleteTarget?.name}&quot;? Tindakan ini tidak bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-white cursor-pointer">Cancel</Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-500 text-white cursor-pointer">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}