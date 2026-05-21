import FilterPanel from "./filterPanel";
import RightPanel from "./rightPanel";

export default function Main() {
  return (
<div className="flex items-stretch h-full w-full overflow-hidden">      
    <FilterPanel />
      <div className="flex-1 h-full overflow-y-auto" />
      <RightPanel />
</div>
  );
}