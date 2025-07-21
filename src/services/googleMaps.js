// services/googleMaps.js
import { Loader } from "@googlemaps/js-api-loader";

class GoogleMapsService {
  constructor() {
    this.loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places", "geometry"],
    });
    this.google = null;
    this.map = null;
    this.directionsService = null;
    this.directionsRenderer = null;
    this.placesService = null;
    this.vesselMarkers = new Map(); // Store vessel markers
  }

  async initialize() {
    try {
      this.google = await this.loader.load();
      this.directionsService = new this.google.maps.DirectionsService();
      this.directionsRenderer = new this.google.maps.DirectionsRenderer();
      return this.google;
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      throw error;
    }
  }

  async createMap(mapElement, options = {}) {
    if (!this.google) {
      await this.initialize();
    }

    const defaultOptions = {
      zoom: 11,
      center: { lat: 1.3521, lng: 103.8198 }, // Singapore center
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    this.map = new this.google.maps.Map(mapElement, {
      ...defaultOptions,
      ...options,
    });

    // Configure directions renderer to suppress default markers
    this.directionsRenderer.setOptions({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#4285F4",
        strokeWeight: 5,
        strokeOpacity: 0.8,
      },
    });
    this.directionsRenderer.setMap(this.map);
    this.placesService = new this.google.maps.places.PlacesService(this.map);

    return this.map;
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.warn(
          "Geolocation not supported, using default Singapore location"
        );
        // Fallback to Singapore center if geolocation is not supported
        resolve({
          lat: 1.3521,
          lng: 103.8198,
          isDefault: true,
        });
        return;
      }

      // First try with high accuracy
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            isDefault: false,
          });
        },
        (error) => {
          console.warn(
            "High accuracy geolocation failed, trying with lower accuracy:",
            error.message
          );

          // Fallback: try with lower accuracy settings
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                isDefault: false,
              });
            },
            (fallbackError) => {
              console.warn(
                "All geolocation attempts failed, using default Singapore location:",
                fallbackError.message
              );
              // Final fallback to Singapore center
              resolve({
                lat: 1.3521,
                lng: 103.8198,
                isDefault: true,
                error: fallbackError.message,
              });
            },
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 600000, // 10 minutes
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  async geocodeAddress(address) {
    if (!this.google) {
      await this.initialize();
    }

    const geocoder = new this.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve({
            location: results[0].geometry.location,
            formatted_address: results[0].formatted_address,
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  async searchPlaces(query, location = null) {
    if (!this.google) {
      await this.initialize();
    }

    // If we don't have a places service, create a temporary one
    if (!this.placesService) {
      // Create a temporary div for the places service
      const tempDiv = document.createElement("div");
      this.placesService = new this.google.maps.places.PlacesService(tempDiv);
    }

    const request = {
      query: query,
      fields: ["name", "geometry", "formatted_address", "place_id"],
    };

    if (location) {
      request.location = location;
      request.radius = 50000; // 50km radius
    }

    return new Promise((resolve, reject) => {
      this.placesService.textSearch(request, (results, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          resolve(results || []);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  async calculateRoute(origin, destination, travelMode = "DRIVING") {
    if (!this.google || !this.directionsService) {
      await this.initialize();
    }

    const request = {
      origin: origin,
      destination: destination,
      travelMode: this.google.maps.TravelMode[travelMode],
      unitSystem: this.google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };

    return new Promise((resolve, reject) => {
      this.directionsService.route(request, (result, status) => {
        if (status === "OK") {
          const route = result.routes[0];
          const leg = route.legs[0];

          resolve({
            duration: leg.duration.text,
            durationValue: leg.duration.value, // in seconds
            distance: leg.distance.text,
            distanceValue: leg.distance.value, // in meters
            steps: leg.steps,
            route: result,
          });
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  }

  async calculateMultipleRoutes(origin, destination) {
    const modes = ["DRIVING", "TRANSIT", "WALKING"];
    const results = {};

    for (const mode of modes) {
      try {
        const result = await this.calculateRoute(origin, destination, mode);
        results[mode.toLowerCase()] = result;
      } catch (error) {
        console.error(`Error calculating ${mode} route:`, error);
        results[mode.toLowerCase()] = null;
      }
    }

    return results;
  }

  displayRoute(route, cardState = "minimal") {
    if (this.directionsRenderer && route) {
      this.directionsRenderer.setDirections(route);

      // Fit the route bounds considering the card state
      this.fitRouteWithCard(route, cardState);
    }
  }

  clearRoute() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] });
    }
  }

  addMarker(position, options = {}) {
    if (!this.google || !this.map) {
      console.error("Google Maps not initialized when trying to add marker");
      throw new Error("Google Maps not initialized");
    }

    console.log(
      "Adding marker at position:",
      position,
      "with options:",
      options
    );
    const marker = new this.google.maps.Marker({
      position: position,
      map: this.map,
      ...options,
    });

    return marker;
  }

  fitBounds(bounds) {
    if (this.map && bounds) {
      this.map.fitBounds(bounds);
    }
  }

  panTo(location) {
    console.log("googleMapsService.panTo called with:", location);
    if (this.map && location) {
      this.map.panTo(location);
      console.log("Map panTo executed");
    } else {
      console.log("Map or location not available:", {
        map: !!this.map,
        location,
      });
    }
  }

  setZoom(zoom) {
    console.log("googleMapsService.setZoom called with:", zoom);
    if (this.map) {
      this.map.setZoom(zoom);
      console.log("Map setZoom executed");
    } else {
      console.log("Map not available");
    }
  }

  adjustMapForCard(cardState = "minimal") {
    if (!this.map) {
      console.log("Map not available for adjustment");
      return;
    }

    // Don't adjust for expanded state
    if (cardState === "expanded") {
      console.log("No adjustment needed for expanded state");
      return;
    }

    // Get current bounds
    const bounds = this.map.getBounds();
    if (!bounds) {
      console.log("Map bounds not available");
      return;
    }

    // Calculate padding based on card state
    let bottomPadding = 0;
    switch (cardState) {
      case "minimal":
        bottomPadding = 250; // Adjust based on your card height
        break;
      case "collapsed":
        bottomPadding = 100; // Smaller padding for collapsed state
        break;
      default:
        bottomPadding = 0;
    }

    // Apply padding to fit bounds with a slight delay to ensure proper rendering
    setTimeout(() => {
      this.map.fitBounds(bounds, {
        bottom: bottomPadding,
        top: 20,
        left: 20,
        right: 20,
      });
    }, 100);

    console.log(
      `Map adjusted for ${cardState} state with ${bottomPadding}px bottom padding`
    );
  }

  fitRouteWithCard(route, cardState = "minimal") {
    if (!route || !this.map) {
      console.log("Route or map not available for fitting");
      return;
    }

    // Don't adjust for expanded state
    if (cardState === "expanded") {
      console.log("No route adjustment needed for expanded state");
      // Just fit normally without padding
      const bounds = new this.google.maps.LatLngBounds();
      const legs = route.routes[0].legs;
      legs.forEach((leg) => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
      });
      this.map.fitBounds(bounds);
      return;
    }

    // Calculate padding based on card state
    let bottomPadding = 0;
    switch (cardState) {
      case "minimal":
        bottomPadding = 250; // Account for minimal card height
        break;
      case "collapsed":
        bottomPadding = 100; // Account for collapsed card height
        break;
      default:
        bottomPadding = 50;
    }

    // Get route bounds
    const bounds = new this.google.maps.LatLngBounds();

    // Add route points to bounds
    const legs = route.routes[0].legs;
    legs.forEach((leg) => {
      bounds.extend(leg.start_location);
      bounds.extend(leg.end_location);

      // Also include waypoints along the route for better fitting
      leg.steps.forEach((step) => {
        bounds.extend(step.start_location);
        bounds.extend(step.end_location);
      });
    });

    // Fit bounds with padding to account for the card
    setTimeout(() => {
      this.map.fitBounds(bounds, {
        bottom: bottomPadding,
        top: 50,
        left: 50,
        right: 50,
      });
    }, 100);

    console.log(
      `Route fitted with ${cardState} card state, bottom padding: ${bottomPadding}px`
    );
  }

  // Vessel marker management methods
  addVesselMarker(vessel) {
    if (!this.map || !this.google) {
      console.error('Map not initialized');
      return null;
    }

    // Remove existing marker for this vessel if it exists
    if (this.vesselMarkers.has(vessel.vesselId)) {
      this.vesselMarkers.get(vessel.vesselId).setMap(null);
    }

    const marker = new this.google.maps.Marker({
      position: { lat: vessel.latitude, lng: vessel.longitude },
      map: this.map,
      title: vessel.name,
      icon: this.createShipIcon(vessel),
      zIndex: 1000
    });

    // Add click listener for vessel info
    const infoWindow = new this.google.maps.InfoWindow({
      content: this.createVesselInfoContent(vessel)
    });

    marker.addListener('click', () => {
      infoWindow.open(this.map, marker);
    });

    this.vesselMarkers.set(vessel.vesselId, marker);
    return marker;
  }

  updateVesselMarker(vessel) {
    const marker = this.vesselMarkers.get(vessel.vesselId);
    if (marker) {
      marker.setPosition({ lat: vessel.latitude, lng: vessel.longitude });
      const icon = marker.getIcon();
      if (icon && typeof icon === 'object') {
        marker.setIcon({
          ...icon,
          rotation: vessel.heading || 0
        });
      }
    } else {
      // Create new marker if it doesn't exist
      this.addVesselMarker(vessel);
    }
  }

  removeVesselMarker(vesselId) {
    const marker = this.vesselMarkers.get(vesselId);
    if (marker) {
      marker.setMap(null);
      this.vesselMarkers.delete(vesselId);
    }
  }

  clearAllVesselMarkers() {
    this.vesselMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.vesselMarkers.clear();
  }

  getVesselColor(vesselCategory) {
    const colorMap = {
      'Ferry': '#4CAF50',     // Green for ferries
      'Cargo': '#FF9800',     // Orange for cargo
      'Tanker': '#F44336',    // Red for tankers
      'Tug': '#9C27B0',       // Purple for tugs
      'Pilot': '#FBBC04',     // Yellow
      'Recreational': '#FF6D01', // Orange
      'Fishing': '#00BCD4',   // Cyan
      'Unknown': '#2196F3'    // Blue
    };
    return colorMap[vesselCategory] || colorMap['Unknown'];
  }

  createShipIcon(vessel) {
    // Determine ship color based on type
    const color = this.getVesselColor(vessel.vesselCategory);

    // Create SVG ship icon pointing in the direction of heading
    const heading = vessel.heading || 0;
    const size = vessel.vesselCategory.toLowerCase() === 'ferry' ? 75 : 65; // Increased from 60/50 to 75/65
    
    return {
      url: this.createShipSvgDataUrl(color, heading, vessel.name || 'Unknown'),
      scaledSize: new this.google.maps.Size(size, Math.round(size * 0.67)), // 75x50 or 65x44 aspect ratio
      anchor: new this.google.maps.Point(size/2, Math.round(size * 0.67)/2),
    };
  }

  createShipSvgDataUrl(color, heading, vesselName) {
    // Create a simpler, more reliable ship icon with name label
    const svg = `
      <svg width="75" height="50" viewBox="0 0 75 50" xmlns="http://www.w3.org/2000/svg">
        <!-- Ship name label background -->
        <rect x="2" y="2" width="71" height="15" fill="rgba(255,255,255,0.95)" stroke="${color}" stroke-width="1" rx="3"/>
        <!-- Ship name text -->
        <text x="37.5" y="12" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#333">${vesselName.length > 16 ? vesselName.substring(0, 16) + '...' : vesselName}</text>
        
        <!-- Ship body (simplified design) -->
        <g transform="rotate(${heading} 37.5 32)">
          <!-- Main hull -->
          <path d="M25 34 L50 34 L47 39 L28 39 Z" fill="${color}" stroke="#fff" stroke-width="1"/>
          <!-- Ship deck -->
          <rect x="28" y="29" width="19" height="5" fill="${color}" stroke="#fff" stroke-width="1"/>
          <!-- Bridge/superstructure -->
          <rect x="33" y="24" width="10" height="5" fill="${color}" stroke="#fff" stroke-width="1"/>
          <!-- Wheelhouse -->
          <rect x="35" y="21" width="5" height="3" fill="#fff" stroke="${color}" stroke-width="1"/>
          <!-- Bow (front) -->
          <path d="M37.5 18 L40 24 L35 24 Z" fill="${color}" stroke="#fff" stroke-width="1"/>
          <!-- Direction indicator -->
          <circle cx="37.5" cy="19" r="2" fill="#fff"/>
          <!-- Side details -->
          <line x1="28" y1="31" x2="47" y2="31" stroke="#fff" stroke-width="0.5"/>
          <line x1="30" y1="36" x2="45" y2="36" stroke="#fff" stroke-width="0.5"/>
        </g>
      </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  createVesselInfoContent(vessel) {
    // Format date as DD/MM/YYYY HH:mm:ss
    let lastUpdate = 'Unknown';
    
    try {
      if (vessel.timestamp) {
        const date = new Date(vessel.timestamp);
        if (!isNaN(date.getTime())) {
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = date.getSeconds().toString().padStart(2, '0');
          
          lastUpdate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        }
      }
    } catch (error) {
      console.warn('Error formatting date:', error);
      lastUpdate = 'Data unavailable';
    }

    return `
      <div style="max-width: 300px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 10px 0; color: #333;">${vessel.name}</h3>
        <div style="margin: 5px 0;"><strong>Type:</strong> ${vessel.vesselCategory || vessel.shipType}</div>
        <div style="margin: 5px 0;"><strong>MMSI:</strong> ${vessel.vesselId}</div>
        <div style="margin: 5px 0;"><strong>Speed:</strong> ${vessel.sog || vessel.speed || 0} knots</div>
        <div style="margin: 5px 0;"><strong>Heading:</strong> ${vessel.heading || 0}°</div>
        <div style="margin: 5px 0;"><strong>Destination:</strong> ${vessel.destination || 'Unknown'}</div>
        <div style="margin: 5px 0;"><strong>Status:</strong> ${vessel.status || 'Unknown'}</div>
        ${vessel.length ? `<div style="margin: 5px 0;"><strong>Length:</strong> ${vessel.length}m</div>` : ''}
        <div style="margin: 5px 0; font-size: 12px; color: #666;">
          <strong>Last Update:</strong> ${lastUpdate}
        </div>
      </div>
    `;
  }

  displayVessels(vessels) {
    // Clear existing vessel markers
    this.clearAllVesselMarkers();
    
    // Add new markers for all vessels
    vessels.forEach(vessel => {
      this.addVesselMarker(vessel);
    });

    console.log(`Displayed ${vessels.length} vessels on map`);
  }
}

const googleMapsService = new GoogleMapsService();
export default googleMapsService;
