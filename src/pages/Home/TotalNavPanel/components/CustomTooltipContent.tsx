/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0]?.value;
    if (value === undefined || value === null) return null;

    return (
      <div className="bg-border px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-sm font-bold text-foreground">
            $
            {value.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="text-[10px] text-foreground/70">
            {new Date(label).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            {payload[0]?.payload?.time || new Date(label).toLocaleTimeString()},{" "}
            {new Date(label).getFullYear()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export default CustomTooltipContent;
