import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X, ChevronDown, Plus, Minus } from "lucide-react";
import { useAllocations } from "@/queries/cryptoQueries";
import {
  useAssignAllocation,
  useUnassignAllocation,
  useUserAllocations,
} from "@/queries/userQueries";
import type { TAllocation, TUserData } from "@/types";

export default function AssignUnassignToAllocation({
  userData,
}: {
  userData: TUserData;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAllocations, setSelectedAllocations] = useState<string[]>([]);
  const [pendingChanges, setPendingChanges] = useState<{
    toAdd: string[];
    toRemove: string[];
  }>({ toAdd: [], toRemove: [] });

  const { data: allAllocations, isLoading: allocationsLoading } =
    useAllocations();
  const { data: userAllocations, isLoading: userAllocationsLoading } =
    useUserAllocations(userData.id);
  const { mutateAsync: assignUserAsync, isPending: isAssigning } =
    useAssignAllocation();
  const { mutateAsync: unassignUserAsync, isPending: isUnassigning } =
    useUnassignAllocation();

  // Initialize selected allocations when user allocations are loaded
  useEffect(() => {
    if (userAllocations?.data) {
      const userAllocationIds = userAllocations.data.map(
        (allocation: TAllocation) => allocation.id
      );
      setSelectedAllocations(userAllocationIds);
    }
  }, [userAllocations]);

  // Get current user allocation IDs
  const currentUserAllocations =
    userAllocations?.data?.map((allocation: TAllocation) => allocation.id) ||
    [];

  // Handle checkbox change
  const handleAllocationChange = (allocationId: string, checked: boolean) => {
    const newSelectedAllocations = checked
      ? [...selectedAllocations, allocationId]
      : selectedAllocations.filter((id) => id !== allocationId);

    setSelectedAllocations(newSelectedAllocations);

    // Calculate pending changes
    const toAdd = newSelectedAllocations.filter(
      (id) => !currentUserAllocations.includes(id)
    );
    const toRemove = currentUserAllocations.filter(
      (id: string) => !newSelectedAllocations.includes(id)
    );

    setPendingChanges({ toAdd, toRemove });
  };

  // Apply changes
  const handleApplyChanges = async () => {
    console.log({ userData });
    try {
      // Process additions
      await Promise.all(
        pendingChanges.toAdd.map((allocationId) =>
          assignUserAsync({ userId: userData.id, allocationId })
        )
      );

      // Process removals
      await Promise.all(
        pendingChanges.toRemove.map((allocationId) =>
          unassignUserAsync({ userId: userData.id, allocationId })
        )
      );

      setPendingChanges({ toAdd: [], toRemove: [] });
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating allocations:", error);
    }
  };

  // Cancel changes
  const handleCancel = () => {
    setSelectedAllocations(currentUserAllocations);
    setPendingChanges({ toAdd: [], toRemove: [] });
    setIsOpen(false);
  };

  // Get allocation name by ID
  const getAllocationName = (id: string) => {
    return (
      allAllocations?.data?.find(
        (allocation: TAllocation) => allocation.id === id
      )?.name || "Unknown"
    );
  };

  const hasChanges =
    pendingChanges.toAdd.length > 0 || pendingChanges.toRemove.length > 0;
  const isLoading =
    allocationsLoading ||
    userAllocationsLoading ||
    isAssigning ||
    isUnassigning;

  return (
    <div className="w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between text-left font-normal"
            disabled={isLoading}
          >
            <span className="truncate">
              {currentUserAllocations.length === 0
                ? "No allocations"
                : `${currentUserAllocations.length} allocation${
                    currentUserAllocations.length === 1 ? "" : "s"
                  }`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4">
            <div className="mb-3">
              <h4 className="font-medium text-sm mb-1">
                Assign/Unassign Allocations
              </h4>
              <p className="text-xs text-muted-foreground">
                Select allocations for {userData.fullName}
              </p>
            </div>

            {/* Current allocations display */}
            {currentUserAllocations.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium mb-2">Current Allocations:</p>
                <div className="flex flex-wrap gap-1">
                  {currentUserAllocations.map((allocationId: string) => (
                    <Badge
                      key={allocationId}
                      variant="secondary"
                      className="text-xs"
                    >
                      {getAllocationName(allocationId)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Allocation list with checkboxes */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {allAllocations?.data?.map((allocation: TAllocation) => {
                const isSelected = selectedAllocations.includes(allocation.id);
                const willBeAdded = pendingChanges.toAdd.includes(
                  allocation.id
                );
                const willBeRemoved = pendingChanges.toRemove.includes(
                  allocation.id
                );

                return (
                  <div
                    key={allocation.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={allocation.id}
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleAllocationChange(allocation.id, !!checked)
                      }
                    />
                    <label
                      htmlFor={allocation.id}
                      className="flex-1 text-sm font-medium cursor-pointer"
                    >
                      {allocation.name}
                    </label>

                    {/* Status indicators */}
                    {willBeAdded && (
                      <div className="flex items-center text-green-600">
                        <Plus className="h-3 w-3" />
                        <span className="text-xs ml-1">Add</span>
                      </div>
                    )}
                    {willBeRemoved && (
                      <div className="flex items-center text-red-600">
                        <Minus className="h-3 w-3" />
                        <span className="text-xs ml-1">Remove</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pending changes summary */}
            {hasChanges && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-xs font-medium mb-2">Pending Changes:</p>
                {pendingChanges.toAdd.length > 0 && (
                  <p className="text-xs text-green-600 mb-1">
                    <Plus className="inline h-3 w-3 mr-1" />
                    Add:{" "}
                    {pendingChanges.toAdd
                      .map((id) => getAllocationName(id))
                      .join(", ")}
                  </p>
                )}
                {pendingChanges.toRemove.length > 0 && (
                  <p className="text-xs text-red-600">
                    <Minus className="inline h-3 w-3 mr-1" />
                    Remove:{" "}
                    {pendingChanges.toRemove
                      .map((id) => getAllocationName(id))
                      .join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={handleApplyChanges}
                disabled={!hasChanges || isAssigning || isUnassigning}
                className="flex-1"
              >
                {isAssigning || isUnassigning ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-2" />
                    Apply Changes
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isAssigning || isUnassigning}
              >
                <X className="h-3 w-3 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
