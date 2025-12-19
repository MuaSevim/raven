/**
 * useCityOptions - Custom hook for dynamic city loading
 * Eliminates duplicate city fetching logic across SignUpScreen, PostTripScreen
 */
import { useState, useEffect, useCallback } from 'react';
import { LocationService } from '../services/LocationService';
import { SelectOption } from '../components/SearchableSelect';

export interface UseCityOptionsReturn {
  /** City options for SearchableSelect */
  cityOptions: SelectOption[];
  /** Whether cities are currently loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Manually refresh cities */
  refresh: () => void;
}

/**
 * Custom hook for fetching cities based on country selection
 * Uses LocationService.getCitiesByCountryAsync with caching
 *
 * @example
 * const { cityOptions, isLoading, error } = useCityOptions(
 *   formData.countryCode,
 *   formData.countryName
 * );
 *
 * <SearchableSelect
 *   placeholder={isLoading ? "Loading cities..." : "Select your city"}
 *   options={cityOptions}
 *   disabled={!formData.countryCode || isLoading}
 * />
 */
export function useCityOptions(
  countryCode: string | undefined,
  countryName?: string
): UseCityOptionsReturn {
  const [cityOptions, setCityOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    // Clear if no country selected
    if (!countryCode) {
      setCityOptions([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cities = await LocationService.getCitiesByCountryAsync(countryCode);
      setCityOptions(
        cities.map((c) => ({
          id: c.id,
          label: c.name,
        }))
      );
    } catch (err) {
      console.error('Failed to load cities:', err);
      setError('Failed to load cities. Please try again.');
      setCityOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [countryCode]);

  // Fetch cities when country changes
  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return {
    cityOptions,
    isLoading,
    error,
    refresh: fetchCities,
  };
}

/**
 * Hook for managing multiple city selectors (e.g., departure and arrival)
 * Provides separate loading states for each
 *
 * @example
 * const departure = useCityOptions(formData.departureCountryCode);
 * const arrival = useCityOptions(formData.arrivalCountryCode);
 */
export function useDualCityOptions(
  departureCountryCode: string | undefined,
  arrivalCountryCode: string | undefined
) {
  const departure = useCityOptions(departureCountryCode);
  const arrival = useCityOptions(arrivalCountryCode);

  return {
    departure,
    arrival,
  };
}
