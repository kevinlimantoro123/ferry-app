// data/ferryData.js
import Papa from 'papaparse';

// Path to the vessel tracking data CSV file (now in public folder)
export const VESSEL_DATA_PATH = "/vessel-data.csv";

export const SINGAPORE_LOCATIONS = [
  "Orchard Road",
  "Marina Bay Sands",
  "Changi Airport",
  "Raffles Place",
  "Sentosa Island",
  "Jurong East",
  "Woodlands",
  "Tampines",
  "Bishan",
  "Ang Mo Kio",
  "Toa Payoh",
  "Clementi",
  "Bukit Batok",
  "Yishun",
  "Bedok",
  "Hougang",
  "Sengkang",
  "Punggol",
  "Pasir Ris",
  "Bukit Merah",
  "Novena",
  "Somerset",
  "Dhoby Ghaut",
  "City Hall",
  "Bugis",
  "Chinatown",
  "Little India",
  "Clarke Quay",
  "Marina South Pier",
];

// Legacy export for backward compatibility
export const LOCATIONS = SINGAPORE_LOCATIONS;

// Ferry schedules organized by tabs for the ferry timings page
export const FERRY_SCHEDULES = {
  MSP: [
    {
      destination: "Kusu Island",
      weekdays: [
        "15:00",
        "17:00",
      ],
      weekends: [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
      ],
      travelTime: "15 minutes",
    },
    {
      destination: "Lazarus Island",
      weekdays: [
        "10:00",
        "12:00",
        "14:00",
      ],
      weekends: [
        "09:15",
        "09:45",
        "10:15",
        "10:45",
        "11:15",
        "11:45",
        "12:15",
        "12:45",
        "13:15",
        "13:45",
        "14:15",
        "14:45",
        "15:15",
        "15:45",
        "16:15",
        "16:45",
      ],
      travelTime: "20 minutes",
    },
    {
      destination: "St. John's Island",
      weekdays: [
        "09:00",
        "11:00",
        "13:00",
      ],
      weekends: [
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
      ],
      travelTime: "25 minutes",
    },
  ],
};

// Vessel movement data structure
export let vesselMovementData = [];

// Generate dummy vessel data for demonstration with high-frequency updates (23:25-23:35)
const generateDummyVesselData = () => {
  // Generate circular movement pattern for MSF HAPPY
  // Center point: Waters near Marina South Pier (1.2580, 103.8600)
  // Radius: 0.008 degrees (~900 meters) - more noticeable on map
  // Time: Dynamic based on current time for real-time movement
  
  const centerLat = 1.2580;  // Moved to water area south of Marina Bay
  const centerLng = 103.8600; // In the water between Marina Bay and Sentosa
  const radius = 0.008; // Increased to about 900 meters radius for better visibility
  
  // Use current time as the base and generate positions around current time
  const now = new Date();
  
  // Create a time window around current time (±10 minutes)
  const timeWindowMinutes = 20; // 20 minute total window
  const startTime = new Date(now.getTime() - (timeWindowMinutes / 2) * 60 * 1000); // 10 minutes ago
  const intervalSeconds = 10; // Position every 10 seconds
  const totalDuration = timeWindowMinutes * 60; // 20 minutes in seconds
  const totalPoints = totalDuration / intervalSeconds; // 120 points
  
  let csvData = `Local Time,UTC Time,MMSI,IMO,Name,Call Sign,Ship Type,Length,Beam,Draught,SOG,COG,Heading,Latitude,Longitude,Destination,Status,Flag,AIS Ship Type,AIS Status,AIS A,AIS B,AIS C,AIS D\n`;
  
  for (let i = 0; i < totalPoints; i++) {
    // Calculate angle for circular movement (complete circle in 20 minutes)
    // Add time-based offset to make the vessel position change continuously
    const baseAngle = (i / totalPoints) * 2 * Math.PI;
    const timeOffset = (now.getTime() / 1000 / 60) * (2 * Math.PI / 20); // Complete circle every 20 minutes
    const angle = baseAngle + timeOffset;
    
    // Calculate position on circle
    const lat = centerLat + radius * Math.cos(angle);
    const lng = centerLng + radius * Math.sin(angle);
    
    // Calculate current time
    const currentTime = new Date(startTime.getTime() + i * intervalSeconds * 1000);
    const localTimeStr = currentTime.toISOString().slice(0, 19).replace('T', ' ');
    const utcTimeStr = currentTime.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
    
    // Calculate Course Over Ground (COG) - direction of movement
    const nextAngle = ((i + 1) / totalPoints) * 2 * Math.PI;
    const cogDegrees = Math.round(((nextAngle * 180 / Math.PI) + 90) % 360);
    
    // Calculate Speed Over Ground (realistic ferry speed: 8-12 knots)
    const sogKnots = (8 + Math.sin(angle) * 2).toFixed(1); // Varies between 6-10 knots
    
    // Calculate heading (slightly different from COG due to current/wind)
    const heading = Math.round((cogDegrees + Math.sin(angle * 3) * 10) % 360);
    
    csvData += `${localTimeStr},${utcTimeStr},563072390,,MSF HAPPY,9V6734,Passenger ship,18,6,2.1,${sogKnots},${cogDegrees},${heading},${lat.toFixed(6)},${lng.toFixed(6)},Marina South Pier,Under way using engine,Singapore,60,,4,14,3,3\n`;
  }
  
  return csvData.trim();
};

