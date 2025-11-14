"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Mail, Phone, User2, Trash2, CalendarDays } from "lucide-react";

interface MessageType {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  message: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* -------------------------------------------------------------------------- */
  /* 🟡 Auth Check                                                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (isPending) return;

    if (!data?.user) {
      toast.error("Please sign in.");
      router.replace("/signin");
      return;
    }

    if (data.user.email !== "admin@gmail.com") {
      toast.error("Access denied.");
      router.replace("/");
      return;
    }
  }, [data, isPending, router]);

  /* -------------------------------------------------------------------------- */
  /* 🔵 Fetch Messages                                                          */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!data?.user?.email) return;

    const loadMessages = async () => {
      try {
        const res = await fetch("/api/message");
        const result = await res.json();

        if (!res.ok) {
          toast.error("Failed to load messages");
          return;
        }

        setMessages(result.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [data]);

  /* -------------------------------------------------------------------------- */
  /* 🟥 Delete Handler                                                          */
  /* -------------------------------------------------------------------------- */
  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/message/${deleteId}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      setMessages((prev) =>
        prev.filter((msg) => msg._id !== deleteId)
      );
      toast.success("Message deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  /* -------------------------------------------------------------------------- */
  /* 🟣 Loading UI                                                               */
  /* -------------------------------------------------------------------------- */
  if (loading || isPending) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-gray-600">
        <Spinner className="h-8 w-8" />
        <span className="mt-2">Loading messages...</span>
      </div>
    );
  }

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-serif font-bold text-[#1e293b] mb-8">
        Contact <span className="text-[#d97706]">Messages</span>
      </h1>

      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white border border-amber-200 shadow-sm rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-semibold text-amber-700 flex items-center gap-2">
                    <User2 size={18} /> {msg.name}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2 mt-1">
                    <Mail size={16} /> {msg.email}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2 mt-1">
                    <Phone size={16} /> {msg.phoneNo}
                  </p>
                </div>

                <button
                  onClick={() => setDeleteId(msg._id)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <p className="mt-4 text-gray-800">{msg.message}</p>

              <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays size={16} />
                {new Date(msg.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg font-bold mb-3 text-[#1e293b]">
              Confirm Deletion
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
