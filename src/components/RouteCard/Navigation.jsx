import React from "react";
import { Navigation } from "lucide-react";

const NavigationButton = ({
  onCenterUserLocation,
  cardState,
  className = "",
}) => {
  // Only show for minimal and collapsed states
  const shouldShow =
    (cardState === "minimal" || cardState === "collapsed") &&
    onCenterUserLocation;

  if (!shouldShow) return null;

  return (
    <button
      onClick={() => {
        console.log("Navigation button clicked");
        if (onCenterUserLocation) {
          onCenterUserLocation();
        }
      }}
      className={`absolute -top-16 right-4 z-10 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors ${className}`}
      aria-label="Center on your location"
    >
      <Navigation className="h-6 w-6 text-black" />
    </button>
  );
};

export default NavigationButton;
