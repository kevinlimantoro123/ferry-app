import { useState, useRef } from "react";

export const useDrag = (cardState, setCardState) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef(null);

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setDragOffset(0);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaY = startY - e.clientY;
    setDragOffset(deltaY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    // Three states: 'collapsed', 'minimal', 'expanded'
    if (dragOffset > 100 && cardState === "collapsed") {
      setCardState("expanded");
    } else if (dragOffset > 50 && cardState === "collapsed") {
      setCardState("minimal");
    } else if (dragOffset > 50 && cardState === "minimal") {
      setCardState("expanded");
    } else if (dragOffset < -50 && cardState === "expanded") {
      setCardState("minimal");
    } else if (dragOffset < -50 && cardState === "minimal") {
      setCardState("collapsed");
    } else if (dragOffset < -100 && cardState === "expanded") {
      setCardState("collapsed");
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const deltaY = startY - e.touches[0].clientY;
    setDragOffset(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    // Three states: 'collapsed', 'minimal', 'expanded'
    if (dragOffset > 100 && cardState === "collapsed") {
      setCardState("expanded");
    } else if (dragOffset > 50 && cardState === "collapsed") {
      setCardState("minimal");
    } else if (dragOffset > 50 && cardState === "minimal") {
      setCardState("expanded");
    } else if (dragOffset < -50 && cardState === "expanded") {
      setCardState("minimal");
    } else if (dragOffset < -50 && cardState === "minimal") {
      setCardState("collapsed");
    } else if (dragOffset < -100 && cardState === "expanded") {
      setCardState("collapsed");
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const dragHandlers = {
    onMouseDown: handleMouseDown,
    onMouseMove: handleMouseMove,
    onMouseUp: handleMouseUp,
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  const dragStyles = {
    transform: isDragging ? `translateY(${-dragOffset}px)` : "translateY(0)",
    transition: isDragging
      ? "none"
      : "transform 0.3s ease-out, all 0.3s ease-in-out",
  };

  return {
    isDragging,
    dragOffset,
    dragRef,
    dragHandlers,
    dragStyles,
  };
};
