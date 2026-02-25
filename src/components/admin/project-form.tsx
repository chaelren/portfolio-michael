"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, ArrowLeft, X, Plus } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/image-upload";

interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
  featured: boolean;
  order: number;
  isActive: boolean;
}

interface ProjectFormProps {
  initialData?: Project;
  mode: "create" | "edit";
}

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [techInput, setTechInput] = useState("");

  const [formData, setFormData] = useState<Project>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    content: initialData?.content || "",
    imageUrl: initialData?.imageUrl || "",
    liveUrl: initialData?.liveUrl || "",
    githubUrl: initialData?.githubUrl || "",
    techStack: initialData?.techStack || [],
    featured: initialData?.featured || false,
    order: initialData?.order || 0,
    isActive: initialData?.isActive ?? true,
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      // Only auto-generate slug in create mode
      ...(mode === "create" ? { slug: generateSlug(value) } : {}),
    }));
  };

  const addTech = () => {
    const tech = techInput.trim();
    if (tech && !formData.techStack.includes(tech)) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, tech],
      }));
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTech();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url =
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initialData?.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      // Clean empty strings to null/undefined
      const cleanedData = {
        ...formData,
        content: formData.content || undefined,
        imageUrl: formData.imageUrl || undefined,
        liveUrl: formData.liveUrl || undefined,
        githubUrl: formData.githubUrl || undefined,
        slug: formData.slug.replace(/\s+/g, "-").toLowerCase(),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/admin/projects");
      router.refresh();
    } catch {
      setError("Failed to save project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Info */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Project Information</CardTitle>
          <CardDescription className="text-slate-400">
            Detail utama project kamu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. GAHC Certification System"
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-slate-300">
              Slug *{" "}
              <span className="text-slate-500 font-normal">
                (URL-friendly, auto-generated)
              </span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="e.g. gahc-certification-system"
              required
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Short Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief description of the project..."
              required
              rows={3}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Content (Detail) */}
          <div className="space-y-2">
            <Label htmlFor="content" className="text-slate-300">
              Detailed Content{" "}
              <span className="text-slate-500 font-normal">(optional, supports markdown)</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              placeholder="Detailed description, features, challenges, etc..."
              rows={6}
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Tech Stack</CardTitle>
          <CardDescription className="text-slate-400">
            Teknologi yang digunakan di project ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. React, TypeScript, FastAPI..."
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTech}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {formData.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="bg-blue-500/10 text-blue-400 border border-blue-500/20 pl-3 pr-1 py-1"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="ml-1 p-0.5 rounded-full hover:bg-blue-500/20 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Links</CardTitle>
          <CardDescription className="text-slate-400">
            URL terkait project (opsional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <ImageUpload label="Project Image" value={formData.imageUrl || ""} onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="text-slate-300">
                Live Demo URL
              </Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
                }
                placeholder="https://..."
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-slate-300">
                GitHub URL
              </Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order" className="text-slate-300">
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    order: parseInt(e.target.value) || 0,
                  }))
                }
                className="bg-slate-800/50 border-slate-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Featured Project</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Active (visible on site)</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          asChild
          className="text-slate-400 hover:text-white cursor-pointer"
        >
          <Link href="/admin/projects">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Create Project" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
