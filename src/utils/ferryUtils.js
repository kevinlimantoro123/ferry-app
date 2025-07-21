import { FERRY_SCHEDULES } from "../data/ferryData";

// Generate ferry times based on route duration using actual ferry schedules
export const generateFerryTimes = (routeDuration) => {
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + (routeDuration * 1000 || 0));
  const arrivalTimeString = `${arrivalTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${arrivalTime.getMinutes().toString().padStart(2, "0")}`;

  // Get Kusu Island schedule from ferry data
  const kusuFerry = FERRY_SCHEDULES.MSP.find(
    (ferry) => ferry.destination === "Kusu Island"
  );
  const kusuSchedule = kusuFerry.schedule;

  // Find next ferry times after arrival
  const availableFerriesAfterArrival = kusuSchedule.filter(
    (time) => time >= arrivalTimeString
  );

  // Check if we need next day times
  const needsNextDayTimes = availableFerriesAfterArrival.length < 3;
  const nextDayTimesCount = Math.max(
    0,
    3 - availableFerriesAfterArrival.length
  );

  // Get today's times and next day times if needed
  const todayTimes = availableFerriesAfterArrival.slice(0, 3);
  const nextDayTimes = needsNextDayTimes
    ? kusuSchedule.slice(0, nextDayTimesCount)
    : [];

  // Combine times with next day indicators
  const allTimes = [...todayTimes, ...nextDayTimes.map((time) => `${time} +1`)];
  return allTimes.length > 0 ? allTimes : ["09:00", "10:00", "11:00"];
};

// Format route data for RouteCard
export const formatRouteData = (routeData, selectedTransport) => {
  if (!routeData || !routeData[selectedTransport]) {
    return null;
  }

  const route = routeData[selectedTransport];
  const ferryTimes = generateFerryTimes(route.durationValue);
  const now = new Date();

  // Get all ferry schedules from ferry data
  const ferries = FERRY_SCHEDULES.MSP.map((ferry, index) => {
    // Get the schedule
    const schedule = ferry.schedule;

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

    // Check if we need to show next day times
    const needsNextDayTimes = availableFerriesAfterArrival.length < 3;
    const nextDayTimesCount = Math.max(
      0,
      3 - availableFerriesAfterArrival.length
    );

    // Get next 3 ferry times, or first 3 if none available today
    const todayTimes = availableFerriesAfterArrival.slice(0, 3);
    const nextDayTimes = needsNextDayTimes
      ? schedule.slice(0, nextDayTimesCount)
      : [];

    // Combine times with next day indicators
    const allTimes = [
      ...todayTimes,
      ...nextDayTimes.map((time) => `${time} +1`),
    ];

    const nextFerryTimes =
      allTimes.length > 0 ? allTimes : ["09:00", "10:00", "11:00"];

    console.log(`${ferry.destination} next ferry times:`, nextFerryTimes);

    return {
      destination: ferry.destination,
      times: nextFerryTimes,
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
