import { ChevronDown, Bell, Search } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-[#F6F8FA] border-b px-4 py-3 flex items-center justify-between overflow-hidden">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Warehouse */}
        <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 cursor-pointer text-sm whitespace-nowrap">
          <span className="font-medium">WH-NYC-01</span>
          <ChevronDown size={16} />
        </div>

        {/* Company */}
        <div className="hidden md:flex items-center gap-2 border rounded-md px-3 py-1.5 cursor-pointer text-sm whitespace-nowrap">
          <span className="font-medium">Acme Corp</span>
          <ChevronDown size={16} />
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex-1 mx-2 md:mx-4 lg:mx-6 min-w-0">
        <div className="relative max-w-md mx-auto">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search SKU, Order, GRN, Pallet..."
            className="w-full bg-[#F1F3F5] border border-gray-200 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Notification */}
        <button className="relative">
          <Bell size={20} />
        </button>

        {/* Avatar */}
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;
