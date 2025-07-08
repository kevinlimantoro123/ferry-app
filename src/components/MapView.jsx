const MapView = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-200">
      {/* Mock map elements */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow-sm">
        <span className="text-xs text-gray-600">Kent Ridge</span>
      </div>

      <div className="absolute top-16 right-8 bg-blue-500 text-white rounded-full p-2 shadow-sm">
        <span className="text-xs font-medium">A</span>
      </div>

      <div className="absolute bottom-32 left-8 bg-white rounded-lg p-2 shadow-sm">
        <span className="text-xs text-gray-600">Singapore Botanic Gardens</span>
      </div>

      <div className="absolute bottom-40 right-12 bg-blue-500 text-white rounded-full p-2 shadow-sm">
        <span className="text-xs font-medium">B</span>
      </div>

      {/* Route line simulation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d="M 80 200 Q 200 150 320 300 Q 400 350 500 250"
          stroke="#3B82F6"
          strokeWidth="4"
          fill="none"
          strokeDasharray="10,5"
        />
      </svg>

      {/* Mock location markers */}
      <div className="absolute bottom-44 left-12 text-xs bg-white px-2 py-1 rounded shadow-sm">
        <span className="text-gray-600">16 min</span>
      </div>

      <div className="absolute bottom-44 right-16 text-xs bg-white px-2 py-1 rounded shadow-sm">
        <span className="text-gray-600">Tolls</span>
      </div>
    </div>
  );
};

export default MapView;
