import { useSystemStatus } from "@/queries/cryptoQueries";
import React from "react";
import {
  IconAllSystemsCheckmark,
  IconCompliance,
  IconDataFeeds,
  IconOperationalCheckmark,
  IconRiskManagement,
  IconTradingEngine,
} from "../icons";

interface SystemItemProps {
  icon: React.ReactNode;
  name: string;
  status: string;
}

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => (
  <div
    className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
      status === "On" ||
      status === "Active" ||
      status === "Running" ||
      status === "Stable"
        ? "bg-green-600/10 text-green-600 outline-green-600"
        : "bg-red-600/10 text-red-600 outline-red-600"
    }`}
  >
    <IconOperationalCheckmark />
    <span>{status}</span>
  </div>
);

const SystemItem: React.FC<SystemItemProps> = ({ icon, name }) => (
  <div className="flex flex-1 items-center justify-start gap-3">
    <div
      className="flex h-5 w-5 items-center justify-center"
      style={{ color: "var(--color-foreground)" }}
    >
      {icon}
    </div>
    <span
      className="text-sm font-medium"
      style={{ color: "var(--color-foreground)" }}
    >
      {name}
    </span>
  </div>
);

export default function SystemStatus() {
  const { data } = useSystemStatus();

  // Map API visual_flags to system items
  const systemItems: SystemItemProps[] = [
    {
      name: "Smart Routing",
      icon: <IconTradingEngine />,
      status: data?.data?.visual_flags?.["Smart Routing"] || "Unknown",
    },
    {
      name: "Hedging Operational",
      icon: <IconRiskManagement />,
      status: data?.data?.visual_flags?.["Hedging Operational"] || "Unknown",
    },
    {
      name: "Stablecoin Yield Layer",
      icon: <IconDataFeeds />,
      status: data?.data?.visual_flags?.["Stablecoin Yield Layer"] || "Unknown",
    },
    {
      name: "System Sync",
      icon: <IconCompliance />,
      status: data?.data?.visual_flags?.["System Sync"] || "Unknown",
    },
  ];

  // Determine if all systems are operational
  const allSystemsOperational = systemItems.every(
    (item) =>
      item.status === "On" ||
      item.status === "Active" ||
      item.status === "Running" ||
      item.status === "Stable"
  );

  // Format last_updated timestamp
  const lastUpdated = data?.data?.last_updated
    ? new Date(data.data.last_updated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Unknown";

  return (
    <div className="lg:h-64 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          System Status
        </h2>
        <span
          className="text-xs"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          Last check: {lastUpdated}
        </span>
      </div>

      {/* Status Grid */}
      <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
        {systemItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <SystemItem
              icon={item.icon}
              name={item.name}
              status={item.status}
            />
            <StatusIndicator status={item.status} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className="mt-auto border-t pt-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex items-center gap-2 text-sm font-medium"
          style={{ color: "var(--piechart-c)" }}
        >
          <IconAllSystemsCheckmark />
          <span>
            {allSystemsOperational
              ? "All systems operational - Portfolio monitoring active"
              : "Some systems experiencing issues - Portfolio monitoring may be affected"}
          </span>
        </div>
      </div>
    </div>
  );
}
