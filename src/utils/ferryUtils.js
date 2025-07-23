import { FERRY_SCHEDULES } from "../data/ferryData";

// Generate ferry times based on route duration using actual ferry schedules
export const generateFerryTimes = (routeDuration) => {
  const now = new Date();
  const arrivalTime = new Date(now.getTime() + (routeDuration * 1000 || 0));
  const arrivalTimeString = `${arrivalTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${arrivalTime.getMinutes().toString().padStart(2, "0")}`;

  // Get Sisters Island schedule from ferry data
  const sistersState = FERRY_SCHEDULES.MSP.find(
    (ferry) => ferry.destination === "Sisters Island"
  );
  const sistersSchedule = sistersState.directSchedule;

  // Find next ferry times after arrival
  const availableFerriesAfterArrival = sistersSchedule.filter(
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
    ? sistersSchedule.slice(0, nextDayTimesCount)
    : [];

  // Combine times with next day indicators
  const allTimes = [...todayTimes, ...nextDayTimes.map((time) => `${time} +1`)];
  return allTimes.length > 0 ? allTimes : ["09:30", "11:00", "13:00"];
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
    // Get the direct schedule
    const directSchedule = ferry.directSchedule;
    const indirectSchedule = ferry.indirectSchedule;

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

    // Find next ferry times after arrival for direct routes
    const availableDirectTimes = directSchedule.filter(
      (time) => time >= arrivalTimeString
    );

    // Check if we need to show next day times for direct routes
    const needsNextDayTimes = availableDirectTimes.length < 3;
    const nextDayTimesCount = Math.max(0, 3 - availableDirectTimes.length);

    // Get next 3 direct ferry times
    const todayDirectTimes = availableDirectTimes.slice(0, 3);
    const nextDayDirectTimes = needsNextDayTimes
      ? directSchedule.slice(0, nextDayTimesCount)
      : [];

    // Combine direct times with next day indicators
    const allDirectTimes = [
      ...todayDirectTimes,
      ...nextDayDirectTimes.map((time) => `${time} +1`),
    ];

    const directFerryTimes =
      allDirectTimes.length > 0 ? allDirectTimes : ["09:00", "10:00", "11:00"];

    // Process indirect routes
    const availableIndirectTimes = indirectSchedule.filter(
      (route) => route.departure >= arrivalTimeString
    );

    const indirectFerryTimes =
      availableIndirectTimes.length > 0
        ? availableIndirectTimes
        : indirectSchedule.slice(0, 3);

    console.log(`${ferry.destination} direct ferry times:`, directFerryTimes);
    console.log(
      `${ferry.destination} indirect ferry times:`,
      indirectFerryTimes
    );

    return {
      destination: ferry.destination,
      directTimes: directFerryTimes,
      indirectTimes: indirectFerryTimes,
      hasIndirect: indirectSchedule.length > 0,
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
      destination: "Sisters Island",
      times: ferryTimes,
    },
    ferries: ferries,
  };
};
