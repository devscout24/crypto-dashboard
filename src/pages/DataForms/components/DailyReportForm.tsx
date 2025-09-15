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
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/DatePicker";
import { useUpdateReport } from "@/queries/cryptoQueries";
import { useEffect } from "react";
import type { TDailyReportPayload, TPerformanceReportCard } from "@/types";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const dailyReportSchema = z.object({
  date: z.string().min(1, "Date is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
  starting_nav: z.number().min(0, "Starting NAV must be a positive number"),
  net_system_growth_percent: z.number(),
  ending_nav: z.number().min(0, "Ending NAV must be a positive number"),
  daily_growth_rate: z.number(),
});

type DailyReportFormProps = {
  reportId?: string;
  closeModal?: () => void;
  reportData?: TPerformanceReportCard;
};

export default function DailyReportForm({
  reportId,
  reportData,
  closeModal,
}: DailyReportFormProps) {
  console.log({ reportData });

  const form = useForm<z.infer<typeof dailyReportSchema>>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      date: reportData?.date,
      headline: "",
      subheadline: "",
      starting_nav: 0,
      net_system_growth_percent: 0,
      ending_nav: 0,
      daily_growth_rate: 0,
    },
  });

  const { mutate: updateReport, isPending: isUpdating } = useUpdateReport();

  // Handle form reset when initialData or reportData changes
  useEffect(() => {
    if (reportData) {
      const noteLines = reportData.description?.split("\n") || [];

      form.reset({
        date: reportData?.date,
        headline: noteLines[0],
        subheadline: noteLines[1],
        starting_nav:
          parseFloat(reportData.startingNAV.replace(/[$,]/g, "")) || 0,
        net_system_growth_percent: reportData.growthRate.value,
        ending_nav: parseFloat(reportData.endingNAV.replace(/[$,]/g, "")) || 0,
        daily_growth_rate: reportData.growthRate.value,
      });
    }
  }, [reportData, form]);

  async function onSubmit(values: z.infer<typeof dailyReportSchema>) {
    const payload: TDailyReportPayload = {
      date: values.date,
      headline: values.headline,
      subheadline: values.subheadline,
      starting_nav: values.starting_nav,
      net_system_growth_percent: values.net_system_growth_percent,
      ending_nav: values.ending_nav,
      daily_growth_rate: values.daily_growth_rate,
    };

    if (reportId) {
      updateReport(
        { id: reportId, data: payload },
        {
          onSuccess: () => {
            form.reset();
            closeModal?.();
          },
        }
      );
    }
  }

  return (
    <>
      <DialogHeader className="">
        <DialogTitle>Edit Daily Report</DialogTitle>
      </DialogHeader>

      <div className="max-h-[80vh] overflow-y-auto">
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4  p-4"
          >
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
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full max-h-28 resize-none border-[1px] border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subheadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subheadline</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full max-h-28 resize-none border-[1px] border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="starting_nav"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting NAV</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="border-[1px] border-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="net_system_growth_percent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Net System Growth (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="border-[1px] border-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ending_nav"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ending NAV</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        className="border-[1px] border-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="daily_growth_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Growth Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.000001"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      className="border-[1px] border-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? "Submitting..." : "Update Daily Report"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
