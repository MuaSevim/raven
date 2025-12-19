/**
 * LocationService - Location data service with real API integration
 * Fetches countries from restcountries.com
 * Fetches cities from countriesnow.space API
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
  lat?: number;
  lng?: number;
}

export interface Airport {
  code: string;
  name: string;
  city: string;
  countryCode: string;
  lat?: number;
  lng?: number;
}

// ============================================
// CACHE FOR API DATA
// ============================================
let cachedCountries: Country[] | null = null;
let isFetchingCountries = false;
let fetchPromise: Promise<Country[]> | null = null;

// Cache for cities by country name
const citiesCache: Map<string, City[]> = new Map();
const citiesFetchPromises: Map<string, Promise<City[]>> = new Map();

// ============================================
// FALLBACK MOCK DATA (used when API fails)
// ============================================
const FALLBACK_COUNTRIES: Country[] = [
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
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
];

const CITIES: City[] = [
  // United States
  { id: 'us-nyc', name: 'New York', countryCode: 'US', lat: 40.7128, lng: -74.006 },
  { id: 'us-lax', name: 'Los Angeles', countryCode: 'US', lat: 34.0522, lng: -118.2437 },
  { id: 'us-chi', name: 'Chicago', countryCode: 'US', lat: 41.8781, lng: -87.6298 },
  { id: 'us-mia', name: 'Miami', countryCode: 'US', lat: 25.7617, lng: -80.1918 },
  { id: 'us-sfo', name: 'San Francisco', countryCode: 'US', lat: 37.7749, lng: -122.4194 },
  { id: 'us-bos', name: 'Boston', countryCode: 'US', lat: 42.3601, lng: -71.0589 },
  { id: 'us-sea', name: 'Seattle', countryCode: 'US', lat: 47.6062, lng: -122.3321 },
  // United Kingdom
  { id: 'gb-lon', name: 'London', countryCode: 'GB', lat: 51.5074, lng: -0.1278 },
  { id: 'gb-man', name: 'Manchester', countryCode: 'GB', lat: 53.4808, lng: -2.2426 },
  { id: 'gb-bir', name: 'Birmingham', countryCode: 'GB', lat: 52.4862, lng: -1.8904 },
  { id: 'gb-edi', name: 'Edinburgh', countryCode: 'GB', lat: 55.9533, lng: -3.1883 },
  // Canada
  { id: 'ca-tor', name: 'Toronto', countryCode: 'CA', lat: 43.6532, lng: -79.3832 },
  { id: 'ca-van', name: 'Vancouver', countryCode: 'CA', lat: 49.2827, lng: -123.1207 },
  { id: 'ca-mtl', name: 'Montreal', countryCode: 'CA', lat: 45.5017, lng: -73.5673 },
  { id: 'ca-cal', name: 'Calgary', countryCode: 'CA', lat: 51.0447, lng: -114.0719 },
  // Australia
  { id: 'au-syd', name: 'Sydney', countryCode: 'AU', lat: -33.8688, lng: 151.2093 },
  { id: 'au-mel', name: 'Melbourne', countryCode: 'AU', lat: -37.8136, lng: 144.9631 },
  { id: 'au-bri', name: 'Brisbane', countryCode: 'AU', lat: -27.4698, lng: 153.0251 },
  // Germany
  { id: 'de-ber', name: 'Berlin', countryCode: 'DE', lat: 52.52, lng: 13.405 },
  { id: 'de-muc', name: 'Munich', countryCode: 'DE', lat: 48.1351, lng: 11.582 },
  { id: 'de-fra', name: 'Frankfurt', countryCode: 'DE', lat: 50.1109, lng: 8.6821 },
  { id: 'de-ham', name: 'Hamburg', countryCode: 'DE', lat: 53.5511, lng: 9.9937 },
  // France
  { id: 'fr-par', name: 'Paris', countryCode: 'FR', lat: 48.8566, lng: 2.3522 },
  { id: 'fr-nic', name: 'Nice', countryCode: 'FR', lat: 43.7102, lng: 7.262 },
  { id: 'fr-lyo', name: 'Lyon', countryCode: 'FR', lat: 45.764, lng: 4.8357 },
  // Spain
  { id: 'es-mad', name: 'Madrid', countryCode: 'ES', lat: 40.4168, lng: -3.7038 },
  { id: 'es-bcn', name: 'Barcelona', countryCode: 'ES', lat: 41.3851, lng: 2.1734 },
  // Italy
  { id: 'it-rom', name: 'Rome', countryCode: 'IT', lat: 41.9028, lng: 12.4964 },
  { id: 'it-mil', name: 'Milan', countryCode: 'IT', lat: 45.4642, lng: 9.19 },
  // Netherlands
  { id: 'nl-ams', name: 'Amsterdam', countryCode: 'NL', lat: 52.3676, lng: 4.9041 },
  // Sweden
  { id: 'se-sto', name: 'Stockholm', countryCode: 'SE', lat: 59.3293, lng: 18.0686 },
  // Turkey
  { id: 'tr-ist', name: 'Istanbul', countryCode: 'TR', lat: 41.0082, lng: 28.9784 },
  { id: 'tr-ank', name: 'Ankara', countryCode: 'TR', lat: 39.9334, lng: 32.8597 },
  { id: 'tr-izm', name: 'Izmir', countryCode: 'TR', lat: 38.4237, lng: 27.1428 },
  { id: 'tr-ant', name: 'Antalya', countryCode: 'TR', lat: 36.8969, lng: 30.7133 },
  { id: 'tr-bur', name: 'Bursa', countryCode: 'TR', lat: 40.1885, lng: 29.0610 },
  // Japan
  { id: 'jp-tky', name: 'Tokyo', countryCode: 'JP', lat: 35.6762, lng: 139.6503 },
  { id: 'jp-osk', name: 'Osaka', countryCode: 'JP', lat: 34.6937, lng: 135.5023 },
  // Singapore
  { id: 'sg-sin', name: 'Singapore', countryCode: 'SG', lat: 1.3521, lng: 103.8198 },
  // UAE
  { id: 'ae-dxb', name: 'Dubai', countryCode: 'AE', lat: 25.2048, lng: 55.2708 },
  { id: 'ae-auh', name: 'Abu Dhabi', countryCode: 'AE', lat: 24.4539, lng: 54.3773 },
  // Brazil
  { id: 'br-sao', name: 'São Paulo', countryCode: 'BR', lat: -23.5505, lng: -46.6333 },
  { id: 'br-rio', name: 'Rio de Janeiro', countryCode: 'BR', lat: -22.9068, lng: -43.1729 },
  // Mexico
  { id: 'mx-mex', name: 'Mexico City', countryCode: 'MX', lat: 19.4326, lng: -99.1332 },
  { id: 'mx-can', name: 'Cancún', countryCode: 'MX', lat: 21.1619, lng: -86.8515 },
  // India
  { id: 'in-del', name: 'New Delhi', countryCode: 'IN', lat: 28.6139, lng: 77.209 },
  { id: 'in-mum', name: 'Mumbai', countryCode: 'IN', lat: 19.076, lng: 72.8777 },
  { id: 'in-blr', name: 'Bangalore', countryCode: 'IN', lat: 12.9716, lng: 77.5946 },
  // Ireland
  { id: 'ie-dub', name: 'Dublin', countryCode: 'IE', lat: 53.3498, lng: -6.2603 },
  // Portugal
  { id: 'pt-lis', name: 'Lisbon', countryCode: 'PT', lat: 38.7223, lng: -9.1393 },
  // Greece
  { id: 'gr-ath', name: 'Athens', countryCode: 'GR', lat: 37.9838, lng: 23.7275 },
  // Poland
  { id: 'pl-war', name: 'Warsaw', countryCode: 'PL', lat: 52.2297, lng: 21.0122 },
];

const AIRPORTS: Airport[] = [
  // United States
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', countryCode: 'US', lat: 40.6413, lng: -73.7781 },
  { code: 'LGA', name: 'LaGuardia', city: 'New York', countryCode: 'US', lat: 40.7769, lng: -73.874 },
  { code: 'EWR', name: 'Newark Liberty International', city: 'Newark', countryCode: 'US', lat: 40.6895, lng: -74.1745 },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', countryCode: 'US', lat: 33.9425, lng: -118.408 },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', countryCode: 'US', lat: 41.9742, lng: -87.9073 },
  { code: 'MIA', name: 'Miami International', city: 'Miami', countryCode: 'US', lat: 25.7959, lng: -80.287 },
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco', countryCode: 'US', lat: 37.6213, lng: -122.379 },
  { code: 'BOS', name: 'Boston Logan International', city: 'Boston', countryCode: 'US', lat: 42.3656, lng: -71.0096 },
  { code: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', countryCode: 'US', lat: 47.4502, lng: -122.3088 },
  // United Kingdom
  { code: 'LHR', name: 'Heathrow', city: 'London', countryCode: 'GB', lat: 51.47, lng: -0.4543 },
  { code: 'LGW', name: 'Gatwick', city: 'London', countryCode: 'GB', lat: 51.1537, lng: -0.1821 },
  { code: 'STN', name: 'Stansted', city: 'London', countryCode: 'GB', lat: 51.885, lng: 0.235 },
  { code: 'MAN', name: 'Manchester', city: 'Manchester', countryCode: 'GB', lat: 53.3537, lng: -2.275 },
  { code: 'EDI', name: 'Edinburgh', city: 'Edinburgh', countryCode: 'GB', lat: 55.95, lng: -3.3725 },
  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International', city: 'Toronto', countryCode: 'CA', lat: 43.6777, lng: -79.6248 },
  { code: 'YVR', name: 'Vancouver International', city: 'Vancouver', countryCode: 'CA', lat: 49.1967, lng: -123.1815 },
  { code: 'YUL', name: 'Montréal-Trudeau International', city: 'Montreal', countryCode: 'CA', lat: 45.4706, lng: -73.7408 },
  // Australia
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', countryCode: 'AU', lat: -33.9399, lng: 151.1753 },
  { code: 'MEL', name: 'Melbourne Tullamarine', city: 'Melbourne', countryCode: 'AU', lat: -37.6733, lng: 144.8433 },
  // Germany
  { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt', countryCode: 'DE', lat: 50.0379, lng: 8.5622 },
  { code: 'MUC', name: 'Munich', city: 'Munich', countryCode: 'DE', lat: 48.3538, lng: 11.7861 },
  { code: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', countryCode: 'DE', lat: 52.3667, lng: 13.5033 },
  // France
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', countryCode: 'FR', lat: 49.0097, lng: 2.5479 },
  { code: 'ORY', name: 'Orly', city: 'Paris', countryCode: 'FR', lat: 48.7262, lng: 2.3652 },
  { code: 'NCE', name: "Nice Côte d'Azur", city: 'Nice', countryCode: 'FR', lat: 43.6584, lng: 7.2159 },
  // Spain
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas', city: 'Madrid', countryCode: 'ES', lat: 40.4983, lng: -3.5676 },
  { code: 'BCN', name: 'Barcelona–El Prat', city: 'Barcelona', countryCode: 'ES', lat: 41.2974, lng: 2.0833 },
  // Italy
  { code: 'FCO', name: 'Leonardo da Vinci–Fiumicino', city: 'Rome', countryCode: 'IT', lat: 41.8003, lng: 12.2389 },
  { code: 'MXP', name: 'Milan Malpensa', city: 'Milan', countryCode: 'IT', lat: 45.63, lng: 8.7231 },
  // Netherlands
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', countryCode: 'NL', lat: 52.3086, lng: 4.7639 },
  // Sweden
  { code: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', countryCode: 'SE', lat: 59.6519, lng: 17.9186 },
  // Turkey
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', countryCode: 'TR', lat: 41.2619, lng: 28.7419 },
  { code: 'SAW', name: 'Sabiha Gökçen International', city: 'Istanbul', countryCode: 'TR', lat: 40.8986, lng: 29.3092 },
  { code: 'ESB', name: 'Esenboğa International', city: 'Ankara', countryCode: 'TR', lat: 40.1281, lng: 32.9951 },
  { code: 'ADB', name: 'Adnan Menderes Airport', city: 'Izmir', countryCode: 'TR', lat: 38.2924, lng: 27.1570 },
  { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', countryCode: 'TR', lat: 36.8987, lng: 30.8005 },
  // Japan
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', countryCode: 'JP', lat: 35.7647, lng: 140.3864 },
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', countryCode: 'JP', lat: 35.5494, lng: 139.7798 },
  { code: 'KIX', name: 'Kansai International', city: 'Osaka', countryCode: 'JP', lat: 34.4347, lng: 135.244 },
  // Singapore
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', countryCode: 'SG', lat: 1.3644, lng: 103.9915 },
  // UAE
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', countryCode: 'AE', lat: 25.2528, lng: 55.3644 },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', countryCode: 'AE', lat: 24.433, lng: 54.6511 },
  // Brazil
  { code: 'GRU', name: 'São Paulo–Guarulhos', city: 'São Paulo', countryCode: 'BR', lat: -23.4356, lng: -46.4731 },
  { code: 'GIG', name: 'Rio de Janeiro–Galeão', city: 'Rio de Janeiro', countryCode: 'BR', lat: -22.81, lng: -43.2506 },
  // Mexico
  { code: 'MEX', name: 'Mexico City International', city: 'Mexico City', countryCode: 'MX', lat: 19.4363, lng: -99.0721 },
  { code: 'CUN', name: 'Cancún International', city: 'Cancún', countryCode: 'MX', lat: 21.0365, lng: -86.8771 },
  // India
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', countryCode: 'IN', lat: 28.5562, lng: 77.1 },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj', city: 'Mumbai', countryCode: 'IN', lat: 19.0896, lng: 72.8656 },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', countryCode: 'IN', lat: 13.1986, lng: 77.7066 },
  // Ireland
  { code: 'DUB', name: 'Dublin Airport', city: 'Dublin', countryCode: 'IE', lat: 53.4264, lng: -6.2499 },
  // Portugal
  { code: 'LIS', name: 'Lisbon Portela', city: 'Lisbon', countryCode: 'PT', lat: 38.7813, lng: -9.1359 },
  // Greece
  { code: 'ATH', name: 'Athens International', city: 'Athens', countryCode: 'GR', lat: 37.9364, lng: 23.9445 },
  // Poland
  { code: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', countryCode: 'PL', lat: 52.1657, lng: 20.9671 },
];

// ============================================
// SERVICE CLASS
// ============================================
class LocationServiceClass {
  /**
   * Fetch countries from REST Countries API with caching
   */
  async fetchCountriesFromAPI(): Promise<Country[]> {
    // Return cached data if available
    if (cachedCountries) {
      return cachedCountries;
    }

    // If already fetching, return the existing promise
    if (isFetchingCountries && fetchPromise) {
      return fetchPromise;
    }

    isFetchingCountries = true;

    fetchPromise = (async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,cca2,flag'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }

        const data = await response.json();

        const countries: Country[] = data
          .map((item: { name: { common: string }; cca2: string; flag: string }) => ({
            code: item.cca2,
            name: item.name.common,
            flag: item.flag,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        cachedCountries = countries;
        return countries;
      } catch (error) {
        console.warn('Failed to fetch countries from API, using fallback:', error);
        cachedCountries = FALLBACK_COUNTRIES;
        return FALLBACK_COUNTRIES;
      } finally {
        isFetchingCountries = false;
      }
    })();

    return fetchPromise;
  }

  /**
   * Get all countries (sync - returns cached or fallback)
   */
  getAllCountries(): Country[] {
    if (cachedCountries) {
      return cachedCountries;
    }
    // Trigger async fetch for next time
    this.fetchCountriesFromAPI();
    return FALLBACK_COUNTRIES;
  }

  /**
   * Search countries by name (async for real API data)
   */
  async searchCountriesAsync(query: string): Promise<Country[]> {
    const countries = await this.fetchCountriesFromAPI();
    if (!query.trim()) return countries;
    const lowerQuery = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.code.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Search countries by name (sync - uses cached/fallback)
   */
  searchCountries(query: string): Country[] {
    const countries = this.getAllCountries();
    if (!query.trim()) return countries;
    const lowerQuery = query.toLowerCase();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.code.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get country by code
   */
  getCountryByCode(code: string): Country | undefined {
    const countries = this.getAllCountries();
    return countries.find((c) => c.code === code);
  }

  /**
   * Fetch cities from countriesnow.space API for a given country
   */
  async fetchCitiesByCountryName(countryName: string, countryCode: string): Promise<City[]> {
    // Check cache first
    if (citiesCache.has(countryCode)) {
      return citiesCache.get(countryCode)!;
    }

    // Check if already fetching
    if (citiesFetchPromises.has(countryCode)) {
      return citiesFetchPromises.get(countryCode)!;
    }

    const promise = (async (): Promise<City[]> => {
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ country: countryName }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
          throw new Error('Invalid cities response');
        }

        const cities: City[] = data.data
          .slice(0, 200) // Limit to 200 cities for performance
          .map((cityName: string, index: number) => ({
            id: `${countryCode.toLowerCase()}-${index}`,
            name: cityName,
            countryCode: countryCode,
          }))
          .sort((a: City, b: City) => a.name.localeCompare(b.name));

        citiesCache.set(countryCode, cities);
        return cities;
      } catch (error) {
        console.warn(`Failed to fetch cities for ${countryName}:`, error);
        // Return fallback cities if available
        const fallback = CITIES.filter((c) => c.countryCode === countryCode);
        citiesCache.set(countryCode, fallback);
        return fallback;
      } finally {
        citiesFetchPromises.delete(countryCode);
      }
    })();

    citiesFetchPromises.set(countryCode, promise);
    return promise;
  }

  /**
   * Search cities by name, optionally filtered by country
   */
  searchCities(query: string, countryCode?: string): City[] {
    let results = countryCode 
      ? (citiesCache.get(countryCode) || CITIES.filter((c) => c.countryCode === countryCode))
      : CITIES;

    if (!query.trim()) return results;

    const lowerQuery = query.toLowerCase();
    return results.filter((c) => c.name.toLowerCase().includes(lowerQuery));
  }

  /**
   * Get cities by country code (sync - returns cached or fallback)
   * Use getCitiesByCountryAsync for API data
   */
  getCitiesByCountry(countryCode: string): City[] {
    // Return cached if available
    if (citiesCache.has(countryCode)) {
      return citiesCache.get(countryCode)!;
    }
    // Return static fallback
    return CITIES.filter((c) => c.countryCode === countryCode);
  }

  /**
   * Get cities by country code (async - fetches from API)
   */
  async getCitiesByCountryAsync(countryCode: string): Promise<City[]> {
    // Check cache first
    if (citiesCache.has(countryCode)) {
      return citiesCache.get(countryCode)!;
    }

    // Get country name for API call
    const country = this.getCountryByCode(countryCode);
    if (!country) {
      return CITIES.filter((c) => c.countryCode === countryCode);
    }

    return this.fetchCitiesByCountryName(country.name, countryCode);
  }

  /**
   * Get city by ID
   */
  getCityById(cityId: string): City | undefined {
    // Check all caches
    for (const cities of citiesCache.values()) {
      const found = cities.find((c) => c.id === cityId);
      if (found) return found;
    }
    return CITIES.find((c) => c.id === cityId);
  }

  /**
   * Search airports by name, code, or city
   */
  searchAirports(query: string, countryCode?: string): Airport[] {
    let results = AIRPORTS;

    if (countryCode) {
      results = results.filter((a) => a.countryCode === countryCode);
    }

    if (!query.trim()) return results;

    const lowerQuery = query.toLowerCase();
    return results.filter(
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
   * Get airports by country code
   */
  getAirportsByCountry(countryCode: string): Airport[] {
    return AIRPORTS.filter((a) => a.countryCode === countryCode);
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

  /**
   * Get coordinates for a city
   */
  getCityCoordinates(cityId: string): { lat: number; lng: number } | null {
    const city = CITIES.find((c) => c.id === cityId);
    if (city && city.lat && city.lng) {
      return { lat: city.lat, lng: city.lng };
    }
    return null;
  }

  /**
   * Clear cached countries (useful for testing/refresh)
   */
  clearCache(): void {
    cachedCountries = null;
    fetchPromise = null;
  }
}

// Export singleton instance
export const LocationService = new LocationServiceClass();
