import { useSystemStatus } from "@/queries/cryptoQueries";
import React from "react";

const IconTradingEngine: React.FC = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.3332 10.5H14.9998L12.4998 18L7.49984 3L4.99984 10.5H1.6665"
      stroke="var(--color-foreground)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconRiskManagement: React.FC = () => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.00016 17.8333C8.00016 17.8333 14.6668 14.5 14.6668 9.49996V3.66663L8.00016 1.16663L1.3335 3.66663V9.49996C1.3335 14.5 8.00016 17.8333 8.00016 17.8333Z"
      stroke="var(--color-foreground)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconDataFeeds: React.FC = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 7.16663C14.1421 7.16663 17.5 6.04734 17.5 4.66663C17.5 3.28591 14.1421 2.16663 10 2.16663C5.85786 2.16663 2.5 3.28591 2.5 4.66663C2.5 6.04734 5.85786 7.16663 10 7.16663Z"
      stroke="var(--color-foreground)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 10.5C17.5 11.8833 14.1667 13 10 13C5.83333 13 2.5 11.8833 2.5 10.5"
      stroke="var(--color-foreground)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.5 4.66663V16.3333C2.5 17.7166 5.83333 18.8333 10 18.8333C14.1667 18.8333 17.5 17.7166 17.5 16.3333V4.66663"
      stroke="var(--color-foreground)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCompliance: React.FC = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.6665 9.49996L8.77874 11.401C9.13832 11.7246 9.697 11.675 9.994 11.2932L13.3332 6.99996M9.99984 17.8333C14.6022 17.8333 18.3332 14.1023 18.3332 9.49996C18.3332 4.89759 14.6022 1.16663 9.99984 1.16663C5.39747 1.16663 1.6665 4.89759 1.6665 9.49996C1.6665 14.1023 5.39747 17.8333 9.99984 17.8333Z"
      stroke="var(--color-foreground)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconOperationalCheckmark: React.FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.28264 8.46749C7.14141 8.32627 6.94987 8.24693 6.75014 8.24693C6.55041 8.24693 6.35887 8.32627 6.21764 8.46749C6.07641 8.60872 5.99707 8.80027 5.99707 8.99999C5.99707 9.19972 6.07641 9.39127 6.21764 9.53249L8.46764 11.7825C8.53772 11.852 8.62083 11.907 8.71221 11.9443C8.80359 11.9816 8.90143 12.0006 9.00014 12C9.10281 11.9967 9.20372 11.9724 9.29661 11.9286C9.3895 11.8847 9.47239 11.8222 9.54014 11.745L14.7901 5.74499C14.9114 5.59449 14.9698 5.403 14.9533 5.21046C14.9368 5.01791 14.8466 4.83917 14.7015 4.7115C14.5564 4.58383 14.3677 4.51709 14.1746 4.5252C13.9815 4.5333 13.799 4.61562 13.6651 4.75499L9.00014 10.155L7.28264 8.46749Z"
      fill="var(--piechart-c)"
    />
    <path
      d="M15.7501 8.25C15.5512 8.25 15.3604 8.32902 15.2198 8.46967C15.0791 8.61032 15.0001 8.80109 15.0001 9C15.0001 10.5913 14.368 12.1174 13.2427 13.2426C12.1175 14.3679 10.5914 15 9.0001 15C7.81517 14.9995 6.65693 14.6481 5.67143 13.9902C4.68593 13.3322 3.9173 12.3972 3.46246 11.3031C3.00763 10.2089 2.88696 9.00457 3.11567 7.84192C3.34438 6.67927 3.91223 5.61036 4.7476 4.77C5.30313 4.20704 5.96536 3.76053 6.69555 3.45661C7.42573 3.15269 8.2092 2.99746 9.0001 3C9.47969 3.003 9.95752 3.05833 10.4251 3.165C10.523 3.19527 10.626 3.20517 10.7278 3.1941C10.8296 3.18303 10.9281 3.15122 11.0172 3.10063C11.1062 3.05005 11.184 2.98175 11.2456 2.89997C11.3073 2.81818 11.3515 2.72463 11.3756 2.62509C11.3998 2.52554 11.4032 2.42211 11.3858 2.32117C11.3685 2.22024 11.3306 2.12393 11.2745 2.03819C11.2185 1.95246 11.1455 1.8791 11.06 1.82266C10.9746 1.76621 10.8785 1.72787 10.7776 1.71C10.195 1.57293 9.59864 1.50248 9.0001 1.5C7.51836 1.5077 6.07209 1.95414 4.84383 2.78299C3.61556 3.61184 2.66033 4.78595 2.09869 6.15715C1.53705 7.52835 1.39417 9.03519 1.68808 10.4875C1.98199 11.9398 2.69951 13.2726 3.7501 14.3175C5.14262 15.7107 7.03034 16.4954 9.0001 16.5C10.9892 16.5 12.8969 15.7098 14.3034 14.3033C15.7099 12.8968 16.5001 10.9891 16.5001 9C16.5001 8.80109 16.4211 8.61032 16.2804 8.46967C16.1398 8.32902 15.949 8.25 15.7501 8.25Z"
      fill="var(--piechart-c)"
    />
  </svg>
);

const IconAllSystemsCheckmark: React.FC = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.6665 9.49996L8.77874 11.401C9.13832 11.7246 9.697 11.675 9.994 11.2932L13.3332 6.99996M9.99984 17.8333C14.6022 17.8333 18.3332 14.1023 18.3332 9.49996C18.3332 4.89759 14.6022 1.16663 9.99984 1.16663C5.39747 1.16663 1.6665 4.89759 1.6665 9.49996C1.6665 14.1023 5.39747 17.8333 9.99984 17.8333Z"
      stroke="var(--piechart-c)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
