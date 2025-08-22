import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  X,
  Palette,
  Grid,
  Tag,
  Zap,
  Eye,
  Activity,
} from "lucide-react";

type ChartType = "line" | "bar" | "area" | "combo";
type ChartTheme = "dark" | "light" | "gold";

interface ChartSettings {
  chartType: ChartType;
  theme: ChartTheme;
  showGrid: boolean;
  showLegend: boolean;
  showDataLabels: boolean;
  smoothLines: boolean;
  showTreatments: boolean;
  animationEnabled: boolean;
}

interface ChartSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

export default function ChartSettingsSidebar({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}: ChartSettingsSidebarProps) {
  const updateSetting = <K extends keyof ChartSettings>(
    key: K,
    value: ChartSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-[#1a1a1a] border-l border-[#bc9a64]/20 z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#bc9a64] to-[#d4b876] rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-[#0e0e0e]" />
              </div>
              <h2 className="text-lg font-semibold text-white">
                Chart Settings
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-[#bc9a64]/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chart Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#bc9a64]" />
              <label className="text-sm font-medium text-white">
                Chart Type
              </label>
            </div>
            <Select
              value={settings.chartType}
              onValueChange={(value) =>
                updateSetting("chartType", value as ChartType)
              }
            >
              <SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white hover:border-[#bc9a64]/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                <SelectItem
                  value="line"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4" />
                    Line Chart
                  </div>
                </SelectItem>
                <SelectItem
                  value="bar"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Bar Chart
                  </div>
                </SelectItem>
                <SelectItem
                  value="area"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <AreaChart className="w-4 h-4" />
                    Area Chart
                  </div>
                </SelectItem>
                <SelectItem
                  value="combo"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4" />
                    Combo Chart
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#bc9a64]" />
              <label className="text-sm font-medium text-white">
                Color Theme
              </label>
            </div>
            <Select
              value={settings.theme}
              onValueChange={(value) =>
                updateSetting("theme", value as ChartTheme)
              }
            >
              <SelectTrigger className="bg-[#0e0e0e] border-[#333] text-white hover:border-[#bc9a64]/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#bc9a64]/20">
                <SelectItem
                  value="dark"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-800 rounded-full border border-gray-600" />
                    Dark Theme
                  </div>
                </SelectItem>
                <SelectItem
                  value="light"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-100 rounded-full border border-gray-300" />
                    Light Theme
                  </div>
                </SelectItem>
                <SelectItem
                  value="gold"
                  className="text-white hover:bg-[#bc9a64]/10"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" />
                    Gold Theme
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#bc9a64]" />
              <label className="text-sm font-medium text-white">
                Display Options
              </label>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-lg border border-[#333] hover:border-[#bc9a64]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Grid className="w-4 h-4 text-[#bc9a64]" />
                  <span className="text-sm text-white">Show Grid Lines</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showGrid}
                  onChange={(e) => updateSetting("showGrid", e.target.checked)}
                  className="w-4 h-4 text-[#bc9a64] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#bc9a64] focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-lg border border-[#333] hover:border-[#bc9a64]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#bc9a64]" />
                  <span className="text-sm text-white">Show Legend</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showLegend}
                  onChange={(e) =>
                    updateSetting("showLegend", e.target.checked)
                  }
                  className="w-4 h-4 text-[#bc9a64] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#bc9a64] focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-lg border border-[#333] hover:border-[#bc9a64]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-[#bc9a64]" />
                  <span className="text-sm text-white">Show Data Labels</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showDataLabels}
                  onChange={(e) =>
                    updateSetting("showDataLabels", e.target.checked)
                  }
                  className="w-4 h-4 text-[#bc9a64] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#bc9a64] focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-lg border border-[#333] hover:border-[#bc9a64]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <LineChart className="w-4 h-4 text-[#bc9a64]" />
                  <span className="text-sm text-white">Smooth Lines</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.smoothLines}
                  onChange={(e) =>
                    updateSetting("smoothLines", e.target.checked)
                  }
                  className="w-4 h-4 text-[#bc9a64] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#bc9a64] focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-lg border border-[#333] hover:border-[#bc9a64]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-[#bc9a64]" />
                  <span className="text-sm text-white">Show Treatments</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showTreatments}
                  onChange={(e) =>
                    updateSetting("showTreatments", e.target.checked)
                  }
                  className="w-4 h-4 text-[#bc9a64] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#bc9a64] focus:ring-2"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#0e0e0e] rounded-lg border border-[#333] hover:border-[#bc9a64]/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-[#bc9a64]" />
                  <span className="text-sm text-white">Enable Animations</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.animationEnabled}
                  onChange={(e) =>
                    updateSetting("animationEnabled", e.target.checked)
                  }
                  className="w-4 h-4 text-[#bc9a64] bg-[#1a1a1a] border-[#333] rounded focus:ring-[#bc9a64] focus:ring-2"
                />
              </label>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-4 border-t border-[#bc9a64]/20">
            <Button
              onClick={() => {
                onSettingsChange({
                  chartType: "combo",
                  theme: "dark",
                  showGrid: true,
                  showLegend: true,
                  showDataLabels: false,
                  smoothLines: true,
                  showTreatments: true,
                  animationEnabled: true,
                });
              }}
              variant="outline"
              className="w-full border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10 hover:text-white hover:border-[#bc9a64]/40"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
