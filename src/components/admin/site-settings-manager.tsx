"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Sparkles, User, CheckCircle2 } from "lucide-react";
import ImageUpload from "@/components/admin/image-upload";

interface HeroData {
  id: string;
  greeting: string;
  name: string;
  title: string;
  subtitle: string | null;
  description: string;
  resumeUrl: string | null;
  avatarUrl: string | null;
  isActive: boolean;
}

interface AboutData {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
}

export default function SiteSettingsManager() {
  const [isLoading, setIsLoading] = useState(true);

  // Hero form
  const [heroForm, setHeroForm] = useState({
    greeting: "", name: "", title: "", subtitle: "",
    description: "", resumeUrl: "", avatarUrl: "",
  });
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const [heroError, setHeroError] = useState("");

  // About form
  const [aboutForm, setAboutForm] = useState({
    title: "", description: "", imageUrl: "",
  });
  const [isSavingAbout, setIsSavingAbout] = useState(false);
  const [aboutSaved, setAboutSaved] = useState(false);
  const [aboutError, setAboutError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [heroRes, aboutRes] = await Promise.all([
        fetch("/api/admin/hero"),
        fetch("/api/admin/about"),
      ]);

      if (heroRes.ok) {
        const hero: HeroData = await heroRes.json();
        setHeroForm({
          greeting: hero.greeting, name: hero.name, title: hero.title,
          subtitle: hero.subtitle || "", description: hero.description,
          resumeUrl: hero.resumeUrl || "", avatarUrl: hero.avatarUrl || "",
        });
      }

      if (aboutRes.ok) {
        const about: AboutData = await aboutRes.json();
        setAboutForm({
          title: about.title, description: about.description,
          imageUrl: about.imageUrl || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveHero = async () => {
    setIsSavingHero(true);
    setHeroError("");
    setHeroSaved(false);
    try {
      const body = {
        greeting: heroForm.greeting,
        name: heroForm.name,
        title: heroForm.title,
        subtitle: heroForm.subtitle || undefined,
        description: heroForm.description,
        resumeUrl: heroForm.resumeUrl || undefined,
        avatarUrl: heroForm.avatarUrl || undefined,
      };
      const res = await fetch("/api/admin/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setHeroError(data.error || "Failed to save"); return; }
      setHeroSaved(true);
      setTimeout(() => setHeroSaved(false), 3000);
    } catch { setHeroError("Something went wrong"); }
    finally { setIsSavingHero(false); }
  };

  const saveAbout = async () => {
    setIsSavingAbout(true);
    setAboutError("");
    setAboutSaved(false);
    try {
      const body = {
        title: aboutForm.title,
        description: aboutForm.description,
        imageUrl: aboutForm.imageUrl || undefined,
      };
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setAboutError(data.error || "Failed to save"); return; }
      setAboutSaved(true);
      setTimeout(() => setAboutSaved(false), 3000);
    } catch { setAboutError("Something went wrong"); }
    finally { setIsSavingAbout(false); }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-slate-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{heroError}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Greeting</Label>
              <Input value={heroForm.greeting} onChange={(e) => setHeroForm(p => ({ ...p, greeting: e.target.value }))} placeholder="Hello, I'm" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Full Name *</Label>
              <Input value={heroForm.name} onChange={(e) => setHeroForm(p => ({ ...p, name: e.target.value }))} placeholder="Michael Caren Sihombing" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Title / Role *</Label>
              <Input value={heroForm.title} onChange={(e) => setHeroForm(p => ({ ...p, title: e.target.value }))} placeholder="Full-Stack Developer" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Subtitle</Label>
              <Input value={heroForm.subtitle} onChange={(e) => setHeroForm(p => ({ ...p, subtitle: e.target.value }))} placeholder="Fresh Graduate | Tech Enthusiast" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Description *</Label>
            <Textarea value={heroForm.description} onChange={(e) => setHeroForm(p => ({ ...p, description: e.target.value }))} placeholder="A brief introduction about yourself..." rows={3} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Resume URL</Label>
              <Input value={heroForm.resumeUrl} onChange={(e) => setHeroForm(p => ({ ...p, resumeUrl: e.target.value }))} placeholder="https://drive.google.com/..." className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
            </div>
            <div className="space-y-2">
              <ImageUpload label="Avatar Image" value={heroForm.avatarUrl} onChange={(url) => setHeroForm(p => ({ ...p, avatarUrl: url }))} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={saveHero} disabled={isSavingHero} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer">
              {isSavingHero ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Hero
            </Button>
            {heroSaved && (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />Saved!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            About Me
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aboutError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{aboutError}</div>
          )}

          <div className="space-y-2">
            <Label className="text-slate-300">Section Title</Label>
            <Input value={aboutForm.title} onChange={(e) => setAboutForm(p => ({ ...p, title: e.target.value }))} placeholder="About Me" className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500" />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300">Description *</Label>
            <Textarea value={aboutForm.description} onChange={(e) => setAboutForm(p => ({ ...p, description: e.target.value }))} placeholder="Tell your story... You can write multiple paragraphs here." rows={8} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none" />
            <p className="text-slate-500 text-xs">Gunakan Enter untuk membuat paragraf baru</p>
          </div>

          <ImageUpload label="Photo" value={aboutForm.imageUrl} onChange={(url) => setAboutForm(p => ({ ...p, imageUrl: url }))} />

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={saveAbout} disabled={isSavingAbout} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white cursor-pointer">
              {isSavingAbout ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save About
            </Button>
            {aboutSaved && (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4" />Saved!
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}