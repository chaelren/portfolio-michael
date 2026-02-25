"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Loader2,
  Mail,
  MailOpen,
  Trash2,
  Archive,
  Reply,
  ArrowLeft,
  Inbox,
  CheckCircle2,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

type Filter = "ALL" | "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  UNREAD: { label: "Unread", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Mail className="w-3 h-3" /> },
  READ: { label: "Read", color: "bg-slate-500/10 text-slate-400 border-slate-500/20", icon: <MailOpen className="w-3 h-3" /> },
  REPLIED: { label: "Replied", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: <Reply className="w-3 h-3" /> },
  ARCHIVED: { label: "Archived", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Archive className="w-3 h-3" /> },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) setMessages(await res.json());
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const updateStatus = async (id: string, status: Message["status"]) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
        if (selectedMessage?.id === id) setSelectedMessage((prev) => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const openMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === "UNREAD") {
      // Auto-mark as read
      await updateStatus(msg.id, "READ");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/messages/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMessages();
        if (selectedMessage?.id === deleteTarget.id) setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = filter === "ALL" ? messages : messages.filter((m) => m.status === filter);
  const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

  if (isLoading) {
    return <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-slate-500 animate-spin" /></div>;
  }

  // Detail View
  if (selectedMessage) {
    const cfg = statusConfig[selectedMessage.status];
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedMessage(null)} className="text-slate-400 hover:text-white cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />Back to Inbox
        </Button>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {selectedMessage.subject || "(No Subject)"}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-slate-300 font-medium">{selectedMessage.name}</span>
                  <span className="text-slate-500 text-sm">&lt;{selectedMessage.email}&gt;</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-slate-500 text-xs">
                    {new Date(selectedMessage.createdAt).toLocaleString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                  <Badge variant="secondary" className={`text-xs border ${cfg.color}`}>
                    {cfg.icon}<span className="ml-1">{cfg.label}</span>
                  </Badge>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="bg-slate-800/30 rounded-lg p-4 mb-6">
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 border-t border-slate-800 pt-4">
              
                {(() => {
                const mailtoHref = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`;
                return (
                  <a href={mailtoHref} onClick={() => updateStatus(selectedMessage.id, "REPLIED")} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
                    <Reply className="w-4 h-4" />Reply via Email
                  </a>
                );
              })()}

              {selectedMessage.status !== "REPLIED" && (
                <Button variant="outline" size="sm" onClick={() => updateStatus(selectedMessage.id, "REPLIED")}
                  className="border-slate-700 text-slate-300 hover:text-white cursor-pointer">
                  <CheckCircle2 className="w-4 h-4 mr-1" />Mark as Replied
                </Button>
              )}

              {selectedMessage.status !== "ARCHIVED" && (
                <Button variant="outline" size="sm" onClick={() => updateStatus(selectedMessage.id, "ARCHIVED")}
                  className="border-slate-700 text-slate-300 hover:text-white cursor-pointer">
                  <Archive className="w-4 h-4 mr-1" />Archive
                </Button>
              )}

              {selectedMessage.status !== "UNREAD" && (
                <Button variant="outline" size="sm" onClick={() => updateStatus(selectedMessage.id, "UNREAD")}
                  className="border-slate-700 text-slate-300 hover:text-white cursor-pointer">
                  <Mail className="w-4 h-4 mr-1" />Mark Unread
                </Button>
              )}

              <div className="flex-1" />

              <Button variant="ghost" size="sm"
                onClick={() => setDeleteTarget({ id: selectedMessage.id, name: selectedMessage.name })}
                className="text-slate-400 hover:text-red-400 cursor-pointer">
                <Trash2 className="w-4 h-4 mr-1" />Delete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent className="bg-slate-900 border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-white">Delete Message</DialogTitle>
              <DialogDescription className="text-slate-400">
                Apakah kamu yakin ingin menghapus pesan dari &quot;{deleteTarget?.name}&quot;? Tindakan ini tidak bisa dibatalkan.
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
      </div>
    );
  }

  // Inbox List View
  return (
    <>
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit">
        {(["ALL", "UNREAD", "READ", "REPLIED", "ARCHIVED"] as Filter[]).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${filter === f ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"}`}>
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            {f === "UNREAD" && unreadCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs bg-blue-500 text-white">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      {filtered.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="flex flex-col items-center py-16">
            <Inbox className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300">
              {filter === "ALL" ? "No messages yet" : `No ${filter.toLowerCase()} messages`}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {filter === "ALL" ? "Pesan dari pengunjung akan muncul di sini" : "Coba filter lain"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => {
            const cfg = statusConfig[msg.status];
            const isUnread = msg.status === "UNREAD";
            return (
              <Card key={msg.id}
                className={`border-slate-800 hover:border-slate-700 transition-colors cursor-pointer ${isUnread ? "bg-slate-900/80 border-l-2 border-l-blue-500" : "bg-slate-900/50"}`}
                onClick={() => openMessage(msg)}>
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Status Icon */}
                  <div className={`shrink-0 ${isUnread ? "text-blue-400" : "text-slate-500"}`}>
                    {isUnread ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm truncate ${isUnread ? "font-semibold text-white" : "text-slate-300"}`}>
                        {msg.name}
                      </span>
                      <span className="text-slate-600 text-xs truncate">&lt;{msg.email}&gt;</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm truncate ${isUnread ? "text-slate-200" : "text-slate-400"}`}>
                        {msg.subject || "(No Subject)"}
                      </span>
                      <span className="text-slate-600 text-sm">—</span>
                      <span className="text-slate-500 text-sm truncate">{msg.message}</span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={`text-xs border ${cfg.color}`}>
                      {cfg.label}
                    </Badge>
                    <span className="text-slate-500 text-xs whitespace-nowrap">{timeAgo(msg.createdAt)}</span>
                  </div>

                  {/* Quick Delete */}
                  <Button variant="ghost" size="sm"
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: msg.id, name: msg.name }); }}
                    className="text-slate-500 hover:text-red-400 shrink-0 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Message</DialogTitle>
            <DialogDescription className="text-slate-400">
              Apakah kamu yakin ingin menghapus pesan dari &quot;{deleteTarget?.name}&quot;? Tindakan ini tidak bisa dibatalkan.
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