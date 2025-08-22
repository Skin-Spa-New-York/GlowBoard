import { useState, useEffect, useRef } from "react";
// Import only the ECharts components we need for better tree shaking
import * as echarts from "echarts/core";
import { LineChart, BarChart } from "echarts/charts";
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	ToolboxComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register the required components
echarts.use([
	LineChart,
	BarChart,
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	ToolboxComponent,
	CanvasRenderer,
]);
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, TrendingUp, Settings } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { SalesRecord } from "@/types/entities";
import type { TimeframeType } from "@/utils/dateUtils";
import ChartSettingsSidebar from "./ChartSettingsSidebar";

interface SalesChartProps {
	salesData: SalesRecord[];
	timeframe: TimeframeType;
	onTimeframeChange: (timeframe: TimeframeType) => void;
}

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

export default function SalesChart({
	salesData,
	timeframe,
	onTimeframeChange,
}: SalesChartProps) {
	const [showCustomDates, setShowCustomDates] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [showComparison, setShowComparison] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<echarts.ECharts | null>(null);

	const [chartSettings, setChartSettings] = useState<ChartSettings>({
		chartType: "combo",
		theme: "dark",
		showGrid: true,
		showLegend: true,
		showDataLabels: false,
		smoothLines: true,
		showTreatments: true,
		animationEnabled: true,
	});

	const handleCustomDateSubmit = () => {
		if (startDate && endDate) {
			onTimeframeChange("custom");
		}
	};

	// Process chart data
	const chartData = salesData
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((record) => ({
			date: record.date,
			sales: record.daily_sales,
			treatments: record.treatments_count || 0,
		}));

	// Process comparison data (previous year)
	const comparisonData = showComparison
		? salesData
				.filter((record) => {
					const recordDate = new Date(record.date);
					const prevYearDate = new Date(recordDate);
					prevYearDate.setFullYear(prevYearDate.getFullYear() - 1);
					return prevYearDate.getFullYear() === new Date().getFullYear() - 1;
				})
				.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
				.map((record) => ({
					date: record.date,
					sales: record.daily_sales,
					treatments: record.treatments_count || 0,
				}))
		: [];

	// Get theme colors
	const getThemeColors = () => {
		switch (chartSettings.theme) {
			case "light":
				return {
					background: "transparent",
					text: "#333333",
					grid: "#e0e0e0",
					primary: "#bc9a64",
					secondary: "#d4b876",
					tooltip: "#ffffff",
				};
			case "gold":
				return {
					background: "transparent",
					text: "#d4b876",
					grid: "#bc9a64",
					primary: "#ffd700",
					secondary: "#ffed4e",
					tooltip: "#2a2a2a",
				};
			default: // dark
				return {
					background: "transparent",
					text: "#ffffff",
					grid: "#333333",
					primary: "#bc9a64",
					secondary: "#d4b876",
					tooltip: "#1a1a1a",
				};
		}
	};

	// Initialize and update chart
	useEffect(() => {
		if (!chartRef.current || chartData.length === 0) return;

		// Initialize chart if not exists
		if (!chartInstance.current) {
			chartInstance.current = echarts.init(
				chartRef.current,
				chartSettings.theme === "light" ? "light" : "dark"
			);
		}

		const chart = chartInstance.current;
		const colors = getThemeColors();

		// Prepare data
		const dates = chartData.map((d) => format(parseISO(d.date), "MMM dd"));
		const salesValues = chartData.map((d) => d.sales);
		const treatmentValues = chartData.map((d) => d.treatments);

		// Prepare comparison data
		const comparisonSalesValues = showComparison
			? comparisonData.map((d) => d.sales)
			: [];
		const comparisonTreatmentValues = showComparison
			? comparisonData.map((d) => d.treatments)
			: [];

		// Build series based on chart type and settings
		const series: any[] = [];

		if (
			chartSettings.chartType === "line" ||
			chartSettings.chartType === "combo" ||
			chartSettings.chartType === "area"
		) {
			series.push({
				name: "Sales",
				type: "line",
				yAxisIndex: 0,
				data: salesValues,
				smooth: chartSettings.smoothLines,
				lineStyle: {
					color: colors.primary,
					width: 3,
				},
				itemStyle: {
					color: colors.primary,
				},
				label: {
					show: chartSettings.showDataLabels,
					color: colors.text,
				},
				...(chartSettings.chartType === "area" && {
					areaStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: `rgba(188, 154, 100, 0.3)`,
								},
								{
									offset: 1,
									color: `rgba(188, 154, 100, 0.05)`,
								},
							],
						},
					},
				}),
			});

			// Add comparison series if enabled
			if (showComparison && comparisonSalesValues.length > 0) {
				series.push({
					name: "Sales (Previous Year)",
					type: "line",
					yAxisIndex: 0,
					data: comparisonSalesValues,
					smooth: chartSettings.smoothLines,
					lineStyle: {
						color: colors.secondary,
						width: 2,
						type: "dashed",
					},
					itemStyle: {
						color: colors.secondary,
					},
					label: {
						show: chartSettings.showDataLabels,
						color: colors.text,
					},
				});
			}
		}

		if (
			chartSettings.chartType === "bar" ||
			chartSettings.chartType === "combo"
		) {
			if (chartSettings.chartType === "bar") {
				series.push({
					name: "Sales",
					type: "bar",
					yAxisIndex: 0,
					data: salesValues,
					itemStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: colors.primary,
								},
								{
									offset: 1,
									color: colors.secondary,
								},
							],
						},
					},
					label: {
						show: chartSettings.showDataLabels,
						color: colors.text,
					},
					barWidth: "60%",
				});
			}

			if (chartSettings.showTreatments) {
				series.push({
					name: "Treatments",
					type: "bar",
					yAxisIndex: 1,
					data: treatmentValues,
					itemStyle: {
						color: {
							type: "linear",
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [
								{
									offset: 0,
									color: colors.secondary,
								},
								{
									offset: 1,
									color: colors.primary,
								},
							],
						},
					},
					label: {
						show: chartSettings.showDataLabels,
						color: colors.text,
					},
					barWidth: chartSettings.chartType === "combo" ? "40%" : "60%",
				});
			}
		}

		// Chart configuration
		const option: echarts.EChartsCoreOption = {
			backgroundColor: colors.background,
			animation: chartSettings.animationEnabled,
			tooltip: {
				trigger: "axis",
				backgroundColor: colors.tooltip,
				borderColor: colors.primary,
				borderWidth: 1,
				textStyle: {
					color: chartSettings.theme === "light" ? "#333333" : "#ffffff",
				},
				formatter: (params: any) => {
					const data = params[0];
					const treatmentData = params[1];
					return `
            <div style="padding: 8px;">
              <div style="color: ${
								colors.primary
							}; font-weight: bold; margin-bottom: 4px;">
                ${data.axisValue}
              </div>
              <div style="margin-bottom: 2px;">
                <span style="color: ${
									colors.primary
								};">●</span> Sales: $${data.value.toLocaleString()}
              </div>
              ${
								chartSettings.showTreatments && treatmentData
									? `
              <div>
                <span style="color: ${
									colors.secondary
								};">●</span> Treatments: ${treatmentData.value || 0}
              </div>
              `
									: ""
							}
            </div>
          `;
				},
			},
			legend: {
				show: chartSettings.showLegend,
				data: [
					"Sales",
					...(showComparison ? ["Sales (Previous Year)"] : []),
					...(chartSettings.showTreatments ? ["Treatments"] : []),
				],
				textStyle: {
					color: colors.text,
				},
				top: 10,
			},
			grid: {
				show: chartSettings.showGrid,
				left: "3%",
				right: "4%",
				bottom: "3%",
				top: chartSettings.showLegend ? "15%" : "5%",
				containLabel: true,
				borderColor: colors.grid,
			},
			xAxis: {
				type: "category",
				data: dates,
				axisLine: {
					lineStyle: {
						color: colors.grid,
					},
				},
				axisLabel: {
					color: colors.text,
					rotate: 45,
				},
			},
			yAxis: [
				{
					type: "value",
					name: "Sales ($)",
					position: "left",
					axisLine: {
						lineStyle: {
							color: colors.grid,
						},
					},
					axisLabel: {
						color: colors.text,
						formatter: (value: number) => `$${(value / 1000).toFixed(0)}K`,
					},
					splitLine: {
						show: chartSettings.showGrid,
						lineStyle: {
							color: colors.grid,
							type: "dashed",
						},
					},
				},
				...(chartSettings.showTreatments
					? [
							{
								type: "value" as const,
								name: "Treatments",
								position: "right" as const,
								axisLine: {
									lineStyle: {
										color: colors.grid,
									},
								},
								axisLabel: {
									color: colors.text,
								},
							},
					  ]
					: []),
			],
			series,
		};

		chart.setOption(option, true);

		// Handle resize
		const handleResize = () => {
			chart.resize();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [chartData, chartSettings, showComparison]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (chartInstance.current) {
				chartInstance.current.dispose();
				chartInstance.current = null;
			}
		};
	}, []);

	return (
		<>
			<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
				<CardHeader className="flex flex-col space-y-4">
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
						<CardTitle className="text-white">Sales Performance</CardTitle>
						<div className="flex flex-wrap items-center gap-2">
							<Button
								variant={showComparison ? "default" : "outline"}
								size="sm"
								onClick={() => setShowComparison(!showComparison)}
								className={
									showComparison
										? "bg-[#bc9a64] text-[#0e0e0e] hover:bg-[#a8875a]"
										: "border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10"
								}>
								<TrendingUp className="w-4 h-4 lg:mr-2" />
								<span className="hidden lg:inline">Compare YoY</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowCustomDates(!showCustomDates)}
								className="border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10">
								<Calendar className="w-4 h-4 lg:mr-2" />
								<span className="hidden lg:inline">Custom</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setShowSettings(!showSettings)}
								className="border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10">
								<Settings className="w-4 h-4 lg:mr-2" />
								<span className="hidden lg:inline">Settings</span>
							</Button>
						</div>
					</div>

					{showCustomDates && (
						<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-[#0e0e0e] rounded-lg border border-[#bc9a64]/10">
							<div className="flex items-center gap-2">
								<label className="text-sm text-gray-300 whitespace-nowrap">
									From:
								</label>
								<Input
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#bc9a64] w-32 text-sm"
								/>
							</div>
							<div className="flex items-center gap-2">
								<label className="text-sm text-gray-300 whitespace-nowrap">
									To:
								</label>
								<Input
									type="date"
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									className="bg-[#1a1a1a] border-[#333] text-white focus:border-[#bc9a64] w-32 text-sm"
								/>
							</div>
							<Button
								onClick={handleCustomDateSubmit}
								disabled={!startDate || !endDate}
								size="sm"
								className="bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] whitespace-nowrap">
								Apply
							</Button>
						</div>
					)}

					<div className="w-full overflow-x-auto">
						<Tabs
							value={timeframe}
							onValueChange={(value) =>
								onTimeframeChange(value as TimeframeType)
							}>
							<TabsList className="bg-[#0e0e0e] border-[#bc9a64]/20 flex w-full min-w-fit">
								<TabsTrigger
									value="yesterday"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									Yesterday
								</TabsTrigger>
								<TabsTrigger
									value="1day"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									Today
								</TabsTrigger>
								<TabsTrigger
									value="7days"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									7 Days
								</TabsTrigger>
								<TabsTrigger
									value="1month"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									1 Month
								</TabsTrigger>
								<TabsTrigger
									value="1quarter"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									1 Quarter
								</TabsTrigger>
								<TabsTrigger
									value="6months"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									6 Months
								</TabsTrigger>
								<TabsTrigger
									value="1year"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									Full Year
								</TabsTrigger>
								<TabsTrigger
									value="custom"
									className="text-gray-400 data-[state=active]:text-[#bc9a64] text-xs px-2 py-1 flex-shrink-0">
									Custom
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
				</CardHeader>
				<CardContent>
					{chartData.length > 0 ? (
						<div
							ref={chartRef}
							className="h-80 w-full"
							style={{ minHeight: "320px" }}
						/>
					) : (
						<div className="h-80 flex items-center justify-center">
							<div className="text-center">
								<div className="w-16 h-16 bg-[#bc9a64]/20 rounded-full flex items-center justify-center mx-auto mb-4">
									<TrendingUp className="w-8 h-8 text-[#bc9a64]" />
								</div>
								<p className="text-gray-400 mb-2">No Data Available</p>
								<p className="text-sm text-gray-500">
									Add some sales records to see the chart
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Chart Settings Sidebar */}
			<ChartSettingsSidebar
				isOpen={showSettings}
				onClose={() => setShowSettings(false)}
				settings={chartSettings}
				onSettingsChange={setChartSettings}
			/>
		</>
	);
}
