import { AuditLogFirebaseEntity } from "@/services/firebase";

export class AuditLogger {
  static async log(
    action:
      | "create"
      | "update"
      | "delete"
      | "login"
      | "logout"
      | "user_created"
      | "user_updated",
    entityType: "SalesRecord" | "Note" | "User",
    entityId: string,
    oldValues: Record<string, any> | null,
    newValues: Record<string, any> | null
  ) {
    try {
      await AuditLogFirebaseEntity.logAction(
        action,
        entityType,
        entityId,
        oldValues,
        newValues
      );
    } catch (error) {
      console.error("Failed to log audit event:", error);
    }
  }

  static async logSalesRecord(
    action: "create" | "update" | "delete",
    recordId: string,
    oldData: any,
    newData: any
  ) {
    await this.log(action, "SalesRecord", recordId, oldData, newData);
  }

  static async logNote(
    action: "create" | "update" | "delete",
    noteId: string,
    oldData: any,
    newData: any
  ) {
    await this.log(action, "Note", noteId, oldData, newData);
  }

  static async logUser(
    action: "user_created" | "user_updated" | "delete",
    userId: string,
    oldData: any,
    newData: any
  ) {
    await this.log(action, "User", userId, oldData, newData);
  }

  static async logLogin() {
    await this.log("login", "User", "system", null, null);
  }

  static async logLogout() {
    await this.log("logout", "User", "system", null, null);
  }
}
