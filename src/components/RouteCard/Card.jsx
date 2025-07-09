import React, { useState, useRef, useEffect } from "react";
import { Car, Bus, Navigation, X, ChevronUp, ChevronDown } from "lucide-react";
import TransportMode from "./TransportMode";

const Card = ({
  routeData,
  selectedTransport,
  setSelectedTransport,
  isExpanded,
  setIsExpanded,
  onClose,
  onNavigateToFerry,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const cardRef = useRef(null);
  const initialHeightRef = useRef(0);

  const transportModes = [
    { id: "car", icon: Car, label: "Car" },
    { id: "public", icon: Bus, label: "Public" },
    { id: "walk", icon: Navigation, label: "Walk" },
  ];

  // Handle drag start
  const handleDragStart = (e) => {
    setIsDragging(true);
    const clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setDragY(0);

    if (cardRef.current) {
      initialHeightRef.current = cardRef.current.offsetHeight;
    }
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startY;
    setDragY(deltaY);
  };

  // Handle drag end
  const handleDragEnd = () => {
    if (!isDragging) return;

    setIsDragging(false);

    // Determine if card should expand or collapse based on drag distance
    const threshold = 50; // pixels

    if (dragY < -threshold) {
      // Dragged up significantly - expand
      setIsExpanded(true);
    } else if (dragY > threshold) {
      // Dragged down significantly - collapse
      setIsExpanded(false);
    }

    setDragY(0);
  };

  // Add event listeners for mouse/touch events
  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();
    const handleTouchMove = (e) => handleDragMove(e);
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragY, startY]);

  // Calculate card height and transform based on drag state
  const getCardStyle = () => {
    const baseStyle = {
      transform: isDragging ? `translateY(${dragY}px)` : "translateY(0)",
      transition: isDragging ? "none" : "all 0.3s ease-out",
    };

    if (isExpanded) {
      return {
        ...baseStyle,
        height: "80vh",
        maxHeight: "none",
      };
    }

    return {
      ...baseStyle,
      height: "auto",
    };
  };

  return (
    <div
      ref={cardRef}
      className={`fixed bottom-0 left-0 right-0 bg-zinc-100 rounded-t-3xl shadow-2xl z-10 flex flex-col ${
        isExpanded ? "overflow-hidden" : ""
      }`}
      style={getCardStyle()}
    >
      {/* Draggable handle bar */}
      <div
        className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
      </div>

      {/* Header with close button and expand/collapse indicator */}
      <div className="flex items-center justify-between px-6 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          Estimated Arrival
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="h-6 w-6 text-gray-400" />
            ) : (
              <ChevronUp className="h-6 w-6 text-gray-400" />
            )}
          </button>
          <button
            onClick={() => onClose && onClose()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Scrollable content container */}
      <div className={`${isExpanded ? "overflow-y-auto flex-1" : ""}`}>
        {/* Time display */}
        <div className="px-6 pb-4">
          <p className="text-md text-black">{routeData.timeRange}</p>
        </div>

        {/* Transport mode tabs */}
        <div className="px-6 pb-4">
          <div className="flex w-full">
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
            <div
              className="bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => onNavigateToFerry && onNavigateToFerry()}
            >
              <h3 className="font-medium text-gray-900 mb-2">
                Next ferry - {routeData.ferry.destination}
              </h3>
              <div className="flex space-x-4 text-sm">
                <span className="font-medium text-gray-900">
                  {routeData.ferry.times[0]}
                </span>
                <span className="text-gray-500">
                  {routeData.ferry.times[1]}
                </span>
                <span className="text-gray-500">
                  {routeData.ferry.times[2]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Additional expanded content - Multiple ferry destinations */}
        {isExpanded && routeData.ferries && (
          <div className="px-6 pb-6 space-y-4">
            {routeData.ferries.map((ferry, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onNavigateToFerry && onNavigateToFerry()}
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  Next ferry - {ferry.destination}
                </h3>
                <div className="flex space-x-4 text-sm">
                  <span className="font-medium text-gray-900">
                    {ferry.times[0]}
                  </span>
                  <span className="text-gray-500">{ferry.times[1]}</span>
                  <span className="text-gray-500">{ferry.times[2]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
