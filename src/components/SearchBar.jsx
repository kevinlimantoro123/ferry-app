import { Search } from "lucide-react";

const SearchBar = ({ value, onChange, placeholder = "Search...", onClick }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={onClick}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm cursor-pointer"
      />
    </div>
  );
};

export default SearchBar;
