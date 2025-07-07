export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "on time":
      return "bg-green-100 text-green-800";
    case "delayed":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const filterLocations = (locations, query) => {
  if (!query) return locations;

  return locations.filter((location) =>
    location.toLowerCase().includes(query.toLowerCase())
  );
};
