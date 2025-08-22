import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import userEvent from "@testing-library/user-event";
import StatsGrid from "../../components/Dashboard/StatsGrid";
import NotesGrid from "../../components/Notes/NotesGrid";
// Test data for component testing
const testNote = {
  id: "test1",
  location: "Flatiron" as const,
  title: "Test Note",
  content: "This is a test note",
  priority: "medium" as const,
  visible_until: "2024-01-01",
  created_date: "2023-12-01T00:00:00Z",
  updated_date: "2023-12-01T00:00:00Z",
};

describe("Component Integration Tests", () => {
  describe("StatsGrid", () => {
    const mockStats = {
      todaySales: 5000,
      weekSales: 25000,
      monthSales: 100000,
      avgDaily: 3500,
      totalTreatments: 150,
      growth: 12.5,
      yesterdaySales: 4500,
      currentPeriodSales: 25000,
      lastYearPeriodSales: 20000,
      yoyGrowth: 25,
      timeframeLabel: "Last 7 Days",
    };

    it("renders stats correctly", () => {
      render(<StatsGrid stats={mockStats} />);

      expect(screen.getByText("Today's Sales")).toBeInTheDocument();
      expect(screen.getByText("5,000")).toBeInTheDocument();
      expect(screen.getByText("25,000")).toBeInTheDocument();
      expect(screen.getByText("100,000")).toBeInTheDocument();
      expect(screen.getByText("3,500")).toBeInTheDocument();
    });

    it("displays growth indicators", () => {
      render(<StatsGrid stats={mockStats} />);

      // Should show positive growth
      expect(screen.getByText("+12.5%")).toBeInTheDocument();
    });

    it("handles zero values gracefully", () => {
      const zeroStats = {
        ...mockStats,
        todaySales: 0,
        growth: 0,
      };

      render(<StatsGrid stats={zeroStats} />);

      expect(screen.getByText("0")).toBeInTheDocument();
      expect(screen.getByText("0.0%")).toBeInTheDocument();
    });
  });

  describe("NotesGrid", () => {
    const mockNotes = [testNote];
    const mockHandlers = {
      onEdit: vi.fn(),
      onDelete: vi.fn(),
    };

    it("renders notes correctly", () => {
      render(
        <NotesGrid
          notes={mockNotes}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          showLocation={true}
        />
      );

      expect(screen.getByText("Test Note")).toBeInTheDocument();
      expect(screen.getByText("This is a test note")).toBeInTheDocument();
      expect(screen.getByText("Flatiron")).toBeInTheDocument();
    });

    it("shows empty state when no notes", () => {
      render(
        <NotesGrid
          notes={[]}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
        />
      );

      expect(screen.getByText("No Notes Found")).toBeInTheDocument();
      expect(
        screen.getByText(/No notes match your current filters/)
      ).toBeInTheDocument();
    });

    it("handles priority colors correctly", () => {
      const highPriorityNote = {
        ...testNote,
        priority: "high" as const,
      };

      render(
        <NotesGrid
          notes={[highPriorityNote]}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
        />
      );

      expect(screen.getByText("High")).toBeInTheDocument();
    });

    it("calls handlers when buttons are clicked", async () => {
      const user = userEvent.setup();
      render(
        <NotesGrid
          notes={mockNotes}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
        />
      );

      const editButton = screen.getByRole("button", { name: /edit/i });
      const deleteButton = screen.getByRole("button", { name: /delete/i });

      await user.click(editButton);
      expect(mockHandlers.onEdit).toHaveBeenCalledWith(testNote);

      await user.click(deleteButton);
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(testNote.id);
    });

    it("conditionally shows location when showLocation is true", () => {
      render(
        <NotesGrid
          notes={mockNotes}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          showLocation={true}
        />
      );

      expect(screen.getByText("Flatiron")).toBeInTheDocument();
    });

    it("hides location when showLocation is false", () => {
      render(
        <NotesGrid
          notes={mockNotes}
          onEdit={mockHandlers.onEdit}
          onDelete={mockHandlers.onDelete}
          showLocation={false}
        />
      );

      // Location should not be visible
      const locationBadges = screen.queryAllByText("Flatiron");
      expect(locationBadges).toHaveLength(0);
    });
  });
});
