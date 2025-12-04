/**
 * LocationService - Mock location data service
 * Provides searchable lists of countries, cities, and airports
 */

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface City {
  id: string;
  name: string;
  countryCode: string;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  countryCode: string;
}

// ============================================
// MOCK DATA
// ============================================
const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
];

const CITIES: City[] = [
  // United States
  { id: 'us-nyc', name: 'New York', countryCode: 'US' },
  { id: 'us-lax', name: 'Los Angeles', countryCode: 'US' },
  { id: 'us-chi', name: 'Chicago', countryCode: 'US' },
  { id: 'us-mia', name: 'Miami', countryCode: 'US' },
  { id: 'us-sfo', name: 'San Francisco', countryCode: 'US' },
  { id: 'us-bos', name: 'Boston', countryCode: 'US' },
  { id: 'us-sea', name: 'Seattle', countryCode: 'US' },
  // United Kingdom
  { id: 'gb-lon', name: 'London', countryCode: 'GB' },
  { id: 'gb-man', name: 'Manchester', countryCode: 'GB' },
  { id: 'gb-bir', name: 'Birmingham', countryCode: 'GB' },
  { id: 'gb-edi', name: 'Edinburgh', countryCode: 'GB' },
  // Canada
  { id: 'ca-tor', name: 'Toronto', countryCode: 'CA' },
  { id: 'ca-van', name: 'Vancouver', countryCode: 'CA' },
  { id: 'ca-mtl', name: 'Montreal', countryCode: 'CA' },
  { id: 'ca-cal', name: 'Calgary', countryCode: 'CA' },
  // Australia
  { id: 'au-syd', name: 'Sydney', countryCode: 'AU' },
  { id: 'au-mel', name: 'Melbourne', countryCode: 'AU' },
  { id: 'au-bri', name: 'Brisbane', countryCode: 'AU' },
  // Germany
  { id: 'de-ber', name: 'Berlin', countryCode: 'DE' },
  { id: 'de-muc', name: 'Munich', countryCode: 'DE' },
  { id: 'de-fra', name: 'Frankfurt', countryCode: 'DE' },
  { id: 'de-ham', name: 'Hamburg', countryCode: 'DE' },
  // France
  { id: 'fr-par', name: 'Paris', countryCode: 'FR' },
  { id: 'fr-nic', name: 'Nice', countryCode: 'FR' },
  { id: 'fr-lyo', name: 'Lyon', countryCode: 'FR' },
  // Spain
  { id: 'es-mad', name: 'Madrid', countryCode: 'ES' },
  { id: 'es-bcn', name: 'Barcelona', countryCode: 'ES' },
  // Italy
  { id: 'it-rom', name: 'Rome', countryCode: 'IT' },
  { id: 'it-mil', name: 'Milan', countryCode: 'IT' },
  // Netherlands
  { id: 'nl-ams', name: 'Amsterdam', countryCode: 'NL' },
  // Sweden
  { id: 'se-sto', name: 'Stockholm', countryCode: 'SE' },
  // Japan
  { id: 'jp-tky', name: 'Tokyo', countryCode: 'JP' },
  { id: 'jp-osk', name: 'Osaka', countryCode: 'JP' },
  // Singapore
  { id: 'sg-sin', name: 'Singapore', countryCode: 'SG' },
  // UAE
  { id: 'ae-dxb', name: 'Dubai', countryCode: 'AE' },
  { id: 'ae-auh', name: 'Abu Dhabi', countryCode: 'AE' },
  // Brazil
  { id: 'br-sao', name: 'São Paulo', countryCode: 'BR' },
  { id: 'br-rio', name: 'Rio de Janeiro', countryCode: 'BR' },
  // Mexico
  { id: 'mx-mex', name: 'Mexico City', countryCode: 'MX' },
  { id: 'mx-can', name: 'Cancún', countryCode: 'MX' },
  // India
  { id: 'in-del', name: 'New Delhi', countryCode: 'IN' },
  { id: 'in-mum', name: 'Mumbai', countryCode: 'IN' },
  { id: 'in-blr', name: 'Bangalore', countryCode: 'IN' },
];

