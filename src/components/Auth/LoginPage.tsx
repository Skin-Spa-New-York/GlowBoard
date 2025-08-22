import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserFirebaseEntity } from "@/services/firebase";
import { AuditLogger } from "@/components/Utils/AuditLogger";
import { logger } from "@/utils/logger";
import { testFirebaseConnection } from "@/utils/firebaseTest";
import { BarChart3, AlertCircle } from "lucide-react";

interface LoginPageProps {
	onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Test Firebase connection on component mount
		testFirebaseConnection();
	}, []);

	const handleGoogleLogin = async () => {
		setLoading(true);
		setError(null);

		try {
			console.log("Starting Google login...");
			const user = await UserFirebaseEntity.login();
			console.log("Login successful:", user);

			await AuditLogger.logLogin();
			onLoginSuccess();
		} catch (err) {
			console.error("Login error:", err);
			logger.error("Login error", err);
			setError(err instanceof Error ? err.message : "Failed to login");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-6">
			<div className="w-full max-w-md">
				<Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
					<CardHeader className="text-center space-y-4">
						<div className="w-16 h-16 bg-gradient-to-br from-[#bc9a64] to-[#d4b876] rounded-xl flex items-center justify-center mx-auto shadow-lg">
							<BarChart3 className="w-8 h-8 text-[#0e0e0e]" />
						</div>
						<div>
							<CardTitle className="text-2xl font-bold text-white">
								GlowBoard Analytics
							</CardTitle>
							<p className="text-gray-400 mt-2">Sales Performance Suite</p>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						{error && (
							<Alert className="border-red-500/20 bg-red-500/10">
								<AlertCircle className="h-4 w-4 text-red-400" />
								<AlertDescription className="text-red-300">
									{error}
								</AlertDescription>
							</Alert>
						)}

						<div className="space-y-4">
							<Button
								onClick={handleGoogleLogin}
								disabled={loading}
								className="w-full bg-gradient-to-r from-[#bc9a64] to-[#d4b876] hover:from-[#a8875a] hover:to-[#c1a56b] text-[#0e0e0e] font-semibold py-3">
								{loading ? (
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 border-2 border-[#0e0e0e] border-t-transparent rounded-full animate-spin" />
										Signing in...
									</div>
								) : (
									<div className="flex items-center gap-2">
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24">
											<path
												fill="currentColor"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="currentColor"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="currentColor"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="currentColor"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
										Continue with Google
									</div>
								)}
							</Button>
						</div>

						<div className="text-center text-sm text-gray-400">
							<p>Sign in with your Google account to access</p>
							<p>the GlowBoard Analytics dashboard</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
