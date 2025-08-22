import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./components/Auth/LoginPage";
import ErrorBoundary from "./components/Utils/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import { logger } from "./utils/logger";

// Lazy load pages for better code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SalesEntry = lazy(() => import("./pages/SalesEntry"));
const RecentActivity = lazy(() => import("./pages/RecentActivity"));
const Notes = lazy(() => import("./pages/Notes"));

// Admin pages - loaded separately for better chunking
const UserManagement = lazy(() => import("./pages/UserManagement"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const Settings = lazy(() => import("./pages/Settings"));

// Development utilities
const DevUtils = lazy(() => import("./pages/DevUtils"));

// Loading component
const PageLoader = () => (
	<div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
		<div className="text-center">
			<div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
			<p className="text-gray-400">Loading...</p>
		</div>
	</div>
);

function App() {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
				<div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!user) {
		return <LoginPage onLoginSuccess={() => window.location.reload()} />;
	}

	return (
		<ErrorBoundary>
			<Suspense fallback={<PageLoader />}>
				<Routes>
					<Route
						path="/"
						element={
							<Layout>
								<Dashboard />
							</Layout>
						}
					/>
					<Route
						path="/dashboard"
						element={
							<Layout>
								<Dashboard />
							</Layout>
						}
					/>
					<Route
						path="/sales-entry"
						element={
							<Layout>
								<SalesEntry />
							</Layout>
						}
					/>
					<Route
						path="/recent-activity"
						element={
							<Layout>
								<RecentActivity />
							</Layout>
						}
					/>
					<Route
						path="/notes"
						element={
							<Layout>
								<Notes />
							</Layout>
						}
					/>
					<Route
						path="/user-management"
						element={
							<Layout>
								<UserManagement />
							</Layout>
						}
					/>
					<Route
						path="/audit-logs"
						element={
							<Layout>
								<AuditLogs />
							</Layout>
						}
					/>
					<Route
						path="/settings"
						element={
							<Layout>
								<Settings />
							</Layout>
						}
					/>
					<Route
						path="/dev-utils"
						element={
							<Layout>
								<DevUtils />
							</Layout>
						}
					/>
				</Routes>
			</Suspense>
		</ErrorBoundary>
	);
}

export default App;
