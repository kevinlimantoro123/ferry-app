// data/ferryData.js
export const MARINA_SOUTH_PIER = {
  name: "Marina South Pier",
  coordinates: { lat: 1.2644, lng: 103.8203 },
  address: "31 Marina Coastal Drive, Singapore 018988",
};

export const FERRY_DESTINATIONS = [
  {
    id: "kusu",
    name: "Kusu Island",
    coordinates: { lat: 1.2267, lng: 103.8593 },
    travelTime: "15 minutes",
    schedule: {
      weekdays: [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ],
      weekends: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
    },
  },
  {
    id: "lazarus",
    name: "Lazarus Island",
    coordinates: { lat: 1.2267, lng: 103.8593 },
    travelTime: "20 minutes",
    schedule: {
      weekdays: [
        "09:15",
        "10:15",
        "11:15",
        "12:15",
        "13:15",
        "14:15",
        "15:15",
        "16:15",
      ],
      weekends: [
        "09:15",
        "09:45",
        "10:15",
        "10:45",
        "11:15",
        "11:45",
        "12:15",
        "12:45",
        "13:15",
        "13:45",
        "14:15",
        "14:45",
        "15:15",
        "15:45",
        "16:15",
        "16:45",
      ],
    },
  },
  {
    id: "st-john",
    name: "St. John's Island",
    coordinates: { lat: 1.2194, lng: 103.8489 },
    travelTime: "25 minutes",
    schedule: {
      weekdays: [
        "09:30",
        "10:30",
        "11:30",
        "12:30",
        "13:30",
        "14:30",
        "15:30",
        "16:30",
      ],
      weekends: [
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
      ],
    },
  },
];

export const SINGAPORE_LOCATIONS = [
  "Orchard Road",
  "Marina Bay Sands",
  "Changi Airport",
  "Raffles Place",
  "Sentosa Island",
  "Jurong East",
  "Woodlands",
  "Tampines",
  "Bishan",
  "Ang Mo Kio",
  "Toa Payoh",
  "Clementi",
  "Bukit Batok",
  "Yishun",
  "Bedok",
  "Hougang",
  "Sengkang",
  "Punggol",
  "Pasir Ris",
  "Bukit Merah",
  "Novena",
  "Somerset",
  "Dhoby Ghaut",
  "City Hall",
  "Bugis",
  "Chinatown",
  "Little India",
  "Kampong Glam",
  "Clarke Quay",
  "Boat Quay",
  "Marina South Pier",
];

// Legacy export for backward compatibility
export const LOCATIONS = SINGAPORE_LOCATIONS;

// Ferry schedules organized by tabs for the ferry timings page
export const FERRY_SCHEDULES = {
  MSP: [
    {
      destination: "Kusu Island",
      weekdays: [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ],
      weekends: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      travelTime: "15 minutes",
    },
    {
      destination: "Lazarus Island",
      weekdays: [
        "09:15",
        "10:15",
        "11:15",
        "12:15",
        "13:15",
        "14:15",
        "15:15",
        "16:15",
      ],
      weekends: [
        "09:15",
        "09:45",
        "10:15",
        "10:45",
        "11:15",
        "11:45",
        "12:15",
        "12:45",
        "13:15",
        "13:45",
        "14:15",
        "14:45",
        "15:15",
        "15:45",
        "16:15",
        "16:45",
      ],
      travelTime: "20 minutes",
    },
    {
      destination: "St. John's Island",
      weekdays: [
        "09:30",
        "10:30",
        "11:30",
        "12:30",
        "13:30",
        "14:30",
        "15:30",
        "16:30",
      ],
      weekends: [
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
      ],
      travelTime: "25 minutes",
    },
  ],
};

export const getNextFerryTimes = (destination, currentTime = new Date()) => {
  const ferry = FERRY_DESTINATIONS.find((f) => f.id === destination);
  if (!ferry) return [];

  const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6;
  const schedule = isWeekend
    ? ferry.schedule.weekends
    : ferry.schedule.weekdays;

  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeString = `${currentHour
    .toString()
    .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

  // Find next 3 ferry times
  const nextTimes = schedule
    .filter((time) => time >= currentTimeString)
    .slice(0, 3);

  // If less than 3 times found, add times from next day
  if (nextTimes.length < 3) {
    const remainingTimes = schedule.slice(0, 3 - nextTimes.length);
    nextTimes.push(...remainingTimes);
  }

  return nextTimes;
};

export const calculateArrivalTime = (departureTime, routeDuration) => {
  const [hours, minutes] = departureTime.split(":");
  const departure = new Date();
  departure.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  const arrival = new Date(departure.getTime() + routeDuration * 1000);
  return arrival.toTimeString().substring(0, 5);
};
