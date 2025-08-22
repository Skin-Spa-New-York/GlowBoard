import { useState } from "react";
import { AdminSetup } from "@/components/Utils/AdminSetup";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DevUtils() {
  const { user, isAdmin } = useAuth();
  const [showAdminSetup, setShowAdminSetup] = useState(false);

  // Only show in development or to admins
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment && !isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>
              This page is only available in development mode or to
              administrators.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Utilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Current User Info</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Email:</strong> {user?.email || "Not logged in"}
                </p>
                <p>
                  <strong>Name:</strong> {user?.full_name || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {user?.location || "N/A"}
                </p>
                <p>
                  <strong>Admin:</strong> {isAdmin ? "Yes" : "No"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Admin Management</h3>
              <Button
                onClick={() => setShowAdminSetup(true)}
                variant="outline"
                size="sm"
              >
                Promote User to Admin
              </Button>
            </div>
          </div>

          {showAdminSetup && (
            <div className="mt-6">
              <AdminSetup onClose={() => setShowAdminSetup(false)} />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>First User Admin Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The system automatically makes the first user to sign up an
              administrator. This ensures there's always at least one admin who
              can manage other users.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                How it works:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • When a user signs up, the system checks if any users exist
                </li>
                <li>
                  • If no users exist, the new user is automatically made an
                  admin
                </li>
                <li>• Subsequent users are created as regular users</li>
                <li>
                  • Admins can promote other users through User Management
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">
                Emergency Admin Promotion:
              </h4>
              <p className="text-sm text-yellow-800">
                If you need to manually promote a user to admin (e.g., for
                testing), use the "Promote User to Admin" button above. This
                should only be used in development or emergency situations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
