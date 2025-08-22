import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

interface NotesHeaderProps {
  isAdmin?: boolean;
  userLocation: string;
  onNewNote: () => void;
}

export default function NotesHeader({
  isAdmin,
  userLocation,
  onNewNote,
}: NotesHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#bc9a64]" />
          Notes
        </h1>
        <p className="text-gray-400">
          {isAdmin
            ? "Manage notes for all locations"
            : `Manage notes for ${userLocation}`}
        </p>
      </div>

      <Button
        onClick={onNewNote}
        className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold"
      >
        <Plus className="w-5 h-5 mr-2" />
        New Note
      </Button>
    </div>
  );
}
