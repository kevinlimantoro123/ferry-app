import React, { useState } from "react";

const ExpandedCard = ({ routeData }) => {
  if (!routeData?.ferries) return null;

  // Filter out Sisters Island
  const remainingFerries = routeData.ferries.filter(
    (ferry) => ferry.destination !== "Sisters Island"
  );
  if (remainingFerries.length === 0) return null;

  // State to track which dropdowns are open
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="mb-4">
      <h4 className="px-1 text-xl font-semibold text-gray-900 mb-2">
        Additional Ferry Departures
      </h4>
      <div className="space-y-4">
        {remainingFerries.map((ferry, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-black">
                  {ferry.destination}
                </span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Direct
                </span>
              </div>
            </div>

            {/* Direct Times */}
            <div className="flex space-x-4 mb-3">
              {ferry.directTimes.map((time, timeIndex) => {
                const isNextDay = time.includes(" +1");
                const displayTime = time.replace(" +1", "");

                return (
                  <span
                    key={timeIndex}
                    className={`text-md rounded ${
                      timeIndex === 0
                        ? "text-black font-medium"
                        : "text-gray-500"
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

            {/* Indirect Routes Dropdown */}
            {ferry.hasIndirect && ferry.indirectTimes.length > 0 && (
              <div className="border-t pt-3">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Indirect Routes
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      Via Transfer
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openDropdowns[index] ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {openDropdowns[index] && (
                  <div className="mt-3 space-y-2">
                    {ferry.indirectTimes.map((route, routeIndex) => (
                      <div
                        key={routeIndex}
                        className="flex items-center justify-between p-2 bg-stone-50 rounded"
                      >
                        <div className="flex flex-col">
                          <span className="text-md font-medium text-black">
                            {route.departure}
                          </span>
                          <span className="text-xs font-medium text-gray-700">
                            via {route.via}
                            {route.note && ` (${route.note})`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedCard;
