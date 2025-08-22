import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { NoteEntity } from "@/services/entities";
import { AuditLogger } from "@/components/Utils/AuditLogger";
import { logger } from "@/utils/logger";
import type { Note } from "@/types/entities";

import NotesHeader from "@/components/Notes/NotesHeader";
import NoteForm from "@/components/Notes/NoteForm";
import NotesGrid from "@/components/Notes/NotesGrid";
import NotesFilters from "@/components/Notes/NotesFilters";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [filters, setFilters] = useState({
    location: "all",
    priority: "all",
    dateRange: "all",
  });

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const allNotes = await NoteEntity.list();

      // Filter notes based on user permissions and visibility
      const today = new Date();
      const filteredNotes = allNotes
        .filter((note) => {
          // Check visibility date
          if (note.visible_until && new Date(note.visible_until) < today) {
            return false;
          }

          // Filter by location access
          if (
            !user.is_admin &&
            note.location !== (user.location || "Flatiron")
          ) {
            return false;
          }

          return true;
        })
        .sort(
          (a, b) =>
            new Date(b.created_date || 0).getTime() -
            new Date(a.created_date || 0).getTime()
        );

      setNotes(filteredNotes);
    } catch (error) {
      logger.error("Error loading notes data", error);
    }
    setLoading(false);
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    try {
      if (editingNote) {
        const oldData = { ...editingNote };
        await NoteEntity.update(editingNote.id!, noteData);
        await AuditLogger.logNote("update", editingNote.id!, oldData, noteData);
      } else {
        if (!user?.is_admin) {
          noteData.location = user?.location || "Flatiron";
        }
        const newNote = await NoteEntity.create(
          noteData as Omit<Note, "id" | "created_at" | "updated_at">
        );
        await AuditLogger.logNote("create", newNote.id!, null, noteData);
      }

      setShowForm(false);
      setEditingNote(null);
      await loadData();
    } catch (error) {
      logger.error("Error saving note", error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const oldData = notes.find((n) => n.id === noteId);
        await NoteEntity.delete(noteId);
        await AuditLogger.logNote("delete", noteId, oldData, null);
        await loadData();
      } catch (error) {
        logger.error("Error deleting note", error);
      }
    }
  };

  const getFilteredNotes = () => {
    return notes.filter((note) => {
      // Location filter
      if (filters.location !== "all" && note.location !== filters.location) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && note.priority !== filters.priority) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const noteDate = new Date(note.created_date || 0);
        const today = new Date();

        switch (filters.dateRange) {
          case "today":
            if (
              format(noteDate, "yyyy-MM-dd") !== format(today, "yyyy-MM-dd")
            ) {
              return false;
            }
            break;
          case "week":
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (noteDate < weekAgo) {
              return false;
            }
            break;
          case "month":
            const monthAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000
            );
            if (noteDate < monthAgo) {
              return false;
            }
            break;
          default:
            break;
        }
      }

      return true;
    });
  };

  const filteredNotes = getFilteredNotes();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <NotesHeader
          isAdmin={user?.is_admin}
          userLocation={user?.location || "Flatiron"}
          onNewNote={() => setShowForm(true)}
        />

        {/* Filters */}
        <NotesFilters
          filters={filters}
          onFiltersChange={setFilters}
          isAdmin={user?.is_admin}
          userLocation={user?.location || "Flatiron"}
        />

        {/* Note Form */}
        {showForm && (
          <NoteForm
            note={editingNote || undefined}
            onSave={handleSaveNote}
            onCancel={() => {
              setShowForm(false);
              setEditingNote(null);
            }}
            isAdmin={user?.is_admin || false}
            userLocation={user?.location || "Flatiron"}
          />
        )}

        {/* Notes Grid */}
        <NotesGrid
          notes={filteredNotes}
          onEdit={handleEditNote}
          onDelete={handleDeleteNote}
          showLocation={user?.is_admin}
        />
      </div>
    </div>
  );
}
