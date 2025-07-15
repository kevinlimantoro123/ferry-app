import { Navigation, List } from "lucide-react";

const BottomNavigation = ({ currentPage, setCurrentPage }) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around py-3">
        <button
          onClick={() =>
            currentPage !== "starting" &&
            currentPage !== "route" &&
            setCurrentPage("starting")
          }
          className={`flex flex-col items-center space-y-1 ${
            currentPage === "starting" || currentPage === "route"
              ? "text-black font-semibold"
              : "text-gray-400"
          } ${
            currentPage === "starting" || currentPage === "route"
              ? "cursor-default"
              : "cursor-pointer"
          }`}
        >
          <Navigation className="h-6 w-6" />
          <span className="text-xs">Route</span>
        </button>
        <button
          onClick={() => setCurrentPage("ferry")}
          className={`flex flex-col items-center space-y-1 ${
            currentPage === "ferry"
              ? "text-black font-semibold"
              : "text-gray-400"
          }`}
        >
          <List className="h-6 w-6" />
          <span className="text-xs">Ferry Times</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
