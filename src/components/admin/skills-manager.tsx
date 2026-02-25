"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Pencil,
  Loader2,
  FolderOpen,
  Code2,
  X,
  Check,
} from "lucide-react";

interface Skill {
  id: string;
  name: string;
  iconUrl: string | null;
  level: string;
  order: number;
  isActive: boolean;
  categoryId: string;
}

interface SkillCategory {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  skills: Skill[];
}

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

const levelColors: Record<string, string> = {
  BEGINNER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  INTERMEDIATE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ADVANCED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  EXPERT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function SkillsManager() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Category state
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  // Skill state
  const [addingSkillTo, setAddingSkillTo] = useState<string | null>(null);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("INTERMEDIATE");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "skill"; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/skills");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // === Category CRUD ===
  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);

    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      if (res.ok) {
        setNewCategoryName("");
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    } finally {
      setAddingCategory(false);
    }
  };

  const updateCategory = async (id: string) => {
    if (!editCategoryName.trim()) return;

    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editCategoryName.trim() }),
      });

      if (res.ok) {
        setEditingCategory(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  // === Skill CRUD ===
  const addSkill = async (categoryId: string) => {
    if (!newSkillName.trim()) return;

    try {
      const res = await fetch("/api/admin/skills/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newSkillName.trim(),
          level: newSkillLevel,
          categoryId,
        }),
      });

      if (res.ok) {
        setNewSkillName("");
        setNewSkillLevel("INTERMEDIATE");
        setAddingSkillTo(null);
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to add skill:", error);
    }
  };

  // === Delete ===
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const url =
        deleteTarget.type === "category"
          ? `/api/admin/skills/${deleteTarget.id}`
          : `/api/admin/skills/items/${deleteTarget.id}`;

      const res = await fetch(url, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Add Category */}
      <div className="flex gap-2 mb-6">
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
          placeholder="New category name (e.g. Frontend, Backend, Database...)"
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
        />
        <Button
          onClick={addCategory}
          disabled={addingCategory || !newCategoryName.trim()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shrink-0 cursor-pointer"
        >
          {addingCategory ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Plus className="w-4 h-4 mr-1" />
              Add Category
            </>
          )}
        </Button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Code2 className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-1">No skills yet</h3>
            <p className="text-slate-500 text-sm">Mulai dengan membuat kategori di atas</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Card key={category.id} className="bg-slate-900/50 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && updateCategory(category.id)}
                      className="bg-slate-800/50 border-slate-700 text-white max-w-xs"
                      autoFocus
                    />
                    <Button size="sm" onClick={() => updateCategory(category.id)} className="cursor-pointer bg-green-600 hover:bg-green-500 text-white">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)} className="cursor-pointer text-slate-400">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <CardTitle className="text-white flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-blue-400" />
                    {category.name}
                    <Badge variant="secondary" className="bg-slate-800 text-slate-400 border-slate-700 ml-2">
                      {category.skills.length} skills
                    </Badge>
                  </CardTitle>
                )}

                {editingCategory !== category.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCategory(category.id);
                        setEditCategoryName(category.name);
                      }}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget({ type: "category", id: category.id, name: category.name })}
                      className="text-slate-400 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Skills List */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 group"
                    >
                      <span className="text-sm text-white">{skill.name}</span>
                      <Badge variant="secondary" className={`text-xs ${levelColors[skill.level]} border`}>
                        {skill.level.toLowerCase()}
                      </Badge>
                      <button
                        onClick={() => setDeleteTarget({ type: "skill", id: skill.id, name: skill.name })}
                        className="ml-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Skill */}
                {addingSkillTo === category.id ? (
                  <div className="flex items-end gap-2 pt-2 border-t border-slate-800">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-slate-500">Skill Name</Label>
                      <Input
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addSkill(category.id)}
                        placeholder="e.g. React, Python..."
                        className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 h-9"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500">Level</Label>
                      <select
                        value={newSkillLevel}
                        onChange={(e) => setNewSkillLevel(e.target.value)}
                        className="h-9 px-3 rounded-md bg-slate-800/50 border border-slate-700 text-white text-sm"
                      >
                        {SKILL_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level.charAt(0) + level.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button size="sm" onClick={() => addSkill(category.id)} className="h-9 cursor-pointer bg-green-600 hover:bg-green-500 text-white">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setAddingSkillTo(null);
                        setNewSkillName("");
                      }}
                      className="h-9 cursor-pointer text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAddingSkillTo(category.id)}
                    className="text-slate-500 hover:text-white mt-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              Delete {deleteTarget?.type === "category" ? "Category" : "Skill"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {deleteTarget?.type === "category"
                ? `Menghapus kategori "${deleteTarget?.name}" akan menghapus semua skill di dalamnya. Tindakan ini tidak bisa dibatalkan.`
                : `Apakah kamu yakin ingin menghapus skill "${deleteTarget?.name}"?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="text-slate-400 hover:text-white cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-500 text-white cursor-pointer">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}