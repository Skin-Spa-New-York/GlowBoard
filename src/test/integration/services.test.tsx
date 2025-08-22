import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  SalesRecordEntity,
  UserEntity,
  NoteEntity,
  AuditLogEntity,
} from "../../services/entities";

describe("Entity Services Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Service Structure", () => {
    it("exports all required entity services", () => {
      expect(SalesRecordEntity).toBeDefined();
      expect(UserEntity).toBeDefined();
      expect(NoteEntity).toBeDefined();
      expect(AuditLogEntity).toBeDefined();
    });

    it("services have required methods", () => {
      const services = [
        SalesRecordEntity,
        UserEntity,
        NoteEntity,
        AuditLogEntity,
      ];

      services.forEach((service) => {
        expect(service.list).toBeDefined();
        expect(service.get).toBeDefined();
        expect(service.create).toBeDefined();
        expect(service.update).toBeDefined();
        expect(service.delete).toBeDefined();
      });
    });

    it("UserEntity has additional methods", () => {
      expect(UserEntity.me).toBeDefined();
      expect(UserEntity.logout).toBeDefined();
    });
  });

  describe("Service Method Signatures", () => {
    it("list methods return promises", () => {
      expect(SalesRecordEntity.list()).toBeInstanceOf(Promise);
      expect(UserEntity.list()).toBeInstanceOf(Promise);
      expect(NoteEntity.list()).toBeInstanceOf(Promise);
      expect(AuditLogEntity.list()).toBeInstanceOf(Promise);
    });

    it("create methods accept data and return promises", () => {
      const salesData = {
        location: "Flatiron" as const,
        date: "2023-12-01",
        daily_sales: 1000,
      };

      expect(SalesRecordEntity.create(salesData)).toBeInstanceOf(Promise);
    });

    it("update methods accept id and data", () => {
      const updateData = { daily_sales: 2000 };
      expect(SalesRecordEntity.update("1", updateData)).toBeInstanceOf(Promise);
    });

    it("delete methods accept id", () => {
      expect(SalesRecordEntity.delete("1")).toBeInstanceOf(Promise);
    });
  });

  describe("Error Handling", () => {
    it("methods throw errors when not implemented", async () => {
      await expect(SalesRecordEntity.list()).rejects.toThrow(
        "SalesRecord.list() not implemented"
      );
      await expect(UserEntity.me()).rejects.toThrow(
        "User.me() not implemented"
      );
      await expect(
        NoteEntity.create({
          location: "Flatiron",
          title: "Test",
          content: "Test content",
          priority: "medium",
        })
      ).rejects.toThrow("Note.create() not implemented");
    });
  });
});
