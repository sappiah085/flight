import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/searchStore";
import { SheetClose } from "../ui/sheet";

export interface FilterState {
  stops: number[];
  airlines: string[];
  priceRange: [number, number];
  departureTime: [number, number];
}

const airlines = [
  { id: "united", name: "United Airlines" },
  { id: "delta", name: "Delta Air Lines" },
  { id: "american", name: "American Airlines" },
  { id: "british", name: "British Airways" },
  { id: "emirates", name: "Emirates" },
  { id: "lufthansa", name: "Lufthansa" },
];

const stopOptions = [
  { value: 0, label: "Nonstop" },
  { value: 1, label: "1 stop" },
  { value: 2, label: "2+ stops" },
];

export function Filters({
  handleCloseSheet,
}: {
  handleCloseSheet?: () => void;
}) {
  const filters = useSearchStore((store) => store.filters);
  const setFilters = useSearchStore((store) => store.setFilters);
  const [stops, setStops] = useState<number[]>([0, 1, 2]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>(
    airlines.map((a) => a.id)
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [departureTime, setDepartureTime] = useState<[number, number]>([0, 24]);

  // Sync with provided filters prop
  useEffect(() => {
    if (filters) {
      setStops(filters.stops);
      setSelectedAirlines(filters.airlines);
      setPriceRange(filters.priceRange);
      setDepartureTime(filters.departureTime);
    }
  }, [filters]);

  const handleStopToggle = (stop: number) => {
    const newStops = stops.includes(stop)
      ? stops.filter((s) => s !== stop)
      : [...stops, stop];
    setStops(newStops);
    emitChange({
      stops: newStops,
      airlines: selectedAirlines,
      priceRange,
      departureTime,
    });
  };

  const handleAirlineToggle = (airlineId: string) => {
    const newAirlines = selectedAirlines.includes(airlineId)
      ? selectedAirlines.filter((a) => a !== airlineId)
      : [...selectedAirlines, airlineId];
    setSelectedAirlines(newAirlines);
    emitChange({ stops, airlines: newAirlines, priceRange, departureTime });
  };

  const handlePriceChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setPriceRange(range);

    emitChange({
      stops,
      airlines: selectedAirlines,
      priceRange: range,
      departureTime,
    });
  };

  const handleTimeChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setDepartureTime(range);
    emitChange({
      stops,
      airlines: selectedAirlines,
      priceRange,
      departureTime: range,
    });
  };

  const emitChange = (filters: FilterState) => {
    setFilters(filters);
  };

  const formatTime = (hour: number) => {
    if (hour === 0 || hour === 24) return "12am";
    if (hour === 12) return "12pm";
    if (hour < 12) return `${hour}am`;
    return `${hour - 12}pm`;
  };

  const handleReset = () => {
    setStops([0, 1, 2]);
    setSelectedAirlines(airlines.map((a) => a.id));
    setPriceRange([0, 2000]);
    setDepartureTime([0, 24]);
    emitChange({
      stops: [0, 1, 2],
      airlines: airlines.map((a) => a.id),
      priceRange: [0, 2000],
      departureTime: [0, 24],
    });
  };

  return (
    <div className="space-y-6">
      {/* Stops */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Stops</h3>
        <div className="space-y-2.5">
          {stopOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-3">
              <Checkbox
                id={`stop-${option.value}`}
                checked={stops.includes(option.value)}
                onCheckedChange={() => handleStopToggle(option.value)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`stop-${option.value}`}
                className="text-sm cursor-pointer text-foreground/80"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Price</h3>
          <span className="text-sm text-primary font-semibold">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={handlePriceChange}
          min={0}
          max={2000}
          step={50}
          className="mt-2"
        />
      </div>

      {/* Departure Time */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Departure Time</h3>
          <span className="text-sm text-primary font-semibold">
            {formatTime(departureTime[0])} - {formatTime(departureTime[1])}
          </span>
        </div>
        <Slider
          value={departureTime}
          onValueChange={handleTimeChange}
          min={0}
          max={24}
          step={1}
          className="mt-2"
        />
      </div>

      {/* Airlines */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Airlines</h3>
        <div className="space-y-2.5">
          {airlines.map((airline) => (
            <div key={airline.id} className="flex items-center space-x-3">
              <Checkbox
                id={`airline-${airline.id}`}
                checked={selectedAirlines.includes(airline.id)}
                onCheckedChange={() => handleAirlineToggle(airline.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`airline-${airline.id}`}
                className="text-sm cursor-pointer text-foreground/80"
              >
                {airline.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Reset */}
      <Button
        variant="outline"
        className="w-full rounded-xl border-border/60 hover:bg-accent hover:border-primary/30 font-semibold"
        onClick={handleReset}
      >
        Reset Filters
      </Button>

      <Button
        className="w-full rounded-xl border-border/60 lg:hidden hover:bg-accent hover:border-primary/30 font-semibold hover:text-primary"
        onClick={handleCloseSheet}
      >
        Apply Filters
      </Button>
    </div>
  );
}
