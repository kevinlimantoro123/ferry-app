import React from "react";
import { Car, Bus, Navigation, X, ChevronUp, ChevronDown } from "lucide-react";
import TransportMode from "./TransportMode";

const Card = ({
  routeData,
  selectedTransport,
  setSelectedTransport,
  isExpanded,
  setIsExpanded,
}) => {
  const transportModes = [
    { id: "car", icon: Car, label: "Car" },
    { id: "public", icon: Bus, label: "Public" },
    { id: "walk", icon: Navigation, label: "Walk" },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transition-all duration-300 ${
        isExpanded ? "h-96" : "h-auto"
      }`}
    >
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Header with close button */}
      <div className="flex items-center justify-between px-6 pb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Estimated Arrival
        </h2>
        <button
          onClick={() => setIsExpanded(false)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Time display */}
      <div className="px-6 pb-4">
        <p className="text-sm text-gray-600">{routeData.timeRange}</p>
      </div>

      {/* Transport mode tabs */}
      <div className="px-6 pb-4">
        <div className="flex space-x-2">
          {transportModes.map((mode) => (
            <TransportMode
              key={mode.id}
              icon={mode.icon}
              label={mode.label}
              isActive={selectedTransport === mode.id}
              onClick={() => setSelectedTransport(mode.id)}
            />
          ))}
        </div>
      </div>

      {/* Route details */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Car className="h-6 w-6 text-gray-700" />
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {routeData.duration}
            </p>
            <p className="text-sm text-gray-500">({routeData.distance})</p>
          </div>
        </div>

        {/* Ferry information */}
        {routeData.ferry && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">
              Next ferry - {routeData.ferry.destination}
            </h3>
            <div className="flex space-x-4 text-sm">
              <span className="font-medium text-gray-900">
                {routeData.ferry.times[0]}
              </span>
              <span className="text-gray-500">{routeData.ferry.times[1]}</span>
              <span className="text-gray-500">{routeData.ferry.times[2]}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
