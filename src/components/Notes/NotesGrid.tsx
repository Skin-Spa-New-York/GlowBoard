import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  FileText,
  Building2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { Note } from "@/types/entities";

interface NotesGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  showLocation?: boolean;
}

export default function NotesGrid({
  notes,
  onEdit,
  onDelete,
  showLocation = false,
}: NotesGridProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="w-3 h-3" />;
      case "medium":
        return <FileText className="w-3 h-3" />;
      case "low":
        return <FileText className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  if (notes.length === 0) {
    return (
      <Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Notes Found
          </h3>
          <p className="text-gray-400">
            No notes match your current filters. Try adjusting your search
            criteria or create a new note.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="bg-[#1a1a1a] border-[#bc9a64]/20 hover-lift"
        >
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge className={getPriorityColor(note.priority)}>
                  {getPriorityIcon(note.priority)}
                  <span className="ml-1 capitalize">{note.priority}</span>
                </Badge>
                {showLocation && (
                  <Badge
                    variant="outline"
                    className="text-gray-300 border-gray-600"
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    {note.location}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(note)}
                  className="text-gray-400 hover:text-[#bc9a64] hover:bg-[#bc9a64]/10 h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(note.id!)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
              {note.title}
            </h3>

            {/* Content */}
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {note.content}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {note.created_date
                    ? format(new Date(note.created_date), "MMM d, yyyy")
                    : "No date"}
                </span>
              </div>

              {note.visible_until && (
                <div className="flex items-center gap-1">
                  <span>Until:</span>
                  <span>{format(new Date(note.visible_until), "MMM d")}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
