import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pen, X } from "lucide-react";
import TotalNavPanel from "@/pages/Home/TotalNavPanel/components/TotalNavPanel";
import AssetPerformancePanel from "@/pages/Home/components/AssetPerformancePanel";
import SystemStatus from "@/pages/Home/components/SystemStatus";
import TotalNavForm from "./components/TotalNavForm";
import SystemStatusForm from "./components/SystemStatusForm";
import DailyReport from "../Home/components/DailyReport";
import AssetPerformanceForm from "./components/AssetPerformanceForm";

export default function DataForms() {
  const [isEditingTotalNav, setIsEditingTotalNav] = useState(false);
  const [isEditingAssetPerformance, setIsEditingAssetPerformance] =
    useState(false);
  const [isEditingSystemStatus, setIsEditingSystemStatus] = useState(false);

  return (
    <div className="bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard - Manage Data</h1>
        </div>

        <div className="space-y-8">
          {/* Total NAV*/}
          <div className="">
            <div className="mb-2 flex justify-between items-center">
              <h3>Total NAV Panel Management</h3>
              <Button
                variant={"outline"}
                onClick={() => setIsEditingTotalNav(!isEditingTotalNav)}
              >
                {isEditingTotalNav ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pen className="h-4 w-4 mr-1" />
                    Edit
                  </>
                )}
              </Button>
            </div>
            {isEditingTotalNav ? <TotalNavForm /> : <TotalNavPanel />}
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* Asset Performance Panel Management */}
            <div className="w-full md:w-[75%]">
              <div className="mb-2 flex justify-between items-center">
                <h3>Asset Performance Management</h3>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    setIsEditingAssetPerformance(!isEditingAssetPerformance)
                  }
                >
                  {isEditingAssetPerformance ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Pen className="h-4 w-4 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
              {isEditingAssetPerformance ? (
                <AssetPerformanceForm />
              ) : (
                <AssetPerformancePanel />
              )}
            </div>

            {/* Daily Report Management */}
            <div className="w-full md:w-[25%]">
              <div className="mb-2 flex justify-between items-center">
                <h3>Daily Report Management</h3>
              </div>
              <DailyReport fromAdmin />
            </div>
          </div>

          {/* System Status Management */}
          <div className="pt-8">
            <div className="mb-2 flex justify-between items-center ">
              <h3>System Status Management</h3>
              <Button
                variant={"outline"}
                onClick={() => setIsEditingSystemStatus(!isEditingSystemStatus)}
              >
                {isEditingSystemStatus ? (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pen className="h-4 w-4 mr-1" />
                    Edit
                  </>
                )}
              </Button>
            </div>
            {isEditingSystemStatus ? (
              <SystemStatusForm />
            ) : (
              <Card className="h-full">
                <CardContent>
                  <SystemStatus />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
