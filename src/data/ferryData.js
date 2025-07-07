// Mock ferry data - in production, this would come from your ferryService.js
export const FERRY_SCHEDULES = {
  MSP: [
    {
      ferry: "Nº 112",
      destination: "Lazarus",
      eta: "5 min",
      status: "On time",
    },
    {
      ferry: "Nº 24",
      destination: "Sisters",
      eta: "10 min",
      status: "Delayed",
    },
    { ferry: "Nº 6", destination: "Lazarus", eta: "20 min", status: "On time" },
    {
      ferry: "Nº 8",
      destination: "Sisters",
      eta: "25 min",
      status: "Cancelled",
    },
  ],
  Lazarus: [
    { ferry: "Nº 3", destination: "MSP", eta: "8 min", status: "On time" },
    {
      ferry: "Nº 15",
      destination: "Sisters",
      eta: "12 min",
      status: "On time",
    },
    { ferry: "Nº 21", destination: "MSP", eta: "30 min", status: "Delayed" },
  ],
  Kusu: [
    { ferry: "Nº 7", destination: "MSP", eta: "6 min", status: "On time" },
    {
      ferry: "Nº 14",
      destination: "Lazarus",
      eta: "15 min",
      status: "On time",
    },
    { ferry: "Nº 22", destination: "MSP", eta: "25 min", status: "On time" },
  ],
};

// Mock locations - in production, this would integrate with Google Places API
export const LOCATIONS = [
  "Sentosa",
  "Lazarus Island",
  "Sisters Island",
  "Kusu Island",
  "St. John Island",
  "Clarke Quay",
  "Marina Bay",
  "Orchard Road",
  "Changi Airport",
];
