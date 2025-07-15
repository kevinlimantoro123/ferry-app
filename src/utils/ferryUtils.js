import { FERRY_SCHEDULES } from "../data/ferryData";

// Generate ferry times based on route duration using actual ferry schedules
export const generateFerryTimes = (routeDuration) => {
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + (routeDuration * 1000 || 0));
  const arrivalTimeString = `${arrivalTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${arrivalTime.getMinutes().toString().padStart(2, "0")}`;

  // Use actual ferry schedules from Marina South Pier
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  // Get Kusu Island schedule from ferry data
  const kusuFerry = FERRY_SCHEDULES.MSP.find(
    (ferry) => ferry.destination === "Kusu Island"
  );
  const kusuSchedule = isWeekend ? kusuFerry.weekends : kusuFerry.weekdays;

  // Find next ferry times after arrival
  const availableFerriesAfterArrival = kusuSchedule.filter(
    (time) => time >= arrivalTimeString
  );

  // If no ferries today, use first 3 of next day
  const nextFerryTimes =
    availableFerriesAfterArrival.length >= 3
      ? availableFerriesAfterArrival.slice(0, 3)
      : [
          ...availableFerriesAfterArrival,
          ...kusuSchedule.slice(0, 3 - availableFerriesAfterArrival.length),
        ];

  return nextFerryTimes.length > 0
    ? nextFerryTimes
    : ["09:00", "10:00", "11:00"];
};

// Format route data for RouteCard
export const formatRouteData = (routeData, selectedTransport) => {
  if (!routeData || !routeData[selectedTransport]) {
    return null;
  }

  const route = routeData[selectedTransport];
  const ferryTimes = generateFerryTimes(route.durationValue);

  // Get all ferry schedules from ferry data
  const ferries = FERRY_SCHEDULES.MSP.map((ferry, index) => {
    const baseTime = ferryTimes[0] || "09:00"; // Use first ferry time as base
    const [hours, minutes] = baseTime.split(":");

    // Calculate offset for each destination (Kusu: 0, Lazarus: +15, St. John's: +30)
    const offsetMinutes = index * 15;

    const times = ferryTimes.map((time) => {
      const [timeHours, timeMinutes] = time.split(":");
      const newTime = new Date();
      newTime.setHours(
        parseInt(timeHours),
        parseInt(timeMinutes) + offsetMinutes
      );
      return newTime.toTimeString().substring(0, 5);
    });

    return {
      destination: ferry.destination,
      times: times,
    };
  });

  return {
    timeRange: `${new Date().toTimeString().substring(0, 5)} - ${new Date(
      Date.now() + route.durationValue * 1000
    )
      .toTimeString()
      .substring(0, 5)}`,
    duration: route.duration,
    distance: route.distance,
    ferry: {
      destination: "Kusu Island",
      times: ferryTimes,
    },
    ferries: ferries,
  };
};
