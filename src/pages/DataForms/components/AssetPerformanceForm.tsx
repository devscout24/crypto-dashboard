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

const dailyReportSchema = z.object({
  closePrice: z.number().min(0, "Starting NAV must be a positive number"),
  changePercent: z.number().min(0, "Ending NAV must be a positive number"),
});

export default function AssetPerformanceForm() {
  const form = useForm<z.infer<typeof dailyReportSchema>>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      closePrice: 0,
      changePercent: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof dailyReportSchema>) {
    console.log("Daily Report Form Submitted", values);
    toast.success("Daily report submitted successfully!");
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-card p-4 rounded-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          Update Asset Performance Panel
        </h2>

        {/* Close Price */}
        <FormField
          control={form.control}
          name="closePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting NAV</FormLabel>
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

        {/* Change Persent */}
        <FormField
          control={form.control}
          name="changePercent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starting NAV</FormLabel>
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

        <Button type="submit">Update Asset Performance</Button>
      </form>
    </FormProvider>
  );
}
