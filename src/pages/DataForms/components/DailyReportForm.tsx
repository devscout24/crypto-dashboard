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
import {
  useCreateReport,
  useReportById,
  useUpdateReport,
} from "@/queries/cryptoQueries";
import { useEffect } from "react";
import type { TDailyReportPayload } from "@/types";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

const dailyReportSchema = z.object({
  date: z.string().min(1, "Date is required"),
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
  starting_nav: z.number().min(0, "Starting NAV must be a positive number"),
  capital_in: z.number().min(0, "Capital In must be a positive number"),
  capital_out: z.number().min(0, "Capital Out must be a positive number"),
  net_system_growth_percent: z.number(),
  ending_nav: z.number().min(0, "Ending NAV must be a positive number"),
  daily_growth_rate: z.number(),
});

type DailyReportFormProps = {
  reportId?: string;
};

export default function DailyReportForm({ reportId }: DailyReportFormProps) {
  const form = useForm<z.infer<typeof dailyReportSchema>>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      date: "",
      headline: "",
      subheadline: "",
      starting_nav: 0,
      capital_in: 0,
      capital_out: 0,
      net_system_growth_percent: 0,
      ending_nav: 0,
      daily_growth_rate: 0,
    },
  });

  // Only fetch by date if no initialData is provided and reportDate exists
  const { data: reportData } = useReportById(reportId ? reportId : "");
  const { mutate: createReport, isPending: isCreating } = useCreateReport();
  const { mutate: updateReport, isPending: isUpdating } = useUpdateReport();

  // Handle form reset when initialData or reportData changes
  useEffect(() => {
    const dataToUse = reportData?.data;

    if (dataToUse) {
      // Format date for form
      let formattedDate = "";
      if (dataToUse.createdAt) {
        try {
          formattedDate = new Date(dataToUse.createdAt)
            .toISOString()
            .split("T")[0];
        } catch (e) {
          console.error("Error parsing date:", e);
          formattedDate = "";
        }
      }

      // Extract headline and subheadline from note
      const noteLines = dataToUse.note?.split("\n") || [];
      const reportTextIndex = noteLines.findIndex((line: string) =>
        line.startsWith("- Daily Report Text:")
      );
      let headline = "";
      let subheadline = "";
      if (reportTextIndex !== -1) {
        headline = noteLines[reportTextIndex].substring(
          "- Daily Report Text: ".length
        );
        subheadline =
          noteLines.slice(0, reportTextIndex).join("\n") || headline;
      } else {
        headline = dataToUse.note || "";
        subheadline = dataToUse.note || "";
      }

      form.reset({
        date: formattedDate,
        headline,
        subheadline,
        starting_nav: parseFloat(dataToUse.starting || "0"),
        capital_in: parseFloat(dataToUse.capital_in || "0"),
        capital_out: parseFloat(dataToUse.capital_out || "0"),
        net_system_growth_percent: parseFloat(
          dataToUse.net_system_growth_percent || "0"
        ),
        ending_nav: parseFloat(dataToUse.ending || "0"),
        daily_growth_rate: parseFloat(dataToUse.growthRate || "0"),
      });
    }
  }, [reportData, form]);

  async function onSubmit(values: z.infer<typeof dailyReportSchema>) {
    const payload: TDailyReportPayload = {
      date: values.date,
      headline: values.headline,
      subheadline: values.subheadline,
      starting_nav: values.starting_nav,
      capital_in: values.capital_in,
      capital_out: values.capital_out,
      net_system_growth_percent: values.net_system_growth_percent,
      ending_nav: values.ending_nav,
      daily_growth_rate: values.daily_growth_rate,
    };

    // Determine if this is an update or create operation
    const isUpdate = reportId || reportData?.data?.id;

    if (isUpdate && reportId) {
      updateReport(
        { id: reportId, data: payload },
        {
          onSuccess: () => {
            form.reset();
          },
        }
      );
    } else {
      createReport(payload, {
        onSuccess: () => {
          form.reset();
        },
      });
    }
  }

  const isEditing = !!reportData?.data;

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
                    <Textarea {...field} className="w-full h-28 resize-none" />
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
                    <Textarea {...field} className="w-full h-28 resize-none" />
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capital_in"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital In</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capital_out"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capital Out</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              className="w-full"
            >
              {isCreating || isUpdating
                ? "Submitting..."
                : isEditing
                ? "Update Daily Report"
                : "Create Daily Report"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </>
  );
}
