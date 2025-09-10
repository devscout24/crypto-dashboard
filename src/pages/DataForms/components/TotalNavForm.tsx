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
import DatePicker from "@/components/DatePicker";
import { TimePicker } from "@/components/TimePicker";
import { useUpdateCryptoData } from "@/queries/cryptoQueries";
import { useEffect, useState } from "react";

const totalNavSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  ending_nav: z.number().min(0, "Value must be a positive number"),
  growth_percent: z.number().min(0, "Value must be a positive number"),
});

export default function TotalNavForm() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isFormReady, setIsFormReady] = useState(false);

  const form = useForm<z.infer<typeof totalNavSchema>>({
    resolver: zodResolver(totalNavSchema),
    defaultValues: {
      date: "",
      time: "",
      ending_nav: 0,
      growth_percent: 0,
    },
  });

  useEffect(() => {
    // Set the current date as default
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    form.reset({
      date: today,
      time: "",
      ending_nav: 0,
      growth_percent: 0,
    });
    setIsFormReady(true);
  }, [form]);

  const updateNavData = useUpdateCryptoData();

  async function onSubmit(values: z.infer<typeof totalNavSchema>) {
    console.log("Total NAV Form Submitted", values);
    const payload = {
      data: {
        date: values.date,
        nav: {
          ending_nav: values.ending_nav,
          growth_percent: values.growth_percent,
        },
      },
    };

    updateNavData.mutate(payload);
  }

  if (!isFormReady) {
    return <div>Loading form...</div>;
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-card p-4 rounded-lg"
      >
        <h2 className="text-xl font-semibold">Total NAV</h2>
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
                    value={selectedDate}
                    onChange={(date) => {
                      field.onChange(date);
                      setSelectedDate(date);
                    }}
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
          {/* Enging NAV */}
          <FormField
            control={form.control}
            name="ending_nav"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ending NAV</FormLabel>
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

          {/* Growth Percent */}
          <FormField
            control={form.control}
            name="growth_percent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Growth Percent</FormLabel>
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
        </div>
        <Button
          type="submit"
          disabled={updateNavData.isPending}
          className="cursor-pointer"
        >
          {updateNavData.isPending ? "Submitting..." : "Update Total NAV"}
        </Button>
      </form>
    </FormProvider>
  );
}
