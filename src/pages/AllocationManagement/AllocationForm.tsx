import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { allocationOptions, allocationTypes } from "./allocationOptions";
import type { TAllocation, TAllocationPayload } from "@/types";

const allocationSchema = z.object({
  key: z.string().min(1, "Allocation is required"),
  name: z.string().min(1, "Allocation name is required"),
  initialBalance: z.coerce.number().min(0, "Value must be a positive number"),
  endingBalance: z.coerce.number().min(0, "Value must be a positive number"),
  type: z.string().min(1, "Type is required"),
});

type UpdateAllocationParams = {
  key: string;
  data: TAllocationPayload;
};

export default function AllocationForm({
  allocationToEdit,
  onClose,
  createAllocation,
  updateAllocation,
  isPending,
}: {
  allocationToEdit: TAllocation | undefined;
  onClose?: () => void;
  createAllocation: (data: TAllocationPayload) => void;
  updateAllocation: (params: UpdateAllocationParams) => void;
  isPending?: boolean;
}) {
  const form = useForm<z.infer<typeof allocationSchema>>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      key: allocationToEdit?.key || "",
      name: allocationToEdit?.name || "",
      initialBalance: allocationToEdit?.currentBalance || 0,
      endingBalance: allocationToEdit?.endingBalance || 0,
      type: allocationToEdit?.type || "",
    },
  });

  useEffect(() => {
    if (allocationToEdit) {
      console.log("Resetting form with:", allocationToEdit);
      form.reset({
        key: allocationToEdit?.key,
        name: allocationToEdit?.name,
        initialBalance: allocationToEdit?.currentBalance,
        endingBalance: allocationToEdit?.endingBalance,
        type: allocationToEdit?.type,
      });
      console.log("Form values after reset:", form.getValues());
    }
  }, [form, allocationToEdit]);

  function onSubmit(values: z.infer<typeof allocationSchema>) {
    const payload = {
      key: values.key,
      name: values.name,
      initialBalance: values.initialBalance,
      endingBalance: values.endingBalance,
      type: values.type,
    };

    if (allocationToEdit && updateAllocation) {
      updateAllocation({ key: allocationToEdit?.key, data: payload });
      onClose?.();
    } else {
      createAllocation(payload);
      onClose?.();
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 rounded-lg"
      >
        {/* Allocation Key */}
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an allocation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allocationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allocation Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Initial Balance */}
        <FormField
          control={form.control}
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Balance</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ending Balance */}
        <FormField
          control={form.control}
          name="endingBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ending Balance</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allocation type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select an allocation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allocationTypes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {allocationToEdit ? "Update Allocation" : "Create Allocation"}
        </Button>
      </form>
    </FormProvider>
  );
}