// Function to load vessel movement data from CSV
export const loadVesselMovementData = async (csvFilePath, forceDummy = true) => {
  try {
    let csvData;
    
    // Use dummy data by default for smooth simulation
    if (forceDummy) {
      console.log('Using dummy vessel data for real-time simulation');
      csvData = generateDummyVesselData();
    } else {
      // Keep CSV loading logic for future use
      // Check if we're in a browser environment with file reading capability
      if (typeof window !== 'undefined' && window.fs?.readFile) {
        // For environments with window.fs.readFile (like Claude artifacts)
        csvData = await window.fs.readFile(csvFilePath, { encoding: 'utf8' });
      } else {
        // For regular web environments, try to fetch from public folder or use fallback data
        try {
          const response = await fetch(csvFilePath);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          csvData = await response.text();
        } catch (fetchError) {
          console.warn('Could not fetch CSV file, using fallback dummy data:', fetchError);
          // Use dummy data for demonstration
          csvData = generateDummyVesselData();
        }
      }
    }

    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().replace(/\s+/g, ' '),
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          // Process and validate the data according to your CSV structure
          vesselMovementData = results.data.map((row, index) => {
            // Parse timestamp properly with better date handling
            let timestamp = new Date().toISOString();
            
            if (row['UTC Time'] || row.utctime || row['Local Time'] || row.localtime) {
              const timeStr = row['UTC Time'] || row.utctime || row['Local Time'] || row.localtime;
              try {
                // Handle different date formats that might be in your CSV
                let parsedDate;
                
                // Try to parse as-is first
                parsedDate = new Date(timeStr);
                
                // If that fails, try different formats
                if (isNaN(parsedDate.getTime())) {
                  // Try with different separators and formats
                  const cleanTimeStr = timeStr.toString().trim();
                  
                  // Common formats: "DD/MM/YYYY HH:mm:ss" or "MM/DD/YYYY HH:mm:ss"
                  if (cleanTimeStr.includes('/') && cleanTimeStr.includes(':')) {
                    // Assume DD/MM/YYYY format for now, but you might need to adjust
                    const parts = cleanTimeStr.split(' ');
                    if (parts.length >= 2) {
                      const datePart = parts[0];
                      const timePart = parts[1];
                      const [day, month, year] = datePart.split('/');
                      
                      // Create date as YYYY-MM-DD HH:mm:ss format
                      const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timePart}`;
                      parsedDate = new Date(isoString);
                    }
                  }
                }
                
                // Validate the parsed date is reasonable (not too far in future/past)
                const now = new Date();
                const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                
                if (!isNaN(parsedDate.getTime()) && parsedDate >= oneYearAgo && parsedDate <= oneMonthFromNow) {
                  timestamp = parsedDate.toISOString();
                } else {
                  console.warn('Parsed date seems unreasonable:', parsedDate, 'from:', timeStr);
                  // Use current time as fallback
                  timestamp = now.toISOString();
                }
              } catch (error) {
                console.warn('Invalid timestamp:', timeStr, error.message);
                // Use current time as fallback
                timestamp = new Date().toISOString();
              }
            }

            // Handle potential undefined values and map to your column names
            const processedRow = {
              // Basic identification
              vesselId: row.MMSI || row.mmsi || `vessel_${index}`,
              imo: row.IMO || row.imo || null,
              name: row.Name || row.name || 'Unknown Vessel',
              callSign: row['Call Sign'] || row.callsign || null,
              
              // Time data
              localTime: row['Local Time'] || row.localtime || null,
              utcTime: row['UTC Time'] || row.utctime || timestamp,
              timestamp: timestamp,
              
              // Position and movement
              latitude: parseFloat(row.Latitude || row.latitude || 0),
              longitude: parseFloat(row.Longitude || row.longitude || 0),
              sog: parseFloat(row.SOG || row.sog || 0), // Speed Over Ground
              cog: parseFloat(row.COG || row.cog || 0), // Course Over Ground
              heading: parseFloat(row.Heading || row.heading || 0),
              
              // Vessel specifications
              shipType: row['Ship Type'] || row.shiptype || 'Unknown',
              length: parseFloat(row.Length || row.length || 0),
              beam: parseFloat(row.Beam || row.beam || 0),
              draught: parseFloat(row.Draught || row.draught || 0),
              
              // Operational data
              destination: row.Destination || row.destination || 'Unknown',
              status: row.Status || row.status || 'Unknown',
              flag: row.Flag || row.flag || null,
              
              // AIS specific data
              aisShipType: row['AIS Ship Type'] || row.aisshiptype || null,
              aisStatus: row['AIS Status'] || row.aisstatus || null,
              aisA: parseFloat(row['AIS A'] || row.aisa || 0),
              aisB: parseFloat(row['AIS B'] || row.aisb || 0),
              aisC: parseFloat(row['AIS C'] || row.aisc || 0),
              aisD: parseFloat(row['AIS D'] || row.aisd || 0),
              
              // Derived/calculated fields
              speed: parseFloat(row.SOG || row.sog || 0), // For backward compatibility
              route: determineRoute(row.Destination || row.destination, row.Name || row.name),
              vesselCategory: categorizeVessel(row['Ship Type'] || row.shiptype)
            };

            return processedRow;
          }).filter(row => 
            // Filter out invalid entries - ensure we have valid coordinates
            row.latitude !== 0 && row.longitude !== 0 && 
            row.vesselId && 
            row.latitude >= -90 && row.latitude <= 90 &&
            row.longitude >= -180 && row.longitude <= 180
          );

          console.log(`Loaded ${vesselMovementData.length} vessel movement records from CSV`);
          console.log('Sample vessel data:', vesselMovementData.slice(0, 2)); // Show first 2 records
          resolve(vesselMovementData);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading vessel movement data:', error);
    throw error;
  }
};

// Helper function to determine route based on destination and vessel name
const determineRoute = (destination, vesselName) => {
  if (!destination) return 'Unknown';
  
  const dest = destination.toLowerCase();
  const name = (vesselName || '').toLowerCase();
  
  // Singapore ferry routes
  if (dest.includes('kusu') || dest.includes('kusu island')) return 'MSP-KUSU';
  if (dest.includes('lazarus') || dest.includes('lazarus island')) return 'MSP-LAZARUS';
  if (dest.includes('st john') || dest.includes('st. john')) return 'MSP-STJOHN';
  if (dest.includes('sentosa')) return 'MSP-SENTOSA';
  if (dest.includes('marina') && dest.includes('south')) return 'MSP';
  
  // Generic route determination
  if (name.includes('ferry') || name.includes('passenger')) return 'FERRY-ROUTE';
  
  return destination;
};

// Helper function to categorize vessels
const categorizeVessel = (shipType) => {
  if (!shipType) return 'Unknown';
  
  const type = shipType.toLowerCase();
  
  if (type.includes('passenger') || type.includes('ferry')) return 'Ferry';
  if (type.includes('cargo') || type.includes('container')) return 'Cargo';
  if (type.includes('tanker')) return 'Tanker';
  if (type.includes('tug')) return 'Tug';
  if (type.includes('pilot')) return 'Pilot';
  if (type.includes('pleasure') || type.includes('yacht')) return 'Recreational';
  if (type.includes('fishing')) return 'Fishing';
  
  return shipType;
};

// Function to get current vessel positions
export const getCurrentVesselPositions = () => {
  // Group by vessel ID and get the latest position for each vessel
  const latestPositions = {};
  
  vesselMovementData.forEach(record => {
    const vesselId = record.vesselId;
    const recordTime = new Date(record.timestamp);
    
    if (!latestPositions[vesselId] || 
        new Date(latestPositions[vesselId].timestamp) < recordTime) {
      latestPositions[vesselId] = record;
    }
  });
  
  return Object.values(latestPositions);
};

// Function to get today's vessel data (for July 20, 2025)
export const getTodaysVesselData = () => {
  const today = new Date('2025-07-20'); // Today's date
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  console.log('Filtering for today:', todayStart, 'to', todayEnd);
  console.log('Total vessel records available:', vesselMovementData.length);
  
  const todaysData = vesselMovementData.filter(record => {
    const recordDate = new Date(record.timestamp);
    const isToday = recordDate >= todayStart && recordDate < todayEnd;
    if (isToday) {
      console.log('Found today record:', record.name, record.timestamp);
    }
    return isToday;
  });
  
  console.log(`Found ${todaysData.length} records for today`);
  
  // If no data for today, fallback to the most recent data available
  let dataToUse = todaysData;
  if (todaysData.length === 0) {
    console.log('No data for today, using most recent available data');
    // Sort all data by timestamp and take the most recent entries
    const sortedData = [...vesselMovementData].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Take the last 24 hours of data or all available data
    const cutoffTime = new Date(Date.now() - (24 * 60 * 60 * 1000));
    dataToUse = sortedData.filter(record => 
      new Date(record.timestamp) >= cutoffTime
    );
    
    if (dataToUse.length === 0) {
      // If still no data, just take all available data
      dataToUse = sortedData.slice(0, 10); // Take first 10 records
    }
    
    console.log(`Using ${dataToUse.length} recent records as fallback`);
  }
  
  // Group by vessel ID and get the latest position for each vessel
  const latestPositions = {};
  
  dataToUse.forEach(record => {
    const vesselId = record.vesselId;
    const recordTime = new Date(record.timestamp);
    
    if (!latestPositions[vesselId] || 
        new Date(latestPositions[vesselId].timestamp) < recordTime) {
      latestPositions[vesselId] = record;
    }
  });
  
  const result = Object.values(latestPositions);
  console.log(`Returning ${result.length} unique vessels`);
  console.log('Vessel details:', result.map(v => ({name: v.name, lat: v.latitude, lng: v.longitude, time: v.timestamp})));
  return result;
};

// Function to get all available vessel data (fallback when no today's data)
export const getAllAvailableVesselData = () => {
  console.log('Getting all available vessel data');
  console.log('Total records:', vesselMovementData.length);
  
  if (vesselMovementData.length === 0) {
    console.log('No vessel data loaded, returning empty array');
    return [];
  }
  
  // Group by vessel ID and get the latest position for each vessel
  const latestPositions = {};
  
  vesselMovementData.forEach(record => {
    const vesselId = record.vesselId;
    const recordTime = new Date(record.timestamp);
    
    if (!latestPositions[vesselId] || 
        new Date(latestPositions[vesselId].timestamp) < recordTime) {
      latestPositions[vesselId] = record;
    }
  });
  
  const result = Object.values(latestPositions);
  console.log(`Returning ${result.length} vessels from all available data`);
  return result;
};

// Function to get vessels for a specific date
export const getVesselsForDate = (targetDate) => {
  const dateStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const dateEnd = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1);
  
  const dateData = vesselMovementData.filter(record => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= dateStart && recordDate < dateEnd;
  });
  
  // Group by vessel ID and get the latest position for each vessel on that date
  const latestPositions = {};
  
  dateData.forEach(record => {
    const vesselId = record.vesselId;
    const recordTime = new Date(record.timestamp);
    
    if (!latestPositions[vesselId] || 
        new Date(latestPositions[vesselId].timestamp) < recordTime) {
      latestPositions[vesselId] = record;
    }
  });
  
  return Object.values(latestPositions);
};

// Function to get vessel movement history for a specific vessel
export const getVesselHistory = (vesselId, hoursBack = 24) => {
  const cutoffTime = new Date(Date.now() - (hoursBack * 60 * 60 * 1000));
  
  return vesselMovementData
    .filter(record => 
      record.vesselId === vesselId && 
      new Date(record.timestamp) >= cutoffTime
    )
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

// Function to get vessels by route
export const getVesselsByRoute = (routeName) => {
  const currentPositions = getCurrentVesselPositions();
  return currentPositions.filter(vessel => vessel.route === routeName);
};

// Function to get vessels within a geographic area
export const getVesselsInArea = (centerLat, centerLng, radiusKm = 5) => {
  const currentPositions = getCurrentVesselPositions();
  
  return currentPositions.filter(vessel => {
    const distance = calculateDistance(
      centerLat, centerLng,
      vessel.latitude, vessel.longitude
    );
    return distance <= radiusKm;
  });
};

// Utility function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Function to simulate real-time updates (if needed for testing)
export const simulateVesselMovement = (vesselId, updateCallback) => {
  const vessel = getCurrentVesselPositions().find(v => v.vesselId === vesselId);
  if (!vessel) return null;

  // Simulate movement every 30 seconds
  const interval = setInterval(() => {
    // Simple simulation: move vessel slightly based on heading
    const speedKnots = vessel.speed || 10;
    const speedKmh = speedKnots * 1.852;
    const distanceKm = speedKmh / 120; // Distance moved in 30 seconds
    
    const headingRad = (vessel.heading || 0) * Math.PI / 180;
    const deltaLat = (distanceKm / 111.32) * Math.cos(headingRad);
    const deltaLng = (distanceKm / (111.32 * Math.cos(vessel.latitude * Math.PI / 180))) * Math.sin(headingRad);
    
    vessel.latitude += deltaLat;
    vessel.longitude += deltaLng;
    vessel.timestamp = new Date().toISOString();
    
    updateCallback(vessel);
  }, 30000);

  return interval; // Return interval ID so it can be cleared
};

// Function to get vessels by ship type
export const getVesselsByShipType = (shipType) => {
  const currentPositions = getCurrentVesselPositions();
  return currentPositions.filter(vessel => 
    vessel.vesselCategory.toLowerCase().includes(shipType.toLowerCase()) ||
    vessel.shipType.toLowerCase().includes(shipType.toLowerCase())
  );
};

// Function to get ferry vessels only
export const getFerryVessels = () => {
  return getVesselsByShipType('ferry');
};

// Function to get vessel details by MMSI
export const getVesselByMMSI = (mmsi) => {
  return getCurrentVesselPositions().find(vessel => vessel.vesselId == mmsi);
};

// Function to get vessel details by IMO
export const getVesselByIMO = (imo) => {
  return getCurrentVesselPositions().find(vessel => vessel.imo == imo);
};

// Function to get vessels by AIS status
export const getVesselsByAISStatus = (aisStatus) => {
  const currentPositions = getCurrentVesselPositions();
  return currentPositions.filter(vessel => vessel.aisStatus === aisStatus);
};

// Function to get vessel dimensions
export const getVesselDimensions = (vesselId) => {
  const vessel = getCurrentVesselPositions().find(v => v.vesselId === vesselId);
  if (!vessel) return null;
  
  return {
    length: vessel.length,
    beam: vessel.beam,
    draught: vessel.draught,
    // Calculate total vessel outline from AIS data
    totalLength: vessel.aisA + vessel.aisB,
    totalBeam: vessel.aisC + vessel.aisD,
    vesselName: vessel.name
  };
};

// Function to analyze vessel movement patterns
export const analyzeVesselMovement = (vesselId, hoursBack = 24) => {
  const history = getVesselHistory(vesselId, hoursBack);
  if (history.length < 2) return null;

  const speeds = history.map(h => h.sog).filter(s => s > 0);
  const headings = history.map(h => h.heading).filter(h => h >= 0);
  
  return {
    vesselId,
    totalPositions: history.length,
    timeSpan: hoursBack,
    averageSpeed: speeds.length > 0 ? (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2) : 0,
    maxSpeed: speeds.length > 0 ? Math.max(...speeds) : 0,
    averageHeading: headings.length > 0 ? (headings.reduce((a, b) => a + b, 0) / headings.length).toFixed(0) : 0,
    firstPosition: history[0],
    lastPosition: history[history.length - 1],
    distanceTraveled: calculateTotalDistance(history)
  };
};

// Function to calculate total distance traveled
const calculateTotalDistance = (positions) => {
  let totalDistance = 0;
  for (let i = 1; i < positions.length; i++) {
    const dist = calculateDistance(
      positions[i-1].latitude, positions[i-1].longitude,
      positions[i].latitude, positions[i].longitude
    );
    totalDistance += dist;
  }
  return totalDistance.toFixed(2);
};

// Function to get vessel traffic summary
export const getVesselTrafficSummary = () => {
  const currentVessels = getCurrentVesselPositions();
  const summary = {
    totalVessels: currentVessels.length,
    byCategory: {},
    byStatus: {},
    byFlag: {},
    averageSpeed: 0,
    activeVessels: 0
  };

  let totalSpeed = 0;
  let speedCount = 0;

  currentVessels.forEach(vessel => {
    // Count by category
    summary.byCategory[vessel.vesselCategory] = (summary.byCategory[vessel.vesselCategory] || 0) + 1;
    
    // Count by status
    summary.byStatus[vessel.status] = (summary.byStatus[vessel.status] || 0) + 1;
    
    // Count by flag
    if (vessel.flag) {
      summary.byFlag[vessel.flag] = (summary.byFlag[vessel.flag] || 0) + 1;
    }
    
    // Calculate average speed
    if (vessel.sog > 0) {
      totalSpeed += vessel.sog;
      speedCount++;
      summary.activeVessels++;
    }
  });

  summary.averageSpeed = speedCount > 0 ? (totalSpeed / speedCount).toFixed(2) : 0;

  return summary;
};

// Auto-refresh functionality
let autoRefreshInterval = null;
let refreshCallback = null;

// Function to start auto-refresh every 15 seconds
export const startAutoRefresh = (callback, intervalMs = 30000) => {
  // Stop any existing interval
  stopAutoRefresh();
  
  // Store the callback for use
  refreshCallback = callback;
  
  console.log(`Starting auto-refresh every ${intervalMs / 1000} seconds`);
  
  // Set up the interval
  autoRefreshInterval = setInterval(async () => {
    try {
      console.log('Auto-refresh: Reloading vessel data...');
      
      // Reload vessel data using dummy data
      await loadVesselMovementData(VESSEL_DATA_PATH, true);
      
      // Get the latest vessel data
      const vessels = getTodaysVesselData();
      
      // Call the provided callback with the new data
      if (refreshCallback && typeof refreshCallback === 'function') {
        refreshCallback(vessels);
      }
      
      console.log(`Auto-refresh: Updated ${vessels.length} vessels`);
    } catch (error) {
      console.error('Error during auto-refresh:', error);
    }
  }, intervalMs);
  
  return autoRefreshInterval;
};

// Function to stop auto-refresh
export const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    console.log('Stopping auto-refresh');
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
  refreshCallback = null;
};

// Function to check if auto-refresh is active
export const isAutoRefreshActive = () => {
  return autoRefreshInterval !== null;
};

// Function to get current refresh interval
export const getRefreshInterval = () => {
  return autoRefreshInterval;
};

// Function to manually trigger a refresh (useful for testing)
export const manualRefresh = async () => {
  try {
    console.log('Manual refresh: Reloading vessel data...');
    
    // Reload vessel data using dummy data
    await loadVesselMovementData(VESSEL_DATA_PATH, true);
    
    // Get the latest vessel data
    const vessels = getTodaysVesselData();
    
    // Call the refresh callback if available
    if (refreshCallback && typeof refreshCallback === 'function') {
      refreshCallback(vessels);
    }
    
    console.log(`Manual refresh: Updated ${vessels.length} vessels`);
    return vessels;
  } catch (error) {
    console.error('Error during manual refresh:', error);
    throw error;
  }
};

// Expected CSV format comment update
/*
Expected CSV format with your columns:
Local Time,UTC Time,MMSI,IMO,Name,Call Sign,Ship Type,Length,Beam,Draught,SOG,COG,Heading,Latitude,Longitude,Destination,Status,Flag,AIS Ship Type,AIS Status,AIS A,AIS B,AIS C,AIS D
2024-01-20 08:00:00,2024-01-20 08:00:00 UTC,123456789,1234567,SAMPLE VESSEL,ABCD,Passenger Ship,50.5,12.2,3.1,12.5,045,047,1.2966,103.8078,Kusu Island,Under way using engine,SG,Passenger Ship,Under way using engine,25.5,25.0,6.2,6.0

Auto-refresh functionality:
- startAutoRefresh(callback, intervalMs): Start auto-refresh with custom callback and interval
- stopAutoRefresh(): Stop the auto-refresh
- manualRefresh(): Manually trigger a refresh
- isAutoRefreshActive(): Check if auto-refresh is currently running

The app now uses dummy data by default for smooth 5-second interval simulation.
Dummy data covers time range 23:25-23:35 with 5-second intervals.
Auto-refresh is set to 30 seconds by default in MapView component.
*/