import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { Flight } from "@/lib/types";

interface FlightCardProps {
  flight: Flight;
  price: number;
  currency?: string;
  onSelect?: () => void;
}

export function FlightCard({
  flight,
  price,
  currency = "USD",
  onSelect,
}: FlightCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStopsLabel = (stops: number) => {
    if (stops === 0) return "Nonstop";
    if (stops === 1) return "1 stop";
    return `${stops} stops`;
  };

  return (
    <button onClick={onSelect} className="flight-card group w-full rounded-md">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        {/* Airline Info */}
        <div className="flex items-center gap-3 lg:w-36">
          <div className="w-10 h-10 flex items-center justify-center  overflow-hidden">
            {flight.logo ? (
              <img
                src={flight.logo}
                alt={flight.airline}
                className="h-full w-full object-contain"
              />
            ) : (
              <Plane className="w-5 h-5 text-primary" />
            )}
          </div>
          <span className="text-sm font-semibold text-primary">
            {flight.airline}
          </span>
        </div>

        {/* Time & Route */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-center lg:text-left min-w-[60px]">
            <p className="time-display">{flight.departureTime}</p>
            <p className="text-xs font-medium text-muted-foreground">
              {flight.departureAirport}
            </p>
          </div>

          {/* Flight Path Visualization */}
          <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
            <span className="duration-badge">{flight.duration}</span>
            <div className="w-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary/40" />
              <div className="stops-line bg-border">
                {flight.stops > 0 &&
                  Array.from({ length: flight.stops }).map((_, i) => (
                    <div
                      key={i}
                      className="stop-dot"
                      style={{
                        left: `${((i + 1) / (flight.stops + 1)) * 100}%`,
                      }}
                    />
                  ))}
              </div>
              <Plane className="w-4 h-4 text-primary -rotate-45" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {getStopsLabel(flight.stops)}
            </span>
          </div>

          <div className="text-center lg:text-right min-w-[60px]">
            <p className="time-display">{flight.arrivalTime}</p>
            <p className="text-xs font-medium text-muted-foreground">
              {flight.arrivalAirport}
            </p>
          </div>
        </div>

        {/* Price & CTA */}

        <div className="lg:text-right w-fit">
          <p className="price-tag">{formatPrice(price)}</p>
          <p className="text-xs text-muted-foreground font-medium">
            per person
          </p>
        </div>
      </div>
    </button>
  );
}
