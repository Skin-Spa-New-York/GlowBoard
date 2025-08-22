import { DollarSign, TrendingUp, Calendar, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { SalesStats } from "@/utils/salesUtils";

interface StatsGridProps {
  stats: SalesStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      title: "Today's Sales",
      value: `$${stats.todaySales.toLocaleString()}`,
      icon: DollarSign,
      change:
        stats.growth > 0
          ? `+${stats.growth.toFixed(1)}%`
          : `${stats.growth.toFixed(1)}%`,
      changeColor: stats.growth >= 0 ? "text-green-400" : "text-red-400",
    },
    {
      title: "This Week",
      value: `$${stats.weekSales.toLocaleString()}`,
      icon: Calendar,
      change: "vs last week",
      changeColor: "text-gray-400",
    },
    {
      title: "This Month",
      value: `$${stats.monthSales.toLocaleString()}`,
      icon: TrendingUp,
      change: "vs last month",
      changeColor: "text-gray-400",
    },
    {
      title: "Avg Daily",
      value: `$${stats.avgDaily.toLocaleString()}`,
      icon: Award,
      change: `${stats.totalTreatments} treatments`,
      changeColor: "text-[#bc9a64]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card
          key={index}
          className="bg-[#1a1a1a] border-[#bc9a64]/20 hover-lift"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#bc9a64]/10 rounded-xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-[#bc9a64]" />
              </div>
              <div className={`text-sm font-medium ${item.changeColor}`}>
                {item.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
              <p className="text-sm text-gray-400">{item.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
