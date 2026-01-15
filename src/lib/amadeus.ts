import { Flight } from "@/lib/types";

// Types for Amadeus API response (simplified)
interface AmadeusToken {
  access_token: string;
  expires_in: number;
}

const AMADEUS_CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;
const USE_MOCK = !AMADEUS_CLIENT_ID || !AMADEUS_CLIENT_SECRET;

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string | null> {
  if (USE_MOCK) return null;
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  try {
    const response = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: AMADEUS_CLIENT_ID,
          client_secret: AMADEUS_CLIENT_SECRET,
        }),
      }
    );

    if (!response.ok) throw new Error("Failed to get access token");

    const data: AmadeusToken = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in - 10) * 1000; // Buffer of 10s
    return cachedToken;
  } catch (error) {
    console.warn(
      "Amadeus API Warning: using mock data due to auth failure",
      error
    );
    return null;
  }
}

// Robust Mock Data Generator
const MOCK_AIRLINES = [
  {
    id: "united",
    name: "United Airlines",
    code: "UA",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/UA.png",
  },
  {
    id: "delta",
    name: "Delta Air Lines",
    code: "DL",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/DL.png",
  },
  {
    id: "american",
    name: "American Airlines",
    code: "AA",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AA.png",
  },
  {
    id: "british",
    name: "British Airways",
    code: "BA",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/BA.png",
  },
  {
    id: "emirates",
    name: "Emirates",
    code: "EK",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/EK.png",
  },
  {
    id: "lufthansa",
    name: "Lufthansa",
    code: "LH",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/LH.png",
  },
  {
    id: "airfrance",
    name: "Air France",
    code: "AF",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AF.png",
  },
  {
    id: "singapore",
    name: "Singapore Airlines",
    code: "SQ",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/SQ.png",
  },
];

const AIRPORTS: Record<string, string> = {
  JFK: "New York (JFK)",
  LHR: "London (LHR)",
  DXB: "Dubai (DXB)",
  SIN: "Singapore (SIN)",
  NRT: "Tokyo (NRT)",
  CDG: "Paris (CDG)",
  SFO: "San Francisco (SFO)",
  LAX: "Los Angeles (LAX)",
  SYD: "Sydney (SYD)",
};

function generateMockFlights(
  origin: string,
  destination: string,
  date: Date
): Flight[] {
  // Use a pseudo-random seed based on strings to keep results consistent for same inputs
  const seedString = `${origin}-${destination}-${date.toDateString()}`;
  let seed = 0;
  for (let i = 0; i < seedString.length; i++) seed += seedString.charCodeAt(i);

  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const numFlights = 15 + Math.floor(random() * 10);
  const flights: Flight[] = [];

  for (let i = 0; i < numFlights; i++) {
    const airline = MOCK_AIRLINES[Math.floor(random() * MOCK_AIRLINES.length)];
    const stops = Math.random() > 0.6 ? (Math.random() > 0.5 ? 2 : 1) : 0;

    // Base price calculation: Distance approx + Randomness
    // Simple heuristic: different letter counts -> fake distance
    const distFactor = (Math.abs(origin.length - destination.length) + 5) * 50;
    const basePrice = 200 + distFactor + random() * 300;
    const stopPriceChange = stops === 0 ? 1.5 : stops === 1 ? 1.0 : 0.8;
    const price = Math.round(basePrice * stopPriceChange);

    // Time generation
    const hour = Math.floor(random() * 24);
    const minute = Math.floor(random() * 4) * 15;
    const durationHours = 2 + Math.floor(random() * 12);
    const durationMins = Math.floor(random() * 60);

    const depStr = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    // Calculate arrival (simplified, doesn't handle day crossover correctly in string but fine for UI display)
    const arrHour = (hour + durationHours) % 24;
    const arrMin = (minute + durationMins) % 60;
    const arrStr = `${arrHour.toString().padStart(2, "0")}:${arrMin
      .toString()
      .padStart(2, "0")}`;

    flights.push({
      id: `${airline.code}-${i}-${seed}`,
      departureTime: depStr,
      arrivalTime: arrStr,
      departureAirport:
        origin.length === 3 ? AIRPORTS[origin.toUpperCase()] || origin : origin,
      arrivalAirport:
        destination.length === 3
          ? AIRPORTS[destination.toUpperCase()] || destination
          : destination,
      duration: `${durationHours}h ${durationMins}m`,
      stops,
      airline: airline.name,
      airlineId: airline.id,
      price,
      logo: airline.logo,
    });
  }

  return flights.sort((a, b) => a.price - b.price);
}

export async function searchFlights(
  origin: string,
  destination: string,
  date: Date
): Promise<Flight[]> {
  const token = await getAccessToken();

  if (!token) {
    // Fallback to mock
    await new Promise((r) => setTimeout(r, 800)); // Slight delay for realism
    return generateMockFlights(origin, destination, date);
  }

  try {
    // Real Amadeus Call
    const dateStr = date.toISOString().split("T")[0];
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${dateStr}&adults=1&nonStop=false&max=20`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return generateMockFlights(origin, destination, date);
    const data = await res.json();
    return transformAmadeusData(data);
  } catch (err) {
    console.error("API Fetch Failed, using mock", err);
    return generateMockFlights(origin, destination, date);
  }
}

function transformAmadeusData(data): Flight[] {
  console.log(data);
  if (!data.data) return [];

  return data.data.map((offer) => {
    const itinerary = offer.itineraries[0];
    const segment = itinerary.segments[0]; // First segment for basic info
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const carrierCode = segment.carrierCode;
    const airline = MOCK_AIRLINES.find((a) => a.code === carrierCode) || {
      name: carrierCode,
      id: carrierCode.toLowerCase(),
      logo: undefined,
    };

    // Duration parsing (PT2H30M -> 2h 30m)
    const duration = itinerary.duration
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m")
      .toLowerCase();

    return {
      id: offer.id,
      departureTime: segment.departure.at.split("T")[1].substring(0, 5),
      arrivalTime: lastSegment.arrival.at.split("T")[1].substring(0, 5), // Simplified
      departureAirport: segment.departure.iataCode,
      arrivalAirport: lastSegment.arrival.iataCode,
      duration: duration,
      stops: itinerary.segments.length - 1,
      airline: airline.name,
      airlineId: airline.id, // simplified mapping
      price: parseFloat(offer.price.total),
      logo: airline.logo,
    };
  });
}
