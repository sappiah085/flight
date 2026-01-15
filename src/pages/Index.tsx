import { SearchBar } from "@/components/flights/SearchBar";
import { FlightCard } from "@/components/flights/FlightCard";
import { FlightCardSkeleton } from "@/components/flights/FlightCardSkeleton";
import { PriceGraph } from "@/components/flights/PriceGraph";
import { Filters } from "@/components/flights/Filters";
import { useFlightSearch } from "@/hooks/useFlightSearch";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, Plane, Loader } from "lucide-react";
import Header from "@/components/flights/Header";
import { useState } from "react";
import { PriceGraphSkeleton } from "@/components/flights/GraphSkeleton";

const Index = () => {
  const { flights, priceData, isLoading, hasSearched } = useFlightSearch();
  const [openSheet, setOpenSheet] = useState(false);
  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      {!hasSearched && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-5 tracking-tight leading-tight">
                Let's Find Your
                <br />
                <span className="text-primary">Destination</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Discover the best prices on thousands of destinations worldwide.
              </p>
            </div>

            <div className="max-w-5xl mx-auto animate-slide-up">
              <SearchBar />
            </div>
          </div>
        </section>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="container mx-auto px-4 py-6">
          {/* Compact Search */}
          <div className="mb-6">
            <SearchBar />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="floating-card p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-5 text-foreground">
                  Filters
                </h2>
                <Filters />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Price Graph */}
              <div className="mb-6 animate-fade-in">
                {isLoading || flights.length === 0 ? (
                  <PriceGraphSkeleton />
                ) : (
                  <PriceGraph data={priceData} />
                )}
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        Searching flights{" "}
                        <Loader className="animate-spin size-4" />
                      </div>
                    ) : (
                      `${flights.length} flights found`
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Best prices guaranteed
                  </p>
                </div>

                {/* Mobile Filter Button */}
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden rounded-xl border-border/60"
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="min-h-fit rounded-t-3xl bg-card border-border/50"
                  >
                    <div className="p-4 overflow-auto h-full">
                      <Filters handleCloseSheet={() => setOpenSheet(false)} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Flight List */}
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <FlightCardSkeleton key={i} />
                  ))
                ) : flights.length > 0 ? (
                  flights.map((flight, index) => (
                    <div
                      key={flight.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <FlightCard
                        flight={flight}
                        price={flight.price}
                        onSelect={() => console.log("Selected:", flight)}
                      />
                    </div>
                  ))
                ) : (
                  <div className="floating-card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                      <Plane className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No flights found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or search for different dates
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto py-10 bg-card/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Voyager</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Voyager. Premium travel experiences.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
