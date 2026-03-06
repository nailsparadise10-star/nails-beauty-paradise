import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, DollarSign, Trash2, Edit2, Plus } from "lucide-react";

export interface AppointmentService {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  staff?: string;
  location: string;
}

interface AppointmentSummaryProps {
  services: AppointmentService[];
  onAddService: () => void;
  onEditService: (id: string) => void;
  onRemoveService: (id: string) => void;
  onSchedule: () => void;
  isLoading?: boolean;
}

export default function AppointmentSummary({
  services,
  onAddService,
  onEditService,
  onRemoveService,
  onSchedule,
  isLoading = false,
}: AppointmentSummaryProps) {
  // Calculate totals
  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
  const totalPrice = services.reduce((sum, service) => sum + service.price, 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;
  const durationText =
    hours > 0
      ? `${hours} hr${hours > 1 ? "s" : ""} ${minutes > 0 ? `${minutes} min` : ""}`
      : `${minutes} min`;

  if (services.length === 0) {
    return (
      <Card className="p-8 bg-white border-border text-center">
        <p className="text-foreground/70 mb-6">No services selected yet</p>
        <Button
          onClick={onAddService}
          className="bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add First Service
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6 elegant-text">
        Appointment Summary
      </h2>

      {/* Services List */}
      <div className="space-y-4 mb-8">
        {services.map((service, idx) => (
          <div
            key={service.id}
            className="border border-border rounded-lg p-4 bg-background/50"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg">
                  {service.name}
                </h3>
                <p className="text-sm text-foreground/70 mt-1">
                  {service.staff ? `With ${service.staff}` : "With any staff member"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEditService(service.id)}
                  className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                  title="Edit service"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onRemoveService(service.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                  title="Remove service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-foreground/70">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{service.location}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70">
                <Clock className="w-4 h-4 text-primary" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <DollarSign className="w-4 h-4" />
                <span>${service.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Another Service Button */}
      <Button
        onClick={onAddService}
        variant="outline"
        className="w-full mb-8 border-primary text-primary hover:bg-primary/10 rounded-lg font-semibold"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Service
      </Button>

      {/* Summary */}
      <div className="border-t border-border pt-6 mb-6">
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Total Duration:</span>
            <span className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              {durationText}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-foreground/70">Total Price:</span>
            <span className="text-2xl font-bold text-primary flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {totalPrice}
            </span>
          </div>
        </div>

        {/* Schedule Button */}
        <Button
          onClick={onSchedule}
          disabled={isLoading || services.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold py-6 text-lg transition-all"
        >
          {isLoading ? "Processing..." : "Schedule Appointment"}
        </Button>
      </div>

      {/* Location Info */}
      <div className="bg-primary/5 rounded-lg p-4 text-sm text-foreground/70">
        <p className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-primary" />
          <strong>Location:</strong>
        </p>
        <p>49 Vulture Street, West End, QLD 4101, Australia</p>
      </div>
    </Card>
  );
}
