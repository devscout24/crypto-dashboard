import { CalendarDays } from "lucide-react";
import type {
  TPerformanceReportApiResponse,
  TPerformanceReportCard,
} from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useReports } from "@/queries/cryptoQueries";

export default function DailyReportCard() {
  const { data } = useReports();
  console.log({ data });

  const performanceReportCards =
    data?.data &&
    data.data.map((item: TPerformanceReportApiResponse) => {
      let growthValue: number;

      if (typeof item.growthRate === "object" && item.growthRate !== null) {
        growthValue = (item.growthRate as { value: number }).value;
      } else if (typeof item.growthRate === "number") {
        growthValue = item.growthRate;
      } else {
        growthValue = parseFloat(item.growthRate || "0");
      }

      const description = item.note;

      const formattedDate = new Date(item?.createdAt)
        .toISOString()
        .split("T")[0];

      return {
        date: formattedDate,
        description,
        startingNAV: `$${parseFloat(item.starting).toLocaleString()}`,
        endingNAV: `$${parseFloat(item.ending).toLocaleString()}`,
        growthRate: {
          value: growthValue,
          sign: growthValue >= 0 ? "+" : "-",
          color: growthValue >= 0 ? "green" : "red",
          formatted: `${growthValue >= 0 ? "+" : ""}${Math.abs(
            growthValue
          ).toFixed(2)}%`,
        },
      };
    });

  return (
    <section className="flex flex-col gap-4">
      <Accordion type="single" collapsible className="w-full">
        {performanceReportCards &&
          performanceReportCards.map(
            (report: TPerformanceReportCard, index: number) => (
              <AccordionItem
                value={`item-${index + 1}`}
                key={index}
                className="border-b-0 mb-5"
              >
                <div className="rounded-lg border shadow-sm ">
                  <div className="bg-card text-card-foreground flex flex-col md:flex-row md:items-center justify-between rounded-lg px-5 py-[18px] shadow-sm w-full">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <AccordionTrigger className="hover:no-underline" />
                      </div>
                      <CalendarDays className="h-6 w-6 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">
                          {report.date}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Daily Performance Report
                        </p>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-30 max-md:mt-8">
                      <div className="max-md:flex max-md:justify-between">
                        <p className="text-xs text-muted-foreground">
                          STARTING NAV
                        </p>
                        <p className="font-medium text-foreground">
                          {report.startingNAV}
                        </p>
                      </div>
                      <div className="max-md:flex max-md:justify-between">
                        <p className="text-xs text-muted-foreground">
                          ENDING NAV
                        </p>
                        <p className="font-medium text-foreground">
                          {report.endingNAV}
                        </p>
                      </div>
                      <div className="max-md:flex max-md:justify-between">
                        <p className="text-xs text-muted-foreground text-right">
                          GROWTH RATE
                        </p>
                        <p
                          className={`font-medium text-right ${
                            report.growthRate.sign === "+"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {report.growthRate.formatted}
                        </p>
                      </div>
                    </div>
                  </div>
                  <AccordionContent className="bg-card text-card-foreground border-t rounded-b-lg py-4 px-10">
                    <p className="whitespace-pre-wrap">{report.description}</p>
                  </AccordionContent>
                </div>
              </AccordionItem>
            )
          )}
      </Accordion>
    </section>
  );
}
