export interface Flight {
  id: string;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  airline: string;
  airlineId: string;
  price: number;
  logo?: string;
}
