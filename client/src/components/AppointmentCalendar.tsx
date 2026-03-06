import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, User, Phone, Mail, MapPin, Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  staff?: string;
  notes?: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  createdAt: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onViewDetails: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointmentId: string) => void;
  onStatusChange?: (appointmentId: string, status: string) => void;
}

export default function AppointmentCalendar({
  appointments,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar days for the month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  // Get appointments for a specific date
  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return appointments.filter((apt) => apt.date === dateStr);
  };

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    return appointments.filter((apt) => apt.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appointments]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground elegant-text">{monthName}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-foreground border-border hover:bg-primary/10"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevMonth}
            className="text-foreground border-border hover:bg-primary/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextMonth}
            className="text-foreground border-border hover:bg-primary/10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(["month", "week", "day"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 font-semibold transition-colors capitalize ${
              viewMode === mode
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {mode} View
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="md:col-span-2">
          <Card className="p-6 bg-white border-border">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-foreground/70 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => day && handleDateClick(day)}
                  disabled={!day}
                  className={`aspect-square p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                    !day
                      ? "bg-background"
                      : isToday(day)
                        ? "border-primary bg-primary/10 text-foreground font-bold"
                        : isSelected(day)
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-primary/50 hover:bg-primary/5 text-foreground"
                  }`}
                >
                  {day && (
                    <div className="flex flex-col items-center gap-1">
                      <span>{day}</span>
                      {getAppointmentsForDate(day).length > 0 && (
                        <span className="text-xs bg-primary/20 px-1 rounded">
                          {getAppointmentsForDate(day).length}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Appointments for selected date */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 elegant-text">
              {selectedDate ? selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) : "Select a date"}
            </h3>

            {selectedDateAppointments.length === 0 ? (
              <Card className="p-6 bg-white border-border text-center">
                <p className="text-foreground/70">No appointments scheduled</p>
              </Card>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedDateAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-4 bg-white border-border hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      {/* Status badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <span className="text-sm font-semibold text-primary">{appointment.time}</span>
                      </div>

                      {/* Customer info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <User className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-foreground">{appointment.name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-foreground/70">{appointment.phone}</p>
                        </div>

                        <div className="flex items-start gap-2">
                          <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-foreground/70 truncate">{appointment.email}</p>
                        </div>

                        {appointment.service && (
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-foreground/70">{appointment.service}</p>
                          </div>
                        )}

                        {appointment.staff && (
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <p className="text-foreground/70 text-xs">Staff: {appointment.staff}</p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <button
                          onClick={() => onViewDetails(appointment)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => onEdit(appointment)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this appointment?")) {
                              onDelete(appointment.id);
                              toast.success("Appointment deleted");
                            }
                          }}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
