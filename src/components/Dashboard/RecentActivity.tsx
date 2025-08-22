import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Building2, DollarSign } from "lucide-react";
import { format } from "date-fns";
import type { SalesRecord } from "@/types/entities";

interface RecentActivityProps {
  salesData: SalesRecord[];
  showLocation?: boolean;
}

export default function RecentActivity({
  salesData,
  showLocation = false,
}: RecentActivityProps) {
  const sortedData = [...salesData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#bc9a64]" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedData.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 bg-[#0e0e0e] rounded-lg border border-[#bc9a64]/10 hover-lift"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#bc9a64]/20 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#bc9a64]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-white">
                        ${record.daily_sales.toLocaleString()}
                      </p>
                      {showLocation && (
                        <Badge
                          variant="outline"
                          className="text-gray-300 border-gray-600"
                        >
                          <Building2 className="w-3 h-3 mr-1" />
                          {record.location}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">
                      {format(new Date(record.date), "MMM d, yyyy")}
                      {record.treatments_count && (
                        <span className="ml-2">
                          • {record.treatments_count} treatments
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {record.notes && (
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-300 truncate">
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
