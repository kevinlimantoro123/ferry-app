import React, { useState, useEffect } from "react";
import { MapPin, AlertCircle, X } from "lucide-react";
import { Sheet } from "react-modal-sheet";
import TransportModeSelector from "./TransportModeSelector";
import RouteSummary from "./RouteSummary";
import FerryInfo from "./FerryInfo";
import ExpandedCard from "./ExpandedCard";
import NavigationButton from "./Navigation";

const RouteCard = ({
  routeData,
  selectedTransport,
  setSelectedTransport,
  cardState = "minimal",
  setCardState,
  onClose,
  onCenterUserLocation,
  loading = false,
  error = null,
}) => {
  // Sheet is always open now, with three states including collapsed
  const isOpen = true;

  // Helper function to get snap index from card state
  const getSnapIndexFromState = (state) => {
    switch (state) {
      case "expanded":
        return 0;
      case "minimal":
        return 1;
      case "collapsed":
        return 2;
      default:
        return 1;
    }
  };

  // Initialize with snap index 1 (0.3/30% - minimal state) as default
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1);

  // Define snap points: expanded (80%), minimal (30%), collapsed (8%) - in descending order
  const snapPoints = [0.8, 0.3, 0.08];

  // Update snap index when cardState changes (after first render)
  useEffect(() => {
    const newSnapIndex = getSnapIndexFromState(cardState);
    setCurrentSnapIndex(newSnapIndex);
    console.log(
      "Card state changed to:",
      cardState,
      "snap index:",
      newSnapIndex
    );
  }, [cardState]);

  // Get initial snap index based on current snap index state (not cardState)
  const getInitialSnap = () => {
    return currentSnapIndex;
  };

  // Handle snap point changes with more robust state management
  const handleSnapPointChange = (snapIndex) => {
    console.log("Snap point changed to index:", snapIndex);

    // Prevent unnecessary state updates if we're already at the correct state
    if (snapIndex === currentSnapIndex) {
      console.log(
        "Already at snap index",
        snapIndex,
        "- skipping state change"
      );
      return;
    }

    // Use requestAnimationFrame to ensure the snap change is processed properly
    requestAnimationFrame(() => {
      if (snapIndex === 0) {
        console.log("Setting card state to expanded");
        setCardState("expanded");
      } else if (snapIndex === 1) {
        console.log("Setting card state to minimal");
        setCardState("minimal");
      } else if (snapIndex === 2) {
        console.log("Setting card state to collapsed");
        setCardState("collapsed");
      }
    });
  };

  // Handle sheet close
  const handleClose = () => {
    setCardState("collapsed");
  };

  if (error) {
    return (
      <Sheet isOpen={true} onClose={onClose} snapPoints={[0.3]} initialSnap={0}>
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="p-4">
              <div className="flex items-center space-x-2 text-red-500 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Route Error</span>
              </div>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={onClose}
                className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Back
              </button>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    );
  }

  if (loading) {
    return (
      <Sheet
        isOpen={true}
        onClose={() => {}}
        snapPoints={[0.3]}
        initialSnap={0}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="p-4">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    );
  }

  if (!routeData) {
    return (
      <Sheet
        isOpen={true}
        onClose={() => {}}
        snapPoints={[0.3]}
        initialSnap={0}
      >
        <Sheet.Container>
          <Sheet.Header />
          <Sheet.Content>
            <div className="p-4">
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a starting location
                </h3>
                <p className="text-gray-500">
                  Search for a location to see route details
                </p>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    );
  }

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={handleClose}
        snapPoints={snapPoints}
        initialSnap={getInitialSnap()}
        onSnap={handleSnapPointChange}
      >
        <Sheet.Container
          style={{ backgroundColor: "#F7F7F6", position: "relative" }}
        >
          {/* Navigation button positioned relative to the card */}
          <NavigationButton
            onCenterUserLocation={onCenterUserLocation}
            cardState={cardState}
            setCardState={setCardState}
            className="absolute -top-16 right-4 z-10"
          />

          <Sheet.Header>
            <div className="flex items-center px-3 py-2 relative">
              {/* Draggable handle bar */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-2">
                <div className="w-12 h-1 bg-gray-400 rounded-full"></div>
              </div>

              {/* Close button */}
              <div className="absolute top-3 right-4">
                <button
                  onClick={onClose}
                  className="p-2 bg-zinc-200 hover:bg-gray-300 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6 text-black font-bold" />
                </button>
              </div>

              {/* Estimated Arrival */}
              <div className="flex-1 mt-4 pl-2 pt-1">
                <h2 className="text-2xl font-semibold text-black">
                  Estimated Arrival
                </h2>
                <p className="text-lg text-black">{routeData.timeRange}</p>
              </div>
            </div>
          </Sheet.Header>

          <Sheet.Content>
            <div className="px-4 pt-2 pb-4">
              <TransportModeSelector
                selectedTransport={selectedTransport}
                setSelectedTransport={setSelectedTransport}
              />
              <RouteSummary routeData={routeData} />
              <FerryInfo routeData={routeData} />
              <ExpandedCard routeData={routeData} />
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </>
  );
};

export default RouteCard;
