import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2 } from "lucide-react";
import type { Location } from "@/types/entities";

interface LocationSelectorProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
  locations: readonly Location[];
}

export default function LocationSelector({
  selectedLocation,
  onLocationChange,
  locations,
}: LocationSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <Building2 className="w-5 h-5 text-[#bc9a64]" />
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#bc9a64]/20 text-white">
          <SelectValue placeholder="Select location" />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
          <SelectItem value="all" className="text-white hover:bg-[#bc9a64]/10">
            All Locations
          </SelectItem>
          {locations.map((location) => (
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
  );
}
