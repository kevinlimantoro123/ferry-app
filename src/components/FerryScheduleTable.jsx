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

  if (!ferryTimings || ferryTimings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden p-8 text-center">
        <p className="text-gray-500">No ferry schedules available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-zinc-200 font-semibold text-gray-700">
        <div>Departure Time</div>
        <div>Destination</div>
        <div>Travel Time</div>
        <div>Status</div>
      </div>

      {ferryTimings.map((timing, ferryIndex) => {
        const scheduleArray = timing.schedule || [];
        return scheduleArray.map((departureTime, timeIndex) => (
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
