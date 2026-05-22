"use client";

import { useState } from "react";
import FilterPanel from "./FilterPanel";
import RightPanel from "./RightPanel";
import CollectionPanel from "./CollectionPanel";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa";

export default function Main() {
  const [showFilter, setShowFilter] = useState(true);
  const [showRight, setShowRight] = useState(true);

  return (
    <div className="flex items-stretch w-full h-full overflow-hidden relative">
      {/* Filter Panel + Toggle */}
      <div
        className={`relative flex-shrink-0 flex ${!showFilter ? "w-3" : ""}`}
      >
        <div
          className={`overflow-hidden [transition:max-width_700ms_ease-in] ${showFilter ? "max-w-[192px]" : "max-w-0"}`}
        >
          <FilterPanel />
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-simpson-dark border border-simpson-gray/20 dark:border-simpson-dark w-6 h-10 flex items-center justify-center shadow-md cursor-pointer hover:bg-simpson-orange hover:text-white hover:border-simpson-orange transition-all duration-200 text-simpson-gray
            ${showFilter ? "right-0 rounded-l-lg" : "-right-3 rounded-r-lg"}`}
        >
          {showFilter ? <FaAngleLeft size={14} /> : <FaAngleRight size={14} />}
        </button>
      </div>

      {/* Collection */}
      <CollectionPanel showFilter={showFilter} showRight={showRight} />

      {/* Right Panel + Toggle */}
      <div className={`relative flex-shrink-0 flex ${!showRight ? "w-3" : ""}`}>
        <button
          onClick={() => setShowRight(!showRight)}
          className={`absolute top-1/2 -translate-y-1/2 z-20 bg-white dark:bg-simpson-dark border border-simpson-gray/20 dark:border-simpson-dark w-6 h-10 flex items-center justify-center shadow-md cursor-pointer hover:bg-simpson-orange hover:text-white hover:border-simpson-orange transition-all duration-200 text-simpson-gray
            ${showRight ? "left-0 rounded-r-lg" : "-left-3 rounded-l-lg"}`}
        >
          {showRight ? <FaAngleRight size={14} /> : <FaAngleLeft size={14} />}
        </button>
        <div
          className={`overflow-hidden [transition:max-width_700ms_ease-in] ${showRight ? "max-w-[192px]" : "max-w-0"}`}
        >
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
