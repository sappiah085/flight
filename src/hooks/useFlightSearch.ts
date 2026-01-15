import { useMemo } from "react";
import {
  useSearchStore,
  selectFilteredFlights,
  selectPriceData,
} from "@/store/searchStore";

export type { Flight } from "@/lib/types";

export function useFlightSearch() {
  const {
    results,
    filters,
    isLoading,
    hasSearched,
    setFilters,
    searchParams,
  } = useSearchStore();
  // We use the store's selector logic but wrap it in useMemo here to ensure
  // we only re-calculate when relevant state changes, preserving the original optimization.
  // Alternatively, we could just rely on the store selectors if they were memoized.
  const flights = useMemo(
    () => selectFilteredFlights({ results, filters }),
    [results, filters]
  );
  const priceData = useMemo(
    () => selectPriceData({ results, filters, searchParams }),
    [results, filters, searchParams]
  );

  return {
    flights,
    priceData,
    isLoading,
    filters,
    setFilters,
    hasSearched,
  };
}
