import { FERRY_SCHEDULES } from "../data/ferryData";

// Generate ferry times based on route duration using actual ferry schedules
export const generateFerryTimes = (routeDuration) => {
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + (routeDuration * 1000 || 0));
  const arrivalTimeString = `${arrivalTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${arrivalTime.getMinutes().toString().padStart(2, "0")}`;

  // Use ferry schedules from Marina South Pier
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
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  console.log("Current day:", now.getDay(), "Is weekend:", isWeekend);

  // Get all ferry schedules from ferry data with correct weekday/weekend logic
  const ferries = FERRY_SCHEDULES.MSP.map((ferry, index) => {
    // Get the correct schedule based on current day
    const schedule = isWeekend ? ferry.weekends : ferry.weekdays;

    console.log(
      `${ferry.destination} schedule (${isWeekend ? "weekend" : "weekday"}):`,
      schedule
    );

    // Get the arrival time string for filtering
    const arrivalTime = new Date(
      now.getTime() + (route.durationValue * 1000 || 0)
    );
    const arrivalTimeString = `${arrivalTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${arrivalTime
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Find next ferry times after arrival for this specific destination
    const availableFerriesAfterArrival = schedule.filter(
      (time) => time >= arrivalTimeString
    );

    // Get next 3 ferry times, or first 3 if none available today
    const nextFerryTimes =
      availableFerriesAfterArrival.length >= 3
        ? availableFerriesAfterArrival.slice(0, 3)
        : [
            ...availableFerriesAfterArrival,
            ...schedule.slice(
              0,
              Math.max(0, 3 - availableFerriesAfterArrival.length)
            ),
          ];

    console.log(`${ferry.destination} next ferry times:`, nextFerryTimes);

    return {
      destination: ferry.destination,
      times:
        nextFerryTimes.length > 0
          ? nextFerryTimes
          : ["09:00", "10:00", "11:00"],
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
