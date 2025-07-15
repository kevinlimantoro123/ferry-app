import React from "react";
import { Car, Train, Footprints } from "lucide-react";

const TransportModeSelector = ({ selectedTransport, setSelectedTransport }) => {
  const transportIcons = {
    driving: Car,
    transit: Train,
    walking: Footprints,
  };

  const transportLabels = {
    driving: "Drive",
    transit: "Transit",
    walking: "Walk",
  };

  return (
    <div className="flex space-x-2 mb-4">
      {Object.keys(transportIcons).map((mode) => {
        const Icon = transportIcons[mode];
        return (
          <button
            key={mode}
            onClick={() => setSelectedTransport(mode)}
            className={`flex-1 p-3 rounded-lg border transition-colors ${
              selectedTransport === mode
                ? "bg-blue-50 border-blue-500 text-blue-600"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5 mx-auto mb-1" />
            <span className="text-xs font-medium">{transportLabels[mode]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TransportModeSelector;
