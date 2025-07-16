import React from "react";
import { Navigation } from "lucide-react";

const NavigationButton = ({
  onCenterUserLocation,
  cardState,
  setCardState,
  className = "",
}) => {
  // Show for all states when onCenterUserLocation is available
  const shouldShow = onCenterUserLocation;

  if (!shouldShow) return null;

  return (
    <button
      onClick={() => {
        console.log("Navigation button clicked - centering and collapsing");
        console.log("Current card state:", cardState);

        // First collapse the card
        if (setCardState) {
          console.log("Setting card state to collapsed");
          setCardState("collapsed");
        }

        // Then center on user location after the state change has been processed
        if (onCenterUserLocation) {
          console.log("Calling onCenterUserLocation with delay");
          // Use requestAnimationFrame to ensure the state change is processed first
          requestAnimationFrame(() => {
            setTimeout(() => {
              onCenterUserLocation();
            }, 100);
          });
        }
      }}
      className={`p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-colors ${className}`}
      aria-label="Center on your location and collapse card"
    >
      <Navigation className="h-6 w-6 text-black" />
    </button>
  );
};

export default NavigationButton;
