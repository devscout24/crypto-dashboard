import React from "react";
import {
  IconAllSystemsCheckmark,
  IconCompliance,
  IconDataFeeds,
  IconOperationalCheckmark,
  IconRiskManagement,
  IconTradingEngine,
} from "../icons";
import { useSystemStatus } from "@/queries/systemStatusQueries";

interface SystemItemProps {
  icon: React.ReactNode;
  name: string;
  status: string;
}

const getColorClass = (status: string) => {
  if (status.startsWith("✅")) {
    return "bg-green-600/10 text-green-600 outline-green-600";
  } else if (status.startsWith("🔄")) {
    return "bg-blue-600/10 text-blue-600 outline-blue-600";
  } else if (status.startsWith("⚙️")) {
    return "bg-yellow-600/10 text-yellow-600 outline-yellow-600";
  } else {
    return "bg-red-600/10 text-red-600 outline-red-600";
  }
};

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => (
  <div
    className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${getColorClass(
      status
    )}`}
  >
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
  console.log({ data });

  // Dummy data
  const systemItems: SystemItemProps[] = [
    {
      name: "Allocations A–G",
      icon: <IconTradingEngine />,
      status: "✅ Fully Compounding",
    },
    {
      name: "Override Layer",
      icon: <IconRiskManagement />,
      status: "✅ Engaged",
    },
    {
      name: "Surplus Redistribution",
      icon: <IconDataFeeds />,
      status: "✅ Active – Dual-Pool Trigger (D & F)",
    },
    {
      name: "Passive Carry Stack",
      icon: <IconCompliance />,
      status: "✅ Functional",
    },
    {
      name: "Syndicate Tiering",
      icon: <IconAllSystemsCheckmark />,
      status: "🔄 Weight Adjustment Phase",
    },
    {
      name: "Trust Layer (LIE)",
      icon: <IconOperationalCheckmark />,
      status: "⚙️ Custody Approval Pending",
    },
    {
      name: "Compliance Layer",
      icon: <IconCompliance />,
      status: "✅ All Systems Aligned",
    },
  ];

  // Determine if all systems are operational
  const allSystemsOperational = systemItems.every((item) =>
    item.status.startsWith("✅")
  );

  // Format last_updated timestamp
  const lastUpdated = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="lg:h-64 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--color-foreground)" }}
        >
          System Status & Infrastructure
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
