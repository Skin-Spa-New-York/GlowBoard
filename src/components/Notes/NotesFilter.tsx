import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import type { Location } from "@/types/entities";

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

interface NotesFilters {
  location: string;
  priority: string;
  dateRange: string;
}

interface NotesFiltersProps {
  filters: NotesFilters;
  onFiltersChange: (updater: (prev: NotesFilters) => NotesFilters) => void;
  isAdmin: boolean;
  userLocation?: Location;
}

export default function NotesFilters({
  filters,
  onFiltersChange,
  isAdmin,
}: NotesFiltersProps) {
  const handleFilterChange = (key: keyof NotesFilters, value: string) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#bc9a64]" />
            <span className="text-sm font-medium text-gray-300">
              Filter by:
            </span>
          </div>

          <div className="flex flex-wrap gap-4">
            {isAdmin && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Location:</label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger className="w-40 bg-[#0e0e0e] border-[#333] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                    <SelectItem
                      value="all"
                      className="text-white hover:bg-[#bc9a64]/10"
                    >
                      All Locations
                    </SelectItem>
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

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Priority:</label>
              <Select
                value={filters.priority}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger className="w-32 bg-[#0e0e0e] border-[#333] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    All Priority
                  </SelectItem>
                  <SelectItem
                    value="high"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    High
                  </SelectItem>
                  <SelectItem
                    value="medium"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="low"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-400">Date:</label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  handleFilterChange("dateRange", value)
                }
              >
                <SelectTrigger className="w-32 bg-[#0e0e0e] border-[#333] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    All Time
                  </SelectItem>
                  <SelectItem
                    value="today"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    Today
                  </SelectItem>
                  <SelectItem
                    value="week"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    This Week
                  </SelectItem>
                  <SelectItem
                    value="month"
                    className="text-white hover:bg-[#bc9a64]/10"
                  >
                    This Month
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
