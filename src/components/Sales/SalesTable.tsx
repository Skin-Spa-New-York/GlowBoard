import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Building2, DollarSign } from "lucide-react";
import { format } from "date-fns";
import type { SalesRecord } from "@/types/entities";

interface SalesTableProps {
	records: SalesRecord[];
	onEdit: (record: SalesRecord) => void;
	onDelete: (recordId: string) => void;
	showLocation?: boolean;
	userLocation?: string;
	isAdmin?: boolean;
}

export default function SalesTable({
	records,
	onEdit,
	onDelete,
	showLocation = false,
	userLocation,
	isAdmin = false,
}: SalesTableProps) {
	const sortedRecords = [...records].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	if (records.length === 0) {
		return (
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardContent className="p-12 text-center">
					<DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-white mb-2">
						No Sales Records
					</h3>
					<p className="text-gray-400">
						No sales records found. Create your first entry using the form
						above.
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
			<CardHeader>
				<CardTitle className="text-white">
					Sales Records ({records.length})
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-[#bc9a64]/20">
								<th className="text-left py-3 px-4 text-gray-300 font-medium">
									Date
								</th>
								{showLocation && (
									<th className="text-left py-3 px-4 text-gray-300 font-medium">
										Location
									</th>
								)}
								<th className="text-right py-3 px-4 text-gray-300 font-medium">
									Sales
								</th>
								<th className="text-right py-3 px-4 text-gray-300 font-medium">
									Treatments
								</th>
								<th className="text-left py-3 px-4 text-gray-300 font-medium">
									Notes
								</th>
								<th className="text-right py-3 px-4 text-gray-300 font-medium">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{sortedRecords.map((record) => (
								<tr
									key={record.id}
									className="border-b border-[#bc9a64]/10 hover:bg-[#bc9a64]/5 transition-colors">
									<td className="py-4 px-4">
										<div className="text-white font-medium">
											{format(new Date(record.date), "MMM d, yyyy")}
										</div>
										<div className="text-sm text-gray-400">
											{format(new Date(record.date), "EEEE")}
										</div>
									</td>

									{showLocation && (
										<td className="py-4 px-4">
											<Badge
												variant="outline"
												className="text-gray-300 border-gray-600">
												<Building2 className="w-3 h-3 mr-1" />
												{record.location}
											</Badge>
										</td>
									)}

									<td className="py-4 px-4 text-right">
										<div className="text-white font-semibold">
											${record.daily_sales.toLocaleString()}
										</div>
									</td>

									<td className="py-4 px-4 text-right">
										<div className="text-white">
											{record.treatments_count || 0}
										</div>
									</td>

									<td className="py-4 px-4">
										<div className="max-w-xs">
											{record.notes ? (
												<p className="text-sm text-gray-300 truncate">
													{record.notes}
												</p>
											) : (
												<span className="text-gray-500 text-sm">No notes</span>
											)}
										</div>
									</td>

									<td className="py-4 px-4">
										<div className="flex items-center justify-end gap-2">
											{(isAdmin || record.location === userLocation) && (
												<>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => onEdit(record)}
														className="text-gray-400 hover:text-[#bc9a64] hover:bg-[#bc9a64]/10"
														title="Edit record">
														<Edit className="w-4 h-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => onDelete(record.id!)}
														className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
														title="Delete record">
														<Trash2 className="w-4 h-4" />
													</Button>
												</>
											)}
											{!isAdmin && record.location !== userLocation && (
												<span className="text-xs text-gray-500 px-2">
													View only
												</span>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
