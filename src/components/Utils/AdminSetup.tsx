import React, { useState } from "react";
import { UserEntity } from "@/services/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminSetupProps {
  onClose?: () => void;
}

export function AdminSetup({ onClose }: AdminSetupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePromoteToAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await UserEntity.promoteToAdmin(email.trim());
      setMessage(`Successfully promoted ${email} to admin`);
      setEmail("");

      // Auto-close after success
      setTimeout(() => {
        onClose?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to promote user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Admin Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePromoteToAdmin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-500 text-sm bg-green-50 p-2 rounded">
              {message}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Promoting..." : "Promote to Admin"}
            </Button>

            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>
            <strong>Note:</strong> The first user to sign up is automatically
            made an admin. Use this form only for emergency admin promotion.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
