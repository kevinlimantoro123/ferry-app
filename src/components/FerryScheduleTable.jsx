import React from "react";

const FerryScheduleTable = ({ ferryTimings }) => {
  const getStatusColor = (status) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 font-semibold text-gray-700">
        <div>Ferry</div>
        <div>Destination</div>
        <div>ETA</div>
        <div>Status</div>
      </div>

      {ferryTimings.map((timing, index) => (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 p-4 border-t border-gray-100"
        >
          <div className="font-medium">{timing.ferry}</div>
          <div className="text-gray-600">{timing.destination}</div>
          <div className="text-gray-600">{timing.eta}</div>
          <div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                timing.status
              )}`}
            >
              {timing.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FerryScheduleTable;
