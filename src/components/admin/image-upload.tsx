"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Something went wrong");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm text-slate-300">{label}</label>}

      {/* Preview */}
      {value && (
        <div className="relative w-fit">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-slate-700" />
          <button type="button" onClick={handleRemove} className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 hover:bg-red-500 text-white cursor-pointer">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="border-slate-700 text-slate-300 hover:text-white cursor-pointer">
          {isUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {isUploading ? "Uploading..." : "Upload Image"}
        </Button>
        <span className="text-slate-500 text-xs">or</span>
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL..." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 text-sm flex-1" />
      </div>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} className="hidden" />

      {error && <p className="text-red-400 text-xs">{error}</p>}
      <p className="text-slate-500 text-xs">Max 5MB. Accepts JPG, PNG, WebP, GIF</p>
    </div>
  );
}