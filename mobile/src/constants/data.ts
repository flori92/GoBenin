export const IMAGES = {
  ouidah: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQJaUxXBfB8_K2p3b9JKsghTHgz0RCaBLXCHkMaZSp2hMZ5mJNNYxzZ9RQF1BVLw4KlhVVvfWnSLGiM_gNbhFtLpC68g',
  ganvie: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9TYvKQOQNPH2EAM6BePg1yKEMsG-j3uS0-WvcZN7SnqNVVp-RZ2kK4A8VWmYgjFvW7N0k1J8wRx9wbCRAf6U4P2OYqg',
  pendjari: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnm9C7fvGUZWMYMTlvGf0a1S7v_LO_zShfBg8mHE0HmwZBrqjbSwQD-Rrz0P8d-Km7dSyxhzEP7HVYgHBJOBF8AQa7',
  abomey: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQke-cVK4n7MweCUtc2Z-El6XyaDWC2a_IF4QEauQskyIFQqjUZSxbPvDM06OcSBZDn5sMpPQHtDKe3omv1dVAIT6xtJXsfhzS1yufoQbACkm5Q4SHadi_PVa69QFZ3F0FhKj6rZq7AzRFOIb4Fh4ZjWF330r9UF_ZF3unmn5PIRmH0geXIAUhAri56sq_KXSeJtLH7GNHxEYvoyNNN9TxBUKCmd18d57jcV1YGXqwb9UJpZvtmry-T6Am6Wd3LydaheW4csUvNk',
  vodun: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQEke-cVK4n7MweCUtc2Z-El6XyaDWC2a_IF4QEauQskyIFQqjUZSxbPvDM06OcSBZDn5sMpPQHtDKe3omv1dVAIT6xtJXsfhzS1yufoQbACkm5Q4SHadi_PVa69QFZ3F0FhKj6rZq7AzRFOIb4Fh4ZjWF330r9UF_ZF3unmn5PIRmH0geXIAUhAri56sq_KXSeJtLH7GNHxEYvoyNNN9TxBUKCmd18d57jcV1YGXqwb9UJpZvtmry-T6Am6Wd3LydaheW4csUvNk',
  porto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5ZfI6dJ4qkPJVIGc3JqG7mGq_HQDsjZwJGkQ8wMT9hYC9cVOjKQKgGJqJXY4cQRQJQXJZKQJZKQJZKQ',
  babsDock: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_p_F_1cY8bY9vXz_1cY8bY9vXz_1cY8bY9vXz',
};

export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  latitude?: number;
  longitude?: number;
}

export interface Tour {
  id: string;
  name: string;
  location: string;
  rating: number;
  duration: string;
  distance: string;
  stops: number;
  price: number;
  image: string;
  tags: string[];
  description: string;
  stopNames: string[];
}

export const getFeaturedDestinations = (): Destination[] => [
  {
    id: 'ouidah',
    name: 'Ouidah',
    subtitle: 'Coastal City',
    description: 'Explore the historical Route des Esclaves and the Door of No Return.',
    rating: 4.8,
    reviews: 256,
    image: IMAGES.ouidah,
    category: 'History',
    latitude: 6.3667,
    longitude: 2.0833,
  },
  {
    id: 'ganvie',
    name: 'Ganvié',
    subtitle: 'Lake Nokoué',
    description: 'Visit the Venice of Africa, a unique stilt village on the lake.',
    rating: 4.7,
    reviews: 189,
    image: IMAGES.ganvie,
    category: 'Culture',
    latitude: 6.4667,
    longitude: 2.4167,
  },
  {
    id: 'pendjari',
    name: 'Parc Pendjari',
    subtitle: 'Northern Benin',
    description: 'Safari adventure in one of West Africa\'s best wildlife reserves.',
    rating: 4.9,
    reviews: 312,
    image: IMAGES.pendjari,
    category: 'Nature',
    latitude: 11.1833,
    longitude: 1.4833,
  },
  {
    id: 'abomey',
    name: 'Palais Royaux d\'Abomey',
    subtitle: 'Abomey',
    description: 'UNESCO World Heritage site of the ancient Dahomey Kingdom.',
    rating: 4.6,
    reviews: 178,
    image: IMAGES.abomey,
    category: 'History',
    latitude: 7.1833,
    longitude: 1.9833,
  },
  {
    id: 'babs-dock',
    name: "Bab's Dock",
    subtitle: 'Togbin',
    description: 'A scenic lagoon-side stop where the setting and wildlife make for a memorable visit.',
    rating: 4.3,
    reviews: 94,
    image: IMAGES.babsDock,
    category: 'Relaxation',
    latitude: 6.3517,
    longitude: 2.3283,
  },
];

export const getTours = (): Tour[] => [
  {
    id: 'ouidah-heritage',
    name: 'Ouidah Heritage Tour',
    location: 'Ouidah, Benin',
    rating: 4.8,
    duration: 'Half Day',
    distance: 'Group Tour',
    stops: 5,
    price: 45,
    image: IMAGES.ouidah,
    tags: ['History', 'Culture'],
    description: 'Discover the historical significance of Ouidah through the Route of Slaves.',
    stopNames: ['Door of No Return', 'Python Temple', 'Sacred Forest'],
  },
  {
    id: 'ganvie-exploration',
    name: 'Ganvié Lake Village',
    location: 'Cotonou, Benin',
    rating: 4.7,
    duration: 'Full Day',
    distance: 'Private Tour',
    stops: 4,
    price: 65,
    image: IMAGES.ganvie,
    tags: ['Culture', 'Nature'],
    description: 'Experience life on the water in the Venice of Africa.',
    stopNames: ['Lake Nokoué', 'Stilt Houses', 'Local Market'],
  },
  {
    id: 'pendjari-safari',
    name: 'Pendjari Safari Adventure',
    location: 'Northern Benin',
    rating: 4.9,
    duration: '2 Days',
    distance: 'Small Group',
    stops: 8,
    price: 180,
    image: IMAGES.pendjari,
    tags: ['Nature', 'Adventure'],
    description: 'Wildlife safari in one of West Africa\'s best preserved national parks.',
    stopNames: ['Safari Drive', 'Waterfalls', 'Wildlife Viewing'],
  },
  {
    id: 'vodun-trail',
    name: 'Vodun Culture Trail',
    location: 'Allada, Benin',
    rating: 4.8,
    duration: 'Full Day',
    distance: 'Small Group',
    stops: 6,
    price: 60,
    image: IMAGES.vodun,
    tags: ['Cultural'],
    description: 'Experience the Temple of Pythons and witness authentic Egungun masquerades.',
    stopNames: ['Temple of Pythons', 'Sacred Forest'],
  },
  {
    id: 'royal-palaces',
    name: 'Royal Palaces of Abomey',
    location: 'Abomey, Benin',
    rating: 4.6,
    duration: 'Half Day',
    distance: 'Group Tour',
    stops: 3,
    price: 40,
    image: IMAGES.abomey,
    tags: ['History'],
    description: 'Visit the UNESCO World Heritage royal palaces of the Dahomey Kingdom.',
    stopNames: ['Royal Palace', 'History Museum', 'Craft Market'],
  },
];
