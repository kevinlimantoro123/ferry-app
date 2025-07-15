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
            className={`flex-1 p-3 rounded-lg transition-colors ${
              selectedTransport === mode
                ? "bg-white text-black shadow-sm"
                : "bg-zinc-200 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-7 w-7 mx-auto mb-1" />
            <span className="text-md font-semibold">
              {transportLabels[mode]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TransportModeSelector;
