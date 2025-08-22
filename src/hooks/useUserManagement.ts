import { useState, useEffect } from "react";
import type { User, Location } from "@/types/entities";
import { UserEntity } from "@/services/entities";
import { AuditLogger } from "@/components/Utils/AuditLogger";

interface InviteUserData {
  email: string;
  full_name: string;
  location: Location;
  is_admin: boolean;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await UserEntity.list();
      setUsers(allUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (userData: InviteUserData): Promise<User> => {
    try {
      const newUser = await UserEntity.create(userData);
      await AuditLogger.logUser("user_created", newUser.id!, null, userData);
      await loadUsers(); // Refresh the list
      return newUser;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to invite user"
      );
    }
  };

  const updateUserAdmin = async (
    userId: string,
    isAdmin: boolean
  ): Promise<void> => {
    try {
      const oldData = users.find((u) => u.id === userId);
      if (!oldData) throw new Error("User not found");

      const newData = { ...oldData, is_admin: isAdmin };
      await UserEntity.update(userId, { is_admin: isAdmin });
      await AuditLogger.logUser("user_updated", userId, oldData, newData);
      await loadUsers(); // Refresh the list
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update user privileges"
      );
    }
  };

  const updateUserLocation = async (
    userId: string,
    location: Location
  ): Promise<void> => {
    try {
      const oldData = users.find((u) => u.id === userId);
      if (!oldData) throw new Error("User not found");

      const newData = { ...oldData, location };
      await UserEntity.update(userId, { location });
      await AuditLogger.logUser("user_updated", userId, oldData, newData);
      await loadUsers(); // Refresh the list
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to update user location"
      );
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      const oldData = users.find((u) => u.id === userId);
      if (!oldData) throw new Error("User not found");

      await UserEntity.delete(userId);
      await AuditLogger.logUser("delete", userId, oldData, null);
      await loadUsers(); // Refresh the list
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to delete user"
      );
    }
  };

  return {
    users,
    loading,
    error,
    refetch: loadUsers,
    inviteUser,
    updateUserAdmin,
    updateUserLocation,
    deleteUser,
  };
}
