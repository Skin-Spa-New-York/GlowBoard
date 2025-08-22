import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils/routing";
import { useAuth } from "@/hooks/useAuth";
import {
	BarChart3,
	Building2,
	FileText,
	Settings,
	LogOut,
	Menu,
	X,
	Crown,
	Users,
	Shield,
	Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
	{
		title: "Dashboard",
		url: createPageUrl("Dashboard"),
		icon: BarChart3,
		adminOnly: false,
	},
	{
		title: "Sales Entry",
		url: createPageUrl("SalesEntry"),
		icon: Building2,
		adminOnly: false,
	},
	{
		title: "Recent Activity",
		url: createPageUrl("RecentActivity"),
		icon: Activity,
		adminOnly: false,
	},
	{
		title: "Notes",
		url: createPageUrl("Notes"),
		icon: FileText,
		adminOnly: false,
	},
	{
		title: "User Management",
		url: createPageUrl("UserManagement"),
		icon: Users,
		adminOnly: true,
	},
	{
		title: "Audit Logs",
		url: createPageUrl("AuditLogs"),
		icon: Shield,
		adminOnly: true,
	},
	{
		title: "Settings",
		url: createPageUrl("Settings"),
		icon: Settings,
		adminOnly: true,
	},
];

interface LayoutProps {
	children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, loading, logout } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const handleLogout = async () => {
		await logout();
		navigate(createPageUrl("Dashboard"));
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	// Always show the layout with sidebar, but limit functionality if no user
	const isAuthenticated = !!user;

	const filteredNavItems = navigationItems.filter(
		(item) => !item.adminOnly || user?.is_admin || false
	);

	return (
		<div
			className="min-h-screen bg-[#0e0e0e] text-white"
			style={{
				fontFamily: "Interstate, -apple-system, BlinkMacSystemFont, sans-serif",
			}}>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        :root {
          --primary-bg: #0e0e0e;
          --primary-text: #f0f6f8;
          --accent: #bc9a64;
          --secondary-bg: #1a1a1a;
          --border-color: #333;
        }
        
        .glass-effect {
          background: rgba(26, 26, 26, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(188, 154, 100, 0.1);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(188, 154, 100, 0.1);
        }
      `}</style>

			{/* Mobile Header */}
			<div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-effect border-b border-[#bc9a64]/20">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-gradient-to-br from-[#bc9a64] to-[#d4b876] rounded-lg flex items-center justify-center">
							<BarChart3 className="w-4 h-4 text-[#0e0e0e]" />
						</div>
						<h1 className="text-lg font-semibold">GlowBoard Analytics</h1>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSidebarOpen(true)}
						className="text-white hover:bg-[#bc9a64]/10">
						<Menu className="w-5 h-5" />
					</Button>
				</div>
			</div>

			{/* Mobile Sidebar Overlay */}
			{sidebarOpen && (
				<div className="lg:hidden fixed inset-0 z-50">
					<div
						className="absolute inset-0 bg-black/50"
						onClick={() => setSidebarOpen(false)}
					/>
					<div className="absolute left-0 top-0 bottom-0 w-80 bg-[#0e0e0e] border-r border-[#bc9a64]/20">
						<div className="p-4 border-b border-[#bc9a64]/20">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gradient-to-br from-[#bc9a64] to-[#d4b876] rounded-lg flex items-center justify-center">
										<BarChart3 className="w-4 h-4 text-[#0e0e0e]" />
									</div>
									<h1 className="text-lg font-semibold">GlowBoard Analytics</h1>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => setSidebarOpen(false)}
									className="text-white hover:bg-[#bc9a64]/10">
									<X className="w-5 h-5" />
								</Button>
							</div>
						</div>
						<div className="p-4">
							<nav className="space-y-2">
								{filteredNavItems.map((item) => (
									<Link
										key={item.title}
										to={item.url}
										onClick={() => setSidebarOpen(false)}
										className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover-lift ${
											location.pathname === item.url
												? "bg-[#bc9a64] text-[#0e0e0e] font-medium"
												: "text-white hover:bg-[#bc9a64]/10"
										}`}>
										<item.icon className="w-5 h-5" />
										<span>{item.title}</span>
									</Link>
								))}
							</nav>
						</div>
					</div>
				</div>
			)}

			{/* Desktop Sidebar */}
			<div className="hidden lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:w-80 lg:flex lg:flex-col glass-effect border-r border-[#bc9a64]/20">
				<div className="p-8 border-b border-[#bc9a64]/20">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-br from-[#bc9a64] to-[#d4b876] rounded-xl flex items-center justify-center shadow-lg">
							<BarChart3 className="w-6 h-6 text-[#0e0e0e]" />
						</div>
						<div>
							<h1 className="text-xl font-bold">GlowBoard Analytics</h1>
							<p className="text-sm text-gray-400">Sales Performance Suite</p>
						</div>
					</div>
				</div>

				<div className="flex-1 p-6">
					<nav className="space-y-3">
						{filteredNavItems.map((item) => (
							<Link
								key={item.title}
								to={item.url}
								className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 hover-lift ${
									location.pathname === item.url
										? "bg-[#bc9a64] text-[#0e0e0e] shadow-lg font-medium"
										: "text-white hover:bg-[#bc9a64]/10"
								}`}>
								<item.icon className="w-5 h-5" />
								<span className="font-medium">{item.title}</span>
							</Link>
						))}
					</nav>
				</div>

				<div className="p-6 border-t border-[#bc9a64]/20">
					{isAuthenticated ? (
						<>
							<div className="flex items-center gap-4 mb-4">
								<div className="w-10 h-10 bg-gradient-to-br from-[#bc9a64]/20 to-[#bc9a64]/10 rounded-lg flex items-center justify-center">
									{user.is_admin ? (
										<Crown className="w-5 h-5 text-[#bc9a64]" />
									) : (
										<span className="text-sm font-medium text-[#bc9a64]">
											{user.full_name?.[0] || user.email[0].toUpperCase()}
										</span>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium truncate">
										{user.full_name || "User"}
									</p>
									<p className="text-sm text-gray-400 truncate">
										{user.is_admin ? "Admin" : user.location}
									</p>
								</div>
							</div>
							<Button
								onClick={handleLogout}
								variant="outline"
								className="w-full justify-start gap-3 border-[#bc9a64]/20 text-gray-300 hover:bg-[#bc9a64]/10 hover:text-white hover:border-[#bc9a64]/40">
								<LogOut className="w-4 h-4" />
								Sign Out
							</Button>
						</>
					) : (
						<div className="text-center text-gray-400">
							<p className="text-sm">Please log in to access all features</p>
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className="lg:ml-80 pt-20 lg:pt-0">{children}</div>
		</div>
	);
}
