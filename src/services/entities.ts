// Firebase-based entity services
import {
  SalesRecordFirebaseEntity,
  NoteFirebaseEntity,
  UserFirebaseEntity,
  AuditLogFirebaseEntity,
} from "./firebase";

// Export Firebase services as the main entities
export const SalesRecordEntity = SalesRecordFirebaseEntity;
export const NoteEntity = NoteFirebaseEntity;
export const UserEntity = UserFirebaseEntity;
export const AuditLogEntity = AuditLogFirebaseEntity;

// Legacy exports for backward compatibility
export { SalesRecordFirebaseEntity as SalesRecord };
export { NoteFirebaseEntity as Note };
export { UserFirebaseEntity as User };
export { AuditLogFirebaseEntity as AuditLog };
