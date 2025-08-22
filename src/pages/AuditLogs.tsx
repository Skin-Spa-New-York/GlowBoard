import { Shield, Clock, User as UserIcon, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

export default function AuditLogs() {
  const { user: currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#bc9a64] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!currentUser?.is_admin) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <Alert className="border-red-500/20 bg-red-500/10">
            <Shield className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">
              Access denied. Only administrators can view audit logs.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#bc9a64]" />
            Audit Logs
          </h1>
          <p className="text-gray-400">
            Complete audit trail of all system activities and changes
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="bg-[#1a1a1a] border-[#bc9a64]/20">
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 text-[#bc9a64] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Audit Logs Coming Soon
            </h3>
            <p className="text-gray-400 mb-6">
              Comprehensive audit logging and reporting features are being
              developed and will be available in the next update.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <Clock className="w-8 h-8 text-[#bc9a64] mx-auto mb-2" />
                <p className="text-sm text-gray-300">Activity Timeline</p>
              </div>
              <div className="text-center">
                <UserIcon className="w-8 h-8 text-[#bc9a64] mx-auto mb-2" />
                <p className="text-sm text-gray-300">User Actions</p>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 text-[#bc9a64] mx-auto mb-2" />
                <p className="text-sm text-gray-300">Data Changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
