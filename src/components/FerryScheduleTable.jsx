const FerryScheduleTable = ({ ferryTimings }) => {
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "on time":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentSchedule = (timing) => {
    if (!timing) return [];
    return timing.schedule || [];
  };

  const getNextDepartures = (schedule) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    // Get next 3 departures
    const upcoming = schedule.filter((time) => time > currentTime).slice(0, 3);

    // If less than 3, add from beginning of schedule (next day)
    if (upcoming.length < 3) {
      const needed = 3 - upcoming.length;
      upcoming.push(...schedule.slice(0, needed));
    }

    return upcoming;
  };

  if (!ferryTimings || ferryTimings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">No ferry schedules available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-semibold text-gray-700">
        <div>Next Departure</div>
        <div>Destination</div>
        <div>Travel Time</div>
        <div>Status</div>
      </div>

      {ferryTimings.map((timing, ferryIndex) => {
        const schedule = getCurrentSchedule(timing);
        const nextDepartures = getNextDepartures(schedule);

        return nextDepartures.map((departureTime, timeIndex) => (
          <div
            key={`${ferryIndex}-${timeIndex}`}
            className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100"
          >
            <div className="font-medium">{departureTime}</div>
            <div className="text-gray-600">
              {timing.destination || "Unknown"}
            </div>
            <div className="text-gray-600">{timing.travelTime || "N/A"}</div>
            <div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  "on time"
                )}`}
              >
                On Time
              </span>
            </div>
          </div>
        ));
      })}
    </div>
  );
};

export default FerryScheduleTable;
