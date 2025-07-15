import React from "react";

const ExpandedCard = ({ routeData }) => {
  if (!routeData?.ferries) return null;

  return (
    <div className="mb-4">
      <h4 className="font-medium text-gray-900 mb-2">All Ferry Departures</h4>
      <div className="space-y-2">
        {routeData.ferries.map((ferry, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                To {ferry.destination}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {ferry.times.map((time, timeIndex) => (
                <span
                  key={timeIndex}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedCard;
