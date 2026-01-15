import { create } from "zustand";
import { Flight } from "@/lib/types";
import { airlines, searchFlights } from "@/lib/amadeus";

export interface FilterState {
  stops: number[];
  airlines: string[];
  priceRange: [number, number];
  departureTime: [number, number];
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: number;
}

interface SearchState {
  searchParams: SearchParams | null;
  results: Flight[];
  filters: FilterState;
  isLoading: boolean;
  hasSearched: boolean;
  airlines: { name: string; id: string }[];

  // Actions
  setSearchParams: (params: Partial<SearchParams>) => void;
  setFilters: (
    filters: FilterState | ((prev: FilterState) => FilterState)
  ) => void;
  search: (params: SearchParams) => Promise<void>;
  resetFilters: () => void;
  setHasSearched: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  stops: [0, 1, 2],
  airlines: [
    "united",
    "delta",
    "american",
    "british",
    "emirates",
    "lufthansa",
    "airfrance",
    "singapore",
  ],
  priceRange: [0, 3000],
  departureTime: [0, 24],
};

export const useSearchStore = create<SearchState>((set, get) => ({
  searchParams: {
    origin: "",
    destination: "",
    returnDate: null,
    departureDate: null,
    passengers: 1,
  },
  hasSearched: false,
  results: [],
  filters: DEFAULT_FILTERS,
  isLoading: false,
  airlines: airlines,
  setHasSearched: () => set({ hasSearched: true }),
  setSearchParams: (params) =>
    set((prevState) => ({
      searchParams: { ...prevState.searchParams, ...params },
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: typeof filters === "function" ? filters(state.filters) : filters,
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  search: async (params) => {
    set({ isLoading: true, searchParams: params });
    const { results, airlines } = await searchFlights(
      params.origin,
      params.destination,
      params.departureDate
    );
    // Update results
    set((state) => {
      // Smart filter adjustment based on new results (similar to original hook)
      const newFilters = { ...state.filters };
      if (results.length > 0) {
        const maxPrice = Math.max(...results.map((f) => f.price));
        newFilters.priceRange = [
          0,
          Math.max(state.filters.priceRange[1], maxPrice + 100),
        ];
      }
      return {
        results,
        filters: {
          ...newFilters,
          airlines: airlines.map((airline) => airline.id),
        },
        isLoading: false,
        airlines,
      };
    });
  },
}));

// Helper logic for derived state (Selector style)
export const selectFilteredFlights = (state: Partial<SearchState>) => {
  const { results, filters } = state;
  return results
    .filter((flight) => {
      // Filter by stops
      const stopsMatch = filters.stops.includes(Math.min(flight.stops, 2));

      // Filter by airlines
      const airlineMatch = filters.airlines.some(
        (id) =>
          flight.airlineId.toLowerCase().includes(id.toLowerCase()) ||
          id.toLowerCase().includes(flight.airlineId.toLowerCase())
      );

      // Filter by price
      const priceMatch =
        flight.price >= filters.priceRange[0] &&
        flight.price <= filters.priceRange[1];

      // Filter by departure time
      const depHour = parseInt(flight.departureTime.split(":")[0]);
      const timeMatch =
        depHour >= filters.departureTime[0] &&
        depHour <= filters.departureTime[1];

      return stopsMatch && airlineMatch && priceMatch && timeMatch;
    })
    .sort((a, b) => a.price - b.price);
};

// Generate realistic price history
export const selectPriceData = (state: Partial<SearchState>) => {
  const filteredFlights = selectFilteredFlights(state);
  const { results, searchParams } = state;

  // Use selected date or fallback to today
  const departureDate = searchParams?.departureDate
    ? new Date(searchParams.departureDate)
    : new Date();

  const returnDate = searchParams?.returnDate
    ? new Date(searchParams.returnDate)
    : null;

  // Determine graph start and end points
  // Start -2 days from departure
  const graphStartDate = new Date(departureDate);
  graphStartDate.setDate(departureDate.getDate() - 2);

  // End date logic:
  // If return date exists, go to return date + 2 days
  // Else, show 14 days from departure
  const graphEndDate = new Date(departureDate);
  if (returnDate) {
    graphEndDate.setTime(returnDate.getTime());
    graphEndDate.setDate(graphEndDate.getDate() + 2);
  } else {
    graphEndDate.setDate(departureDate.getDate() + 14);
  }

  // Calculate total days to render
  const timeDiff = graphEndDate.getTime() - graphStartDate.getTime();
  const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // If we have results, we want the price on the selected date to match
  // the execution (min price) of the results.
  let targetPriceForSelectedDate = 500; // Default fallback
  if (filteredFlights.length > 0) {
    targetPriceForSelectedDate = Math.min(
      ...filteredFlights.map((f) => f.price)
    );
  } else if (results.length > 0) {
    targetPriceForSelectedDate = Math.min(...results.map((f) => f.price)) * 1.2;
  }

  const generatePriceData = (anchorPrice: number) => {
    const dates = [];

    for (let i = 0; i <= totalDays; i++) {
      const date = new Date(graphStartDate);
      date.setDate(date.getDate() + i);

      // Check if this date matches our key dates (departure/return) to anchor prices
      const isDepartureParams =
        date.toISOString().split("T")[0] ===
        departureDate.toISOString().split("T")[0];
      // Ideally we'd also anchor the return date price if we had data for it,
      // but we only have one search query result set usually.

      let variation = 1.0;
      // Random variation logic
      variation += Math.random() * 0.3 - 0.15;

      const dayOfWeek = date.getDay();
      const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.15 : 1;

      let price = Math.round(anchorPrice * variation * weekendMultiplier);

      // Anchor specific dates
      if (isDepartureParams) {
        price = targetPriceForSelectedDate;
      }

      dates.push({
        date: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        price: price,
      });
    }
    return dates;
  };

  return generatePriceData(targetPriceForSelectedDate);
};
