import React from "react";
import FerryScheduleTable from "../components/FerryScheduleTable";

const FerryTimingsPage = ({
  selectedFerryTab,
  setSelectedFerryTab,
  ferryTimings,
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Ferry Timings</h1>
      </div>

      {/* Ferry Location Tabs */}
      <div className="bg-white px-6 py-4 shadow-sm">
        <div className="flex space-x-4">
          {["MSP", "Lazarus", "Kusu"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFerryTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedFerryTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Ferry Schedule Table */}
      <div className="p-6">
        <FerryScheduleTable ferryTimings={ferryTimings} />
      </div>
    </div>
  );
};

export default FerryTimingsPage;
