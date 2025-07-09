const TransportMode = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-white text-black font-semibold shadow-sm"
          : "bg-zinc-200 text-gray-500 hover:bg-gray-50"
      }`}
    >
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default TransportMode;
