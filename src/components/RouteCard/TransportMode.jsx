const TransportMode = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-500 text-white shadow-sm"
          : "bg-white text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default TransportMode;
