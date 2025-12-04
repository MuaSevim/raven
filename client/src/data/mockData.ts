/**
 * ============================================
 * RAVEN MOCK DATA
 * ============================================
 * Realistic mock data for development and testing.
 * This simulates API responses before backend integration.
 */

// ============================================
// SHIPMENT INTERFACES
// ============================================
export interface ShipmentRoute {
  origin: string;
  destination: string;
  originCode: string;
  destinationCode: string;
}

export interface ShipmentItem {
  title: string;
  weight: string;
  image: any;
}

export interface ShipmentSender {
  name: string;
  rating: number;
  avatar: string; // URL or initials fallback
}

export interface Shipment {
  id: string;
  route: ShipmentRoute;
  date: string;
  dateRange: string;
  price: number;
  item: ShipmentItem;
  sender: ShipmentSender;
}

// ============================================
// MOCK SHIPMENTS DATA
// ============================================
export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: '1',
    route: {
      origin: 'New York',
      destination: 'London',
      originCode: 'NYC',
      destinationCode: 'LHR',
    },
    date: 'Fri, Oct 26',
    dateRange: 'Oct 26 - Nov 10',
    price: 50,
    item: {
      title: 'Package Delivery',
      weight: '2.5 kg',
      image: null, // Will use placeholder
    },
    sender: {
      name: 'Sarah Mitchell',
      rating: 4.8,
      avatar: 'SM',
    },
  },
  {
    id: '2',
    route: {
      origin: 'Los Angeles',
      destination: 'Tokyo',
      originCode: 'LAX',
      destinationCode: 'TYO',
    },
    date: 'Mon, Nov 5',
    dateRange: 'Nov 5 - Nov 20',
    price: 75,
    item: {
      title: 'Package Delivery',
      weight: '1.8 kg',
      image: null,
    },
    sender: {
      name: 'James Chen',
      rating: 4.9,
      avatar: 'JC',
    },
  },
  {
    id: '3',
    route: {
      origin: 'Paris',
      destination: 'Berlin',
      originCode: 'CDG',
      destinationCode: 'BER',
    },
    date: 'Sun, Dec 1',
    dateRange: 'Dec 1 - Dec 15',
    price: 30,
    item: {
      title: 'Package Delivery',
      weight: '0.5 kg',
      image: null,
    },
    sender: {
      name: 'Marie Dubois',
      rating: 5.0,
      avatar: 'MD',
    },
  },
  {
    id: '4',
    route: {
      origin: 'Sydney',
      destination: 'Melbourne',
      originCode: 'SYD',
      destinationCode: 'MEL',
    },
    date: 'Fri, Jan 10',
    dateRange: 'Jan 10 - Jan 25',
    price: 40,
    item: {
      title: 'Package Delivery',
      weight: '3.2 kg',
      image: null,
    },
    sender: {
      name: 'Oliver Smith',
      rating: 4.7,
      avatar: 'OS',
    },
  },
  {
    id: '5',
    route: {
      origin: 'Toronto',
      destination: 'Vancouver',
      originCode: 'YYZ',
      destinationCode: 'YVR',
    },
    date: 'Wed, Feb 5',
    dateRange: 'Feb 5 - Feb 20',
    price: 60,
    item: {
      title: 'Package Delivery',
      weight: '1.5 kg',
      image: null,
    },
    sender: {
      name: 'Emma Wilson',
      rating: 4.6,
      avatar: 'EW',
    },
  },
];

// ============================================
// FILTER OPTIONS
// ============================================
export const FILTER_OPTIONS = {
  locations: ['All', 'New York', 'London', 'Paris', 'Tokyo', 'Sydney'],
  dates: ['Any Date', 'This Week', 'This Month', 'Next Month'],
  priceRanges: ['Any Price', '$0-$50', '$50-$100', '$100+'],
} as const;
