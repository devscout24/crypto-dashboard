import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useSystemStatus,
  useUpdateSystemStatus,
} from "@/queries/systemStatusQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const systemStatusSchema = z.object({
  allocationsAG: z.string().min(1, "Allocations A–G status is required"),
  overrideLayer: z.string().min(1, "Override Layer status is required"),
  surplusRedistribution: z
    .string()
    .min(1, "Surplus Redistribution status is required"),
  passiveCarryStack: z
    .string()
    .min(1, "Passive Carry Stack status is required"),
  syndicateTiering: z.string().min(1, "Syndicate Tiering status is required"),
  trustLayer: z.string().min(1, "Trust Layer (LIE) status is required"),
  complianceLayer: z.string().min(1, "Compliance Layer status is required"),
});

export default function SystemStatusForm() {
  const { data, isLoading } = useSystemStatus();
  const { mutate: updateSystemStatus, isPending: isUpdating } =
    useUpdateSystemStatus();

  const initialData = data?.data && data?.data[0];

  const form = useForm<z.infer<typeof systemStatusSchema>>({
    resolver: zodResolver(systemStatusSchema),
    defaultValues: initialData
      ? {
          allocationsAG: initialData.allocations,
          overrideLayer: initialData.overrideLayer,
          surplusRedistribution: initialData.surplusRedistribution,
          passiveCarryStack: initialData.passiveCarryStack,
          syndicateTiering: initialData.syndicateTiering,
          trustLayer: initialData.trustLayer,
          complianceLayer: initialData.complianceLayer,
        }
      : {
          allocationsAG: "✅ Fully Compounding",
          overrideLayer: "✅ Engaged",
          surplusRedistribution: "✅ Active – Dual-Pool Trigger (D & F)",
          passiveCarryStack: "✅ Functional",
          syndicateTiering: "🔄 Weight Adjustment Phase",
          trustLayer: "⚙️ Custody Approval Pending",
          complianceLayer: "✅ All Systems Aligned",
        },
  });

  async function onSubmit(values: z.infer<typeof systemStatusSchema>) {
    if (!initialData?.id) {
      toast.error("No system status ID available for update");
      return;
    }

    const payload = {
      id: initialData.id,
      data: {
        allocations: values.allocationsAG,
        overrideLayer: values.overrideLayer,
        surplusRedistribution: values.surplusRedistribution,
        passiveCarryStack: values.passiveCarryStack,
        syndicateTiering: values.syndicateTiering,
        trustLayer: values.trustLayer,
        complianceLayer: values.complianceLayer,
      },
    };

    updateSystemStatus(payload);
  }

  if (isLoading) {
    return (
      <div className="space-y-4 bg-card p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-64" />
            </div>
          ))}
        </div>
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-card p-4 rounded-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="allocationsAG"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Allocations A–G</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="overrideLayer"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Override Layer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="surplusRedistribution"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Surplus Redistribution</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passiveCarryStack"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Passive Carry Stack</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="syndicateTiering"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Syndicate Tiering</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="trustLayer"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Trust Layer (LIE)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="complianceLayer"
            render={({ field }) => (
              <FormItem className="flex justify-between items-center">
                <FormLabel>Compliance Layer</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isUpdating} className="w-full">
          {isUpdating ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating
            </div>
          ) : (
            "Update System Status"
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
