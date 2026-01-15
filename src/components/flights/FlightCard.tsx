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

  // return (
  //   <button onClick={onSelect} className="flight-card group w-full rounded-md">
  //     <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
  //       {/* Airline Info */}
  //       <div className="flex items-center gap-3 lg:w-36">
  //         <div className="w-10 h-10 flex items-center justify-center  overflow-hidden">
  //           {flight.logo ? (
  //             <img
  //               src={flight.logo}
  //               alt={flight.airline}
  //               className="h-full w-full object-contain"
  //             />
  //           ) : (
  //             <Plane className="w-5 h-5 text-primary" />
  //           )}
  //         </div>
  //         <span className="text-sm font-semibold text-primary">
  //           {flight.airline}
  //         </span>
  //       </div>

  //       {/* Time & Route */}
  //       <div className="flex-1 flex items-center gap-4">
  //         <div className="text-center lg:text-left min-w-[60px]">
  //           <p className="time-display">{flight.departureTime}</p>
  //           <p className="text-xs font-medium text-muted-foreground">
  //             {flight.departureAirport}
  //           </p>
  //         </div>

  //         {/* Flight Path Visualization */}
  //         <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
  //           <span className="duration-badge">{flight.duration}</span>
  //           <div className="w-full flex items-center gap-1.5">
  //             <div className="w-2 h-2 rounded-full bg-primary/40" />
  //             <div className="stops-line bg-border">
  //               {flight.stops > 0 &&
  //                 Array.from({ length: flight.stops }).map((_, i) => (
  //                   <div
  //                     key={i}
  //                     className="stop-dot"
  //                     style={{
  //                       left: `${((i + 1) / (flight.stops + 1)) * 100}%`,
  //                     }}
  //                   />
  //                 ))}
  //             </div>
  //             <Plane className="w-4 h-4 text-primary -rotate-45" />
  //           </div>
  //           <span className="text-xs font-medium text-muted-foreground">
  //             {getStopsLabel(flight.stops)}
  //           </span>
  //         </div>

  //         <div className="text-center lg:text-right min-w-[60px]">
  //           <p className="time-display">{flight.arrivalTime}</p>
  //           <p className="text-xs font-medium text-muted-foreground">
  //             {flight.arrivalAirport}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Price & CTA */}

  //       <div className="lg:text-right w-fit">
  //         <p className="price-tag">{formatPrice(price)}</p>
  //         <p className="text-xs text-muted-foreground font-medium">
  //           per person
  //         </p>
  //       </div>
  //     </div>
  //   </button>
  // );
  return (
    <button
      onClick={onSelect}
      className="group w-full rounded-md bg-card h-full"
    >
      <div className="gap-1 lg:gap-2  grid lg:grid-rows-1 lg:grid-cols-[12rem_auto_10rem] grid-rows-2 grid-cols-2 w-full">
        {/* Airline Info */}
        <div
          className="h-full lg:col-span-1 flex overflow-hidden rounded-[4px] lg:max-w-[15rem] w-full items-center gap-3 border-primary/30 border p-5 pr-10 relative
        after:absolute after:h-8 after:w-8 border-r-0  after:rounded-full after:border after:border-primary/30 after:-right-4 after:bg-card after:z-10 after:top-1/2 after:-translate-y-1/2
        before:absolute before:h-full before:w-[0.5px] before:border before:border-primary/30 before:-right-[1px] before:bg-card before:z-10"
        >
          <div className="w-10 h-10 flex items-center justify-center  overflow-hidden">
            {flight.logo ? (
              <img
                src={flight.logo}
                alt={flight.airline}
                className="h-full w-full object-contain shrink-0"
              />
            ) : (
              <Plane className="w-5 h-5 text-primary shrink-0" />
            )}
          </div>
          <span className="text-sm font-semibold text-primary">
            {flight.airline}
          </span>
        </div>

        {/* Time & Route */}
        <div className="flex-1 col-span-2 lg:col-span-1 min-h-full flex overflow-hidden justify-between rounded-[4px] w-full items-center gap-1 border-primary/30 border p-2 px-10 relative after:absolute after:h-8 after:w-8 border-x-0  after:rounded-full after:border after:border-primary/30 after:-right-4 after:bg-card after:z-10 after:top-1/2 after:-translate-y-1/2 before:absolute before:h-full before:w-[0.5px] before:border before:border-primary/30 before:-right-[1px] before:bg-card before:z-10 ">
          <div className="absolute h-8 w-8 border-l-0  rounded-full border border-primary/30 -left-4 bg-card z-10 top-1/2 -translate-y-1/2"></div>
          <div className="absolute h-full w-[0.5px] border border-primary/30 -left-[1px] bg-card z-11"></div>

          <div className="text-center lg:text-left">
            <p className="time-display">{flight.departureTime}</p>
            <p className="text-xs font-medium text-muted-foreground">
              {flight.departureAirport}
            </p>
          </div>
          {/* Flight Path Visualization */}
          <div className="flex-1 flex flex-col items-center gap-1.5 px-4">
            <span className="duration-badge">{flight.duration}</span>
            <div className="w-full items-center gap-1.5 flex lg:hidden xl:flex">
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

        <div className="lg:text-right  row-start-1 lg:col-span-1 col-start-2 lg:col-start-3 col-span-1 h-full w-full lg:w-fit flex overflow-hidden justify-between rounded-[4px] items-center gap-1 border-primary/30 border p-5 pl-10 relative after:absolute after:h-8 after:w-8 border-l-0  after:rounded-full after:border after:border-primary/30 after:-left-4 after:bg-card after:z-10 after:top-1/2 after:-translate-y-1/2 before:absolute before:h-full before:w-[0.5px] before:border before:border-primary/30 before:-left-[1px] before:bg-card before:z-10 flex-wrap ">
          <p className="price-tag">{formatPrice(price)}</p>
          <p className="text-xs text-muted-foreground font-medium">
            per person
          </p>
        </div>
      </div>
    </button>
  );
}
