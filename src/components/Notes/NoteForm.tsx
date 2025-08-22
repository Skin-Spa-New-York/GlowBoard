import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Note, Location } from "@/types/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, X, FileText } from "lucide-react";
import { format, addDays } from "date-fns";

const LOCATIONS = [
  "Flatiron",
  "MidEast",
  "Midtown",
  "UWS",
  "Back Bay",
  "North Station",
  "Miami Beach",
  "eStore",
  "Location 9",
  "Location 10",
];

interface NoteFormProps {
  note?: Note;
  onSave: (noteData: Partial<Note>) => void;
  onCancel: () => void;
  isAdmin: boolean;
  userLocation?: Location;
}

export default function NoteForm({
  note,
  onSave,
  onCancel,
  isAdmin,
  userLocation,
}: NoteFormProps) {
  const [formData, setFormData] = useState({
    location:
      note?.location ||
      (isAdmin ? ("" as Location | "") : userLocation || "Flatiron"),
    date: note?.date || format(new Date(), "yyyy-MM-dd"),
    title: note?.title || "",
    content: note?.content || "",
    priority: note?.priority || ("medium" as const),
    visible_until:
      note?.visible_until || format(addDays(new Date(), 30), "yyyy-MM-dd"),
  });

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      ...formData,
      location: formData.location as Location,
    });
    setSaving(false);
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#bc9a64]" />
          {note ? "Edit Note" : "Create New Note"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            {isAdmin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Location
                </label>
                <Select
                  value={formData.location}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: value as Location,
                    }))
                  }
                >
                  <SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                    {LOCATIONS.map((location) => (
                      <SelectItem
                        key={location}
                        value={location}
                        className="text-white hover:bg-[#bc9a64]/10"
                      >
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Priority
              </label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: value as "low" | "medium" | "high",
                  }))
                }
              >
                <SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                  <SelectItem
                    value="low"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    Low Priority
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    Medium Priority
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    High Priority
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visible Until */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Visible Until
              </label>
              <Input
                type="date"
                value={formData.visible_until}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    visible_until: e.target.value,
                  }))
                }
                className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Title</label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64]"
              placeholder="Enter note title..."
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Content</label>
            <Textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              className="bg-[#0e0e0e] border-[#333] text-white focus:border-[#bc9a64] h-32"
              placeholder="Write your note content here..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-[#333] text-gray-300 hover:bg-[#333]/50"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || (!isAdmin && !userLocation)}
              className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {note ? "Update" : "Create"} Note
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
