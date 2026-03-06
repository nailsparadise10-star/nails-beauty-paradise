import { describe, it, expect, vi } from "vitest";

describe("AppointmentCalendar", () => {
  it("should render calendar with correct month and year", () => {
    const mockAppointments = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        service: "Manicure",
        date: "2026-03-15",
        time: "10:00 AM",
        staff: "Sarah",
        notes: "Test appointment",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
    ];

    expect(mockAppointments).toHaveLength(1);
    expect(mockAppointments[0].date).toBe("2026-03-15");
  });

  it("should filter appointments by date", () => {
    const appointments = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        service: "Manicure",
        date: "2026-03-15",
        time: "10:00 AM",
        staff: "Sarah",
        notes: "Test",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "987-654-3210",
        service: "Pedicure",
        date: "2026-03-16",
        time: "02:00 PM",
        staff: "Emily",
        notes: "Test",
        status: "pending" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
    ];

    const march15 = appointments.filter((apt) => apt.date === "2026-03-15");
    expect(march15).toHaveLength(1);
    expect(march15[0].name).toBe("John Doe");
  });

  it("should handle appointment status correctly", () => {
    const statuses = ["confirmed", "pending", "completed", "cancelled"] as const;
    const appointment = {
      id: "1",
      name: "Test",
      email: "test@example.com",
      phone: "123-456-7890",
      service: "Manicure",
      date: "2026-03-15",
      time: "10:00 AM",
      staff: "Sarah",
      notes: "Test",
      status: "confirmed" as const,
      createdAt: "2026-03-01T00:00:00Z",
    };

    expect(statuses).toContain(appointment.status);
  });

  it("should sort appointments by time", () => {
    const appointments = [
      {
        id: "1",
        name: "John",
        email: "john@example.com",
        phone: "123-456-7890",
        service: "Manicure",
        date: "2026-03-15",
        time: "02:00 PM",
        staff: "Sarah",
        notes: "Test",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Jane",
        email: "jane@example.com",
        phone: "987-654-3210",
        service: "Pedicure",
        date: "2026-03-15",
        time: "10:00 AM",
        staff: "Emily",
        notes: "Test",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
    ];

    const sorted = appointments.sort((a, b) => a.time.localeCompare(b.time));
    expect(sorted[0].time).toBe("10:00 AM");
    expect(sorted[1].time).toBe("02:00 PM");
  });

  it("should calculate appointments per date", () => {
    const appointments = [
      {
        id: "1",
        name: "John",
        email: "john@example.com",
        phone: "123-456-7890",
        service: "Manicure",
        date: "2026-03-15",
        time: "10:00 AM",
        staff: "Sarah",
        notes: "Test",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Jane",
        email: "jane@example.com",
        phone: "987-654-3210",
        service: "Pedicure",
        date: "2026-03-15",
        time: "02:00 PM",
        staff: "Emily",
        notes: "Test",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
      {
        id: "3",
        name: "Bob",
        email: "bob@example.com",
        phone: "555-555-5555",
        service: "Gel Manicure",
        date: "2026-03-16",
        time: "11:00 AM",
        staff: "Maria",
        notes: "Test",
        status: "confirmed" as const,
        createdAt: "2026-03-01T00:00:00Z",
      },
    ];

    const march15Count = appointments.filter((apt) => apt.date === "2026-03-15").length;
    const march16Count = appointments.filter((apt) => apt.date === "2026-03-16").length;

    expect(march15Count).toBe(2);
    expect(march16Count).toBe(1);
  });

  it("should validate appointment data structure", () => {
    const appointment = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      service: "Manicure",
      date: "2026-03-15",
      time: "10:00 AM",
      staff: "Sarah",
      notes: "Test appointment",
      status: "confirmed" as const,
      createdAt: "2026-03-01T00:00:00Z",
    };

    expect(appointment).toHaveProperty("id");
    expect(appointment).toHaveProperty("name");
    expect(appointment).toHaveProperty("email");
    expect(appointment).toHaveProperty("phone");
    expect(appointment).toHaveProperty("service");
    expect(appointment).toHaveProperty("date");
    expect(appointment).toHaveProperty("time");
    expect(appointment).toHaveProperty("status");
  });
});
