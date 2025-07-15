import React from "react";

const FerryInfo = ({ routeData }) => {
  return (
    <div className="mb-4">
      <h4 className="px-1 text-xl font-semibold text-gray-900 mb-2">
        Next Ferry Departures
      </h4>
      <div className="bg-white rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-medium text-black">
            {routeData.ferry.destination}
          </span>
        </div>
        <div className="flex space-x-4">
          {routeData.ferry.times.map((time, index) => (
            <span
              key={index}
              className={`text-md rounded ${
                index === 0 ? "text-black font-medium" : "text-gray-500"
              }`}
            >
              {time}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FerryInfo;
