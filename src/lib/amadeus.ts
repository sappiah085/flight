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

// Robust Mock Data Generator — Global Airlines (Major Coverage)
const MOCK_AIRLINES = [
  // 🇺🇸 North America
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
    id: "southwest",
    name: "Southwest Airlines",
    code: "WN",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/WN.png",
  },
  {
    id: "aircanada",
    name: "Air Canada",
    code: "AC",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AC.png",
  },
  {
    id: "alaska",
    name: "Alaska Airlines",
    code: "AS",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AS.png",
  },

  // 🇪🇺 Europe
  {
    id: "lufthansa",
    name: "Lufthansa",
    code: "LH",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/LH.png",
  },
  {
    id: "british",
    name: "British Airways",
    code: "BA",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/BA.png",
  },
  {
    id: "airfrance",
    name: "Air France",
    code: "AF",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AF.png",
  },
  {
    id: "klm",
    name: "KLM",
    code: "KL",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/KL.png",
  },
  {
    id: "ryanair",
    name: "Ryanair",
    code: "FR",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/FR.png",
  },
  {
    id: "easyjet",
    name: "easyJet",
    code: "U2",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/U2.png",
  },
  {
    id: "iberia",
    name: "Iberia",
    code: "IB",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/IB.png",
  },
  {
    id: "turkish",
    name: "Turkish Airlines",
    code: "TK",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/TK.png",
  },
  {
    id: "austrian",
    name: "Austrian Airlines",
    code: "OS",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/OS.png",
  },
  {
    id: "swiss",
    name: "SWISS",
    code: "LX",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/LX.png",
  },

  // 🌍 Middle East
  {
    id: "emirates",
    name: "Emirates",
    code: "EK",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/EK.png",
  },
  {
    id: "qatar",
    name: "Qatar Airways",
    code: "QR",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/QR.png",
  },
  {
    id: "etihad",
    name: "Etihad Airways",
    code: "EY",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/EY.png",
  },

  // 🌏 Asia
  {
    id: "singapore",
    name: "Singapore Airlines",
    code: "SQ",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/SQ.png",
  },
  {
    id: "cathay",
    name: "Cathay Pacific",
    code: "CX",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/CX.png",
  },
  {
    id: "jal",
    name: "Japan Airlines",
    code: "JL",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/JL.png",
  },
  {
    id: "ana",
    name: "All Nippon Airways",
    code: "NH",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/NH.png",
  },
  {
    id: "airchina",
    name: "Air China",
    code: "CA",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/CA.png",
  },
  {
    id: "chinaeastern",
    name: "China Eastern",
    code: "MU",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/MU.png",
  },
  {
    id: "indigo",
    name: "IndiGo",
    code: "6E",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/6E.png",
  },

  // 🌍 Africa
  {
    id: "ethiopian",
    name: "Ethiopian Airlines",
    code: "ET",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/ET.png",
  },
  {
    id: "egyptair",
    name: "EgyptAir",
    code: "MS",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/MS.png",
  },
  {
    id: "kenya",
    name: "Kenya Airways",
    code: "KQ",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/KQ.png",
  },

  // 🌏 Oceania
  {
    id: "qantas",
    name: "Qantas",
    code: "QF",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/QF.png",
  },
  {
    id: "airnz",
    name: "Air New Zealand",
    code: "NZ",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/NZ.png",
  },

  // 🌎 Latin America
  {
    id: "latam",
    name: "LATAM Airlines",
    code: "LA",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/LA.png",
  },
  {
    id: "avianca",
    name: "Avianca",
    code: "AV",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AV.png",
  },
  {
    id: "aeromexico",
    name: "Aeroméxico",
    code: "AM",
    logo: "https://content.r9cdn.net/rimg/provider-logos/airlines/v/AM.png",
  },
];

export const airlines = [
  { id: "united", name: "United Airlines" },
  { id: "delta", name: "Delta Air Lines" },
  { id: "american", name: "American Airlines" },
  { id: "british", name: "British Airways" },
  { id: "emirates", name: "Emirates" },
  { id: "lufthansa", name: "Lufthansa" },
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
): Promise<{
  results: Flight[];
  airlines: { name: string; id: string }[];
}> {
  const token = await getAccessToken();

  if (!token) {
    // Fallback to mock
    await new Promise((r) => setTimeout(r, 800)); // Slight delay for realism
    return {
      results: generateMockFlights(origin, destination, date),
      airlines,
    };
  }

  try {
    // Real Amadeus Call
    const dateStr = date.toISOString().split("T")[0];
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${dateStr}&adults=1&nonStop=false&max=20`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok)
      return {
        results: generateMockFlights(origin, destination, date),
        airlines,
      };
    const data = await res.json();
    return transformAmadeusData(data);
  } catch (err) {
    console.error("API Fetch Failed, using mock", err);
    return {
      results: generateMockFlights(origin, destination, date),
      airlines,
    };
  }
}

function transformAmadeusData(data): {
  results: Flight[];
  airlines: { name: string; id: string }[];
} {
  console.log(data);

  if (!data.data) return { results: [], airlines: [] };
  const airlinesObj = data.dictionaries.carriers;
  const airlineKeys = Object.keys(airlinesObj);

  return {
    airlines: airlineKeys.map((key) => ({ id: key, name: airlinesObj[key] })),

    results: data.data.map((offer) => {
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
        arrivalTime: lastSegment.arrival.at.split("T")[1].substring(0, 5),
        departureAirport: segment.departure.iataCode,
        arrivalAirport: lastSegment.arrival.iataCode,
        duration: duration,
        stops: itinerary.segments.length - 1,
        airline: airline.name,
        airlineId: airline.id,
        price: parseFloat(offer.price.total),
        logo: airline.logo,
      };
    }),
  };
}
