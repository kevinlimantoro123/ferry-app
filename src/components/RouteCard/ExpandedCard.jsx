const ExpandedCard = ({ routeData }) => {
  if (!routeData?.ferries) return null;

  // Skip the first ferry
  const remainingFerries = routeData.ferries.slice(1);
  if (remainingFerries.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="px-1 text-xl font-semibold text-gray-900 mb-2">
        Additional Ferry Departures
      </h4>
      <div className="space-y-4">
        {remainingFerries.map((ferry, index) => (
          <div key={index} className="bg-white rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-medium text-black">
                {ferry.destination}
              </span>
            </div>
            <div className="flex space-x-4">
              {ferry.times.map((time, index) => (
                <span
                  key={index}
                  className={`text-md rounded ${
                    index === 0 ? "text-black font-medium" : "text-gray-500"
                  }`}
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandedCard;
