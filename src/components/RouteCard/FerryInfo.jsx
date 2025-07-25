import React from "react";

const FerryInfo = ({ routeData }) => {
  return (
    <div className="mb-4">
      <h4 className="px-1 text-xl font-semibold text-gray-900 mb-2">
        Next Ferry Departures
      </h4>
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-black">
              {routeData.ferry.destination}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Direct
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          {routeData.ferry.times.map((time, index) => {
            const isNextDay = time.includes(" +1");
            const displayTime = time.replace(" +1", "");

            return (
              <span
                key={index}
                className={`text-md rounded ${
                  index === 0 ? "text-black font-medium" : "text-gray-500"
                } ${isNextDay ? "relative" : ""}`}
              >
                {displayTime}
                {isNextDay && (
                  <span className="ml-1 text-xs text-orange-500 font-medium">
                    next day
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FerryInfo;
