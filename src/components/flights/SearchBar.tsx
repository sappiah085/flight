import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Plane,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  ArrowRightLeft,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const airports = [
  { code: "JFK", city: "New York", name: "John F. Kennedy International" },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International" },
  { code: "LHR", city: "London", name: "Heathrow Airport" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" },
  { code: "DXB", city: "Dubai", name: "Dubai International" },
  { code: "SIN", city: "Singapore", name: "Changi Airport" },
  { code: "NRT", city: "Tokyo", name: "Narita International" },
  { code: "SFO", city: "San Francisco", name: "San Francisco International" },
  { code: "MIA", city: "Miami", name: "Miami International" },
  { code: "ORD", city: "Chicago", name: "O'Hare International" },
];

import { useSearchStore } from "@/store/searchStore";

export function SearchBar() {
  const searchParams = useSearchStore((s) => s.searchParams);
  const search = useSearchStore((s) => s.search);
  const setSearchParams = useSearchStore((s) => s.setSearchParams);
  const setHasSearched = useSearchStore((s) => s.setHasSearched);

  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const destRef = useRef<HTMLButtonElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);

  const handleOriginSelect = (code: string) => {
    setSearchParams({ origin: code });
    setOriginOpen(false);
    setTimeout(() => destRef.current?.click(), 100);
  };

  const handleDestSelect = (code: string) => {
    setSearchParams({ destination: code });
    setDestOpen(false);
    setTimeout(() => dateRef.current?.click(), 100);
  };

  const handleSwap = () => {
    const temp = searchParams.origin;
    setSearchParams({ origin: searchParams.destination });
    setSearchParams({ destination: temp });
  };

  const handleSearch = () => {
    if (
      searchParams.origin &&
      searchParams.destination &&
      searchParams.departureDate
    ) {
      search({
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate,
        passengers: searchParams.passengers,
      });
      setHasSearched();
    }
  };

  const getAirportDisplay = (code: string) => {
    const airport = airports.find((a) => a.code === code);
    return airport ? `${airport.city} (${airport.code})` : "";
  };

  return (
    <div className="floating-card p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Origin */}
        <div className="flex-1 relative">
          <Popover open={originOpen} onOpenChange={setOriginOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                className={cn(
                  "w-full search-input justify-start text-left font-normal",
                  !searchParams.origin && "text-muted-foreground"
                )}
              >
                <MapPin className="mr-2 h-4 w-4 shrink-0 text-primary" />
                {searchParams.origin
                  ? getAirportDisplay(searchParams.origin)
                  : "Where from?"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] p-0 border-border/60 bg-card"
              align="start"
            >
              <Command className="bg-transparent">
                <CommandInput
                  placeholder="Search airports..."
                  className="border-0"
                />
                <CommandList>
                  <CommandEmpty>No airport found.</CommandEmpty>
                  <CommandGroup>
                    {airports.map((airport) => (
                      <CommandItem
                        key={airport.code}
                        value={`${airport.city} ${airport.code} ${airport.name}`}
                        onSelect={() => handleOriginSelect(airport.code)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        <div className="flex flex-col">
                          <span className="text-foreground">
                            {airport.city} ({airport.code})
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {airport.name}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Swap Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl shrink-0 hidden lg:flex hover:bg-accent border border-border/40"
          onClick={handleSwap}
        >
          <ArrowRightLeft className="h-4 w-4 text-primary" />
        </Button>

        {/* Destination */}
        <div className="flex-1 relative">
          <Popover open={destOpen} onOpenChange={setDestOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={destRef}
                variant="ghost"
                role="combobox"
                className={cn(
                  "w-full search-input justify-start text-left font-normal",
                  !searchParams.destination && "text-muted-foreground"
                )}
              >
                <Plane className="mr-2 h-4 w-4 shrink-0 text-primary" />
                {searchParams.destination
                  ? getAirportDisplay(searchParams.destination)
                  : "Where to?"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[300px] p-0 border-border/60 bg-card"
              align="start"
            >
              <Command className="bg-transparent">
                <CommandInput
                  placeholder="Search airports..."
                  className="border-0"
                />
                <CommandList>
                  <CommandEmpty>No airport found.</CommandEmpty>
                  <CommandGroup>
                    {airports
                      .filter((a) => a.code !== searchParams.origin)
                      .map((airport) => (
                        <CommandItem
                          key={airport.code}
                          value={`${airport.city} ${airport.code} ${airport.name}`}
                          onSelect={() => handleDestSelect(airport.code)}
                          className="cursor-pointer hover:bg-accent"
                        >
                          <div className="flex flex-col">
                            <span className="text-foreground">
                              {airport.city} ({airport.code})
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {airport.name}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Picker */}
        <div className="flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                ref={dateRef}
                variant="ghost"
                className={cn(
                  "w-full search-input justify-start text-left font-normal",
                  !searchParams.departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-primary" />
                {searchParams.departureDate
                  ? searchParams.returnDate
                    ? `${format(
                        searchParams.departureDate,
                        "MMM d"
                      )} - ${format(searchParams.returnDate, "MMM d")}`
                    : format(searchParams.departureDate, "MMM d, yyyy")
                  : "Select dates"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 border-border/60 bg-card"
              align="start"
            >
              <Calendar
                mode="range"
                selected={{
                  from: searchParams.departureDate,
                  to: searchParams.returnDate,
                }}
                onSelect={(range) => {
                  setSearchParams({ departureDate: range?.from });
                  setSearchParams({ returnDate: range?.to });
                }}
                numberOfMonths={2}
                disabled={(date) => date < new Date()}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Passengers */}
        <div className="w-full lg:w-36">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full search-input justify-start text-left font-normal"
              >
                <Users className="mr-2 h-4 w-4 shrink-0 text-primary" />
                {searchParams.passengers}{" "}
                {searchParams.passengers === 1 ? "Traveler" : "Travelers"}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[9rem] p-4 border-border/60 bg-card flex items-center justify-between"
              align="end"
            >
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-border/60"
                onClick={() =>
                  setSearchParams({
                    passengers: Math.max(1, searchParams.passengers - 1),
                  })
                }
              >
                -
              </Button>
              <span className="w-6 text-center font-semibold text-foreground">
                {searchParams.passengers}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg border-border/60"
                onClick={() =>
                  setSearchParams({
                    passengers: Math.min(9, searchParams.passengers + 1),
                  })
                }
              >
                +
              </Button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-10 lg:w-10 rounded-full font-semibold text-base shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90"
          disabled={
            !searchParams.origin ||
            !searchParams.destination ||
            !searchParams.departureDate
          }
        >
          <Search className="h-5 w-5" />
          <span className="lg:hidden">Search</span>
        </Button>
      </div>
    </div>
  );
}
