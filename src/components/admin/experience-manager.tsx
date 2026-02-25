"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil, Loader2, Briefcase, GraduationCap, X } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

interface Experience {
  id: string;
  type: string;
  position: string;
  company: string;
  companyUrl: string | null;
  location: string | null;
  description: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  order: number;
  isActive: boolean;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  description: string | null;
  gpa: number | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  order: number;
  isActive: boolean;
}

type Tab = "experience" | "education";

const EXP_TYPES = ["WORK", "ORGANIZATION", "VOLUNTEER", "FREELANCE", "INTERNSHIP"];

const typeLabels: Record<string, string> = {
  WORK: "Work",
  ORGANIZATION: "Organization",
  VOLUNTEER: "Volunteer",
  FREELANCE: "Freelance",
  INTERNSHIP: "Internship",
};

const typeColors: Record<string, string> = {
  WORK: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ORGANIZATION: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  VOLUNTEER: "bg-green-500/10 text-green-400 border-green-500/20",
  FREELANCE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  INTERNSHIP: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function ExperienceManager() {
  const [tab, setTab] = useState<Tab>("experience");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form dialog
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Experience form
  const [expForm, setExpForm] = useState({
    type: "WORK", position: "", company: "", companyUrl: "", location: "",
    description: "", startDate: "", endDate: "", isCurrent: false,
  });

  // Education form
  const [eduForm, setEduForm] = useState({
    institution: "", degree: "", field: "", location: "",
    description: "", gpa: "", startDate: "", endDate: "", isCurrent: false,
  });

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [expRes, eduRes] = await Promise.all([
        fetch("/api/admin/experience"),
        fetch("/api/admin/education"),
      ]);
      if (expRes.ok) setExperiences(await expRes.json());
      if (eduRes.ok) setEducations(await eduRes.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const resetForms = () => {
    setExpForm({ type: "WORK", position: "", company: "", companyUrl: "", location: "", description: "", startDate: "", endDate: "", isCurrent: false });
    setEduForm({ institution: "", degree: "", field: "", location: "", description: "", gpa: "", startDate: "", endDate: "", isCurrent: false });
    setEditingId(null);
    setFormError("");
  };

  const openNewForm = () => { resetForms(); setShowForm(true); };

  const openEditExp = (exp: Experience) => {
    setEditingId(exp.id);
    setExpForm({
      type: exp.type, position: exp.position, company: exp.company,
      companyUrl: exp.companyUrl || "", location: exp.location || "",
      description: exp.description || "", startDate: exp.startDate.split("T")[0],
      endDate: exp.endDate ? exp.endDate.split("T")[0] : "", isCurrent: exp.isCurrent,
    });
    setShowForm(true);
  };

  const openEditEdu = (edu: Education) => {
    setEditingId(edu.id);
    setEduForm({
      institution: edu.institution, degree: edu.degree, field: edu.field,
      location: edu.location || "", description: edu.description || "",
      gpa: edu.gpa?.toString() || "", startDate: edu.startDate.split("T")[0],
      endDate: edu.endDate ? edu.endDate.split("T")[0] : "", isCurrent: edu.isCurrent,
    });
    setShowForm(true);
  };

  const saveExperience = async () => {
    setIsSaving(true);
    setFormError("");
    try {
      const url = editingId ? `/api/admin/experience/${editingId}` : "/api/admin/experience";
      const method = editingId ? "PUT" : "POST";
      const body = {
        ...expForm,
        companyUrl: expForm.companyUrl || undefined,
        location: expForm.location || undefined,
        description: expForm.description || undefined,
        endDate: expForm.isCurrent ? undefined : expForm.endDate || undefined,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to save"); return; }
      setShowForm(false);
      resetForms();
      fetchData();
    } catch { setFormError("Something went wrong"); }
    finally { setIsSaving(false); }
  };

  const saveEducation = async () => {
    setIsSaving(true);
    setFormError("");
    try {
      const url = editingId ? `/api/admin/education/${editingId}` : "/api/admin/education";
      const method = editingId ? "PUT" : "POST";
      const body = {
        ...eduForm,
        gpa: eduForm.gpa ? parseFloat(eduForm.gpa) : undefined,
        location: eduForm.location || undefined,
        description: eduForm.description || undefined,
        endDate: eduForm.isCurrent ? undefined : eduForm.endDate || undefined,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.error || "Failed to save"); return; }
      setShowForm(false);
      resetForms();
      fetchData();
    } catch { setFormError("Something went wrong"); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const url = tab === "experience"
        ? `/api/admin/experience/${deleteTarget.id}`
        : `/api/admin/education/${deleteTarget.id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (error) { console.error("Failed to delete:", error); }
    finally { setIsDeleting(false); setDeleteTarget(null); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-slate-500 animate-spin" /></div>;
  }

  return (
    <>
      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
          <button onClick={() => setTab("experience")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === "experience" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>
            <Briefcase className="w-4 h-4 inline mr-2" />Experience ({experiences.length})
          </button>
          <button onClick={() => setTab("education")} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === "education" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>
            <GraduationCap className="w-4 h-4 inline mr-2" />Education ({educations.length})
          </button>
        </div>
        <Button onClick={openNewForm} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer">
          <Plus className="w-4 h-4 mr-1" />Add {tab === "experience" ? "Experience" : "Education"}
        </Button>
      </div>

      {/* Experience List */}
      {tab === "experience" && (
        <div className="space-y-3">
          {experiences.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="flex flex-col items-center py-16">
                <Briefcase className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-300">No experience yet</h3>
                <p className="text-slate-500 text-sm mt-1">Tambahkan pengalaman kerja atau organisasi</p>
              </CardContent>
            </Card>
          ) : experiences.map((exp) => (
            <Card key={exp.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="flex items-start justify-between p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{exp.position}</h3>
                    <Badge variant="secondary" className={`text-xs border ${typeColors[exp.type]}`}>{typeLabels[exp.type]}</Badge>
                    {exp.isCurrent && <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border border-green-500/20">Current</Badge>}
                  </div>
                  <p className="text-slate-400 text-sm">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                  <p className="text-slate-500 text-xs mt-1">{formatDate(exp.startDate)} — {exp.isCurrent ? "Present" : exp.endDate ? formatDate(exp.endDate) : "N/A"}</p>
                  {exp.description && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{exp.description}</p>}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => openEditExp(exp)} className="text-slate-400 hover:text-white cursor-pointer"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ id: exp.id, name: exp.position })} className="text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Education List */}
      {tab === "education" && (
        <div className="space-y-3">
          {educations.length === 0 ? (
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="flex flex-col items-center py-16">
                <GraduationCap className="w-12 h-12 text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-300">No education yet</h3>
                <p className="text-slate-500 text-sm mt-1">Tambahkan riwayat pendidikan</p>
              </CardContent>
            </Card>
          ) : educations.map((edu) => (
            <Card key={edu.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="flex items-start justify-between p-5">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                    {edu.isCurrent && <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400 border border-green-500/20">Current</Badge>}
                  </div>
                  <p className="text-slate-400 text-sm">{edu.institution} · {edu.field}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {formatDate(edu.startDate)} — {edu.isCurrent ? "Present" : edu.endDate ? formatDate(edu.endDate) : "N/A"}
                    {edu.gpa && ` · GPA: ${edu.gpa}`}
                  </p>
                  {edu.description && <p className="text-slate-400 text-sm mt-2 line-clamp-2">{edu.description}</p>}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button variant="ghost" size="sm" onClick={() => openEditEdu(edu)} className="text-slate-400 hover:text-white cursor-pointer"><Pencil className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget({ id: edu.id, name: edu.degree })} className="text-slate-400 hover:text-red-400 cursor-pointer"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) { setShowForm(false); resetForms(); } }}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingId ? "Edit" : "Add"} {tab === "experience" ? "Experience" : "Education"}
            </DialogTitle>
          </DialogHeader>

          {formError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>
          )}

          {tab === "experience" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Type</Label>
                <select value={expForm.type} onChange={(e) => setExpForm(p => ({ ...p, type: e.target.value }))} className="w-full h-10 px-3 rounded-md bg-slate-800/50 border border-slate-700 text-white text-sm">
                  {EXP_TYPES.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Position *</Label>
                <Input value={expForm.position} onChange={(e) => setExpForm(p => ({ ...p, position: e.target.value }))} placeholder="e.g. Full-Stack Developer" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Company / Organization *</Label>
                <Input value={expForm.company} onChange={(e) => setExpForm(p => ({ ...p, company: e.target.value }))} placeholder="e.g. PT. XYZ" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Location</Label>
                <Input value={expForm.location} onChange={(e) => setExpForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Lampung" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>

              <ImageUpload label="Logo / Photo" value={expForm.companyUrl} onChange={(url) => setExpForm(p => ({ ...p, companyUrl: url }))} />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Start Date *</Label>
                  <Input type="date" value={expForm.startDate} onChange={(e) => setExpForm(p => ({ ...p, startDate: e.target.value }))} className="bg-slate-800/50 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">End Date</Label>
                  <Input type="date" value={expForm.endDate} onChange={(e) => setExpForm(p => ({ ...p, endDate: e.target.value }))} disabled={expForm.isCurrent} className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-50" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={expForm.isCurrent} onChange={(e) => setExpForm(p => ({ ...p, isCurrent: e.target.checked, endDate: e.target.checked ? "" : p.endDate }))} className="w-4 h-4 rounded border-slate-700 bg-slate-800" />
                <span className="text-sm text-slate-300">Currently working here</span>
              </label>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea value={expForm.description} onChange={(e) => setExpForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe your role and contributions..." rows={3} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">Institution *</Label>
                <Input value={eduForm.institution} onChange={(e) => setEduForm(p => ({ ...p, institution: e.target.value }))} placeholder="e.g. Institut Teknologi Sumatera" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Degree *</Label>
                  <Input value={eduForm.degree} onChange={(e) => setEduForm(p => ({ ...p, degree: e.target.value }))} placeholder="e.g. S.T." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Field of Study *</Label>
                  <Input value={eduForm.field} onChange={(e) => setEduForm(p => ({ ...p, field: e.target.value }))} placeholder="e.g. Teknik Informatika" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Location</Label>
                  <Input value={eduForm.location} onChange={(e) => setEduForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Lampung" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">GPA</Label>
                  <Input type="number" step="0.01" value={eduForm.gpa} onChange={(e) => setEduForm(p => ({ ...p, gpa: e.target.value }))} placeholder="e.g. 3.75" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Start Date *</Label>
                  <Input type="date" value={eduForm.startDate} onChange={(e) => setEduForm(p => ({ ...p, startDate: e.target.value }))} className="bg-slate-800/50 border-slate-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">End Date</Label>
                  <Input type="date" value={eduForm.endDate} onChange={(e) => setEduForm(p => ({ ...p, endDate: e.target.value }))} disabled={eduForm.isCurrent} className="bg-slate-800/50 border-slate-700 text-white disabled:opacity-50" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={eduForm.isCurrent} onChange={(e) => setEduForm(p => ({ ...p, isCurrent: e.target.checked, endDate: e.target.checked ? "" : p.endDate }))} className="w-4 h-4 rounded border-slate-700 bg-slate-800" />
                <span className="text-sm text-slate-300">Currently studying here</span>
              </label>
              <div className="space-y-2">
                <Label className="text-slate-300">Description</Label>
                <Textarea value={eduForm.description} onChange={(e) => setEduForm(p => ({ ...p, description: e.target.value }))} placeholder="Achievements, activities..." rows={3} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowForm(false); resetForms(); }} className="text-slate-400 hover:text-white cursor-pointer">Cancel</Button>
            <Button onClick={tab === "experience" ? saveExperience : saveEducation} disabled={isSaving} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer">
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
            <DialogTitle className="text-white">Delete {tab === "experience" ? "Experience" : "Education"}</DialogTitle>
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