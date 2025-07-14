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
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
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

  displayRoute(route) {
    if (this.directionsRenderer && route) {
      this.directionsRenderer.setDirections(route);
    }
  }

  clearRoute() {
    if (this.directionsRenderer) {
      this.directionsRenderer.setDirections({ routes: [] });
    }
  }

  addMarker(position, options = {}) {
    if (!this.google || !this.map) {
      throw new Error("Google Maps not initialized");
    }

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
    if (this.map && location) {
      this.map.panTo(location);
    }
  }

  setZoom(zoom) {
    if (this.map) {
      this.map.setZoom(zoom);
    }
  }
}

const googleMapsService = new GoogleMapsService();
export default googleMapsService;