const AIRPORTS: Airport[] = [
  // United States
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', countryCode: 'US' },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', countryCode: 'US' },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', countryCode: 'US' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', countryCode: 'US' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', countryCode: 'US' },
  { code: 'MIA', name: 'Miami International', city: 'Miami', countryCode: 'US' },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', countryCode: 'US' },
  { code: 'BOS', name: 'Boston Logan International', city: 'Boston', countryCode: 'US' },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', countryCode: 'US' },
  // United Kingdom
  { code: 'LHR', name: 'Heathrow', city: 'London', countryCode: 'GB' },
  { code: 'LGW', name: 'Gatwick', city: 'London', countryCode: 'GB' },
  { code: 'STN', name: 'Stansted', city: 'London', countryCode: 'GB' },
  { code: 'MAN', name: 'Manchester', city: 'Manchester', countryCode: 'GB' },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh', countryCode: 'GB' },
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', countryCode: 'CA' },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', countryCode: 'CA' },
  { code: 'YUL', name: 'Montréal-Trudeau International', city: 'Montreal', countryCode: 'CA' },
  // Australia
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', countryCode: 'AU' },
  { code: 'MEL', name: 'Melbourne Tullamarine', city: 'Melbourne', countryCode: 'AU' },
  // Germany
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', countryCode: 'DE' },
  { code: 'MUC', name: 'Munich', city: 'Munich', countryCode: 'DE' },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', countryCode: 'DE' },
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', countryCode: 'FR' },
  { code: 'ORY', name: 'Orly', city: 'Paris', countryCode: 'FR' },
  { code: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', countryCode: 'FR' },
  // Spain
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', countryCode: 'ES' },
  { code: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', countryCode: 'ES' },
  // Italy
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', countryCode: 'IT' },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', countryCode: 'IT' },
  // Netherlands
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', countryCode: 'NL' },
  // Sweden
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', countryCode: 'SE' },
  // Japan
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', countryCode: 'JP' },
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', countryCode: 'JP' },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', countryCode: 'JP' },
  // Singapore
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', countryCode: 'SG' },
  // UAE
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', countryCode: 'AE' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', countryCode: 'AE' },
  // Brazil
  { code: 'GRU', name: 'São Paulo–Guarulhos', city: 'São Paulo', countryCode: 'BR' },
  { code: 'GIG', name: 'Rio de Janeiro–Galeão', city: 'Rio de Janeiro', countryCode: 'BR' },
  // Mexico
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', countryCode: 'MX' },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún', countryCode: 'MX' },
  // India
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', countryCode: 'IN' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', countryCode: 'IN' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', countryCode: 'IN' },
];

// ============================================
// SERVICE CLASS
// ============================================
class LocationServiceClass {
  /**
   * Search countries by name
   */
  searchCountries(query: string): Country[] {
    if (!query.trim()) return COUNTRIES;
    const lowerQuery = query.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.code.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all countries
   */
  getAllCountries(): Country[] {
    return COUNTRIES;
  }

  /**
   * Get country by code
   */
  getCountryByCode(code: string): Country | undefined {
    return COUNTRIES.find((c) => c.code === code);
  }

  /**
   * Search cities by name, optionally filtered by country
   */
  searchCities(query: string, countryCode?: string): City[] {
    let results = CITIES;
    
    if (countryCode) {
      results = results.filter((c) => c.countryCode === countryCode);
    }
    
    if (!query.trim()) return results;
    
    const lowerQuery = query.toLowerCase();
    return results.filter((c) => c.name.toLowerCase().includes(lowerQuery));
  }

  /**
   * Get cities by country code
   */
  getCitiesByCountry(countryCode: string): City[] {
    return CITIES.filter((c) => c.countryCode === countryCode);
  }

  /**
   * Search airports by name, code, or city
   */
  searchAirports(query: string): Airport[] {
    if (!query.trim()) return AIRPORTS;
    const lowerQuery = query.toLowerCase();
    return AIRPORTS.filter(
      (a) =>
        a.name.toLowerCase().includes(lowerQuery) ||
        a.code.toLowerCase().includes(lowerQuery) ||
        a.city.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get all airports
   */
  getAllAirports(): Airport[] {
    return AIRPORTS;
  }

  /**
   * Get airport by code
   */
  getAirportByCode(code: string): Airport | undefined {
    return AIRPORTS.find((a) => a.code === code);
  }

  /**
   * Format country for display
   */
  formatCountry(country: Country): string {
    return `${country.flag} ${country.name}`;
  }

  /**
   * Format airport for display
   */
  formatAirport(airport: Airport): string {
    return `${airport.code} - ${airport.name}`;
  }
}

// Export singleton instance
export const LocationService = new LocationServiceClass();
