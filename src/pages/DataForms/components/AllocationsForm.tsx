import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import DatePicker from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { DateTimePicker } from "@/components/DateTimePicker";
import { useAllocationByKey } from "@/queries/cryptoQueries";
import { allocationOptions } from "@/pages/AllocationManagement/allocationOptions";
import { X } from "lucide-react";
import { useEffect } from "react";

const allocationSchema = z.object({
  allocation: z.string().min(1, "Allocation is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  value: z.number().min(0, "Value must be a positive number"),
  timer: z.string().min(1, "Timer is required"),
  lastPayout: z.string().min(1, "Last payout event is required"),
  nextUnlock: z.string().min(1, "Next unlock epoch is required"),
});

export default function AllocationsForm({
  allocationToEdit,
  onClose,
}: {
  allocationToEdit: string | null;
  onClose?: () => void;
}) {
  const isEdit: boolean = !!allocationToEdit;

  const form = useForm<z.infer<typeof allocationSchema>>({
    resolver: zodResolver(allocationSchema),
    defaultValues: {
      allocation: "A",
      date: "",
      time: "",
      value: 0,
      timer: "",
      lastPayout: "",
      nextUnlock: "",
    },
  });

  const { data } = useAllocationByKey(allocationToEdit as string);

  useEffect(() => {
    if (isEdit && data?.data) {
      console.log({ isEdit, allocationToEdit });
      setTimeout(() => {
        form.reset({
          allocation: allocationToEdit || "",
          date: data.data.date || "",
          time: data.data.time || "",
          value: data.data.value || 0,
          timer: data.data.timer || "",
          lastPayout: data.data.lastPayout || "",
          nextUnlock: data.data.nextUnlock || "",
        });
      }, 0);
    }
  }, [data, form, allocationToEdit, isEdit]);

  async function onSubmit(values: z.infer<typeof allocationSchema>) {
    console.log("Allocation Form Submitted", values);
    toast.success("Allocation data submitted successfully!");
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-card p-4 rounded-lg"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEdit ? data?.data?.name : "Create New Allocation"}
          </h2>
          <Button variant={"outline"} onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>

        <FormField
          control={form.control}
          name="allocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Allocation</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger disabled={isEdit}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <DatePicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <TimePicker
                    {...field}
                    onChange={(value) => field.onChange(value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timer</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastPayout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Payout Event</FormLabel>
                <FormControl>
                  <DateTimePicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nextUnlock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Unlock Epoch</FormLabel>
                <FormControl>
                  <DateTimePicker
                    {...field}
                    onChange={(date) => field.onChange(date)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">{isEdit ? "Update" : "Create"} Allocation</Button>
      </form>
    </FormProvider>
  );
}
