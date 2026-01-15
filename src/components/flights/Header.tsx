import { Button } from "../ui/button";
import { Plane } from "lucide-react";

function Header() {
  return (
    <header className="border-b border-border/40 bg-card/60 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
            <Plane className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">
            Voyager
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Explore
          </a>
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Deals
          </a>
          <a
            href="#"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            My Trips
          </a>
        </nav>
        <Button
          variant="outline"
          className="rounded-xl border-border/60 hover:bg-accent hover:border-primary/30"
        >
          Sign In
        </Button>
      </div>
    </header>
  );
}

export default Header;
