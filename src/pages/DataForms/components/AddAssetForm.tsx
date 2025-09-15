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
import { Switch } from "@/components/ui/switch";
import {
  useAssetPerformanceData,
  useCreateAssetPerformance,
} from "@/queries/assetPerformanceQueries"; // Import to get stablecoin ID
import { useCreateAssetPlatform } from "@/queries/assetPerformanceQueries"; // Updated import

const addAssetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  openPrice: z
    .number()
    .min(0, "Open Price must be a positive number")
    .optional(),
  closePrice: z
    .number()
    .min(0, "Close Price must be a positive number")
    .optional(),
  volume: z.number().min(0, "Volume must be a positive number").optional(),
  changePercent: z
    .number()
    .min(0, "Change Percent must be a positive number")
    .optional(),
  asset: z.string().min(1, "Asset Symbol is required").optional(),
  active: z.boolean().optional(),
});

type AddAssetFormProps = {
  isPlatform: boolean;
  onClose: () => void;
};

export default function AddAssetForm({
  isPlatform,
  onClose,
}: AddAssetFormProps) {
  const { data: assetPerformanceData } = useAssetPerformanceData();
  const stablecoin = assetPerformanceData?.data.find(
    (item: { symbol: string }) => item.symbol === "Stablecoin"
  );

  const form = useForm<z.infer<typeof addAssetSchema>>({
    resolver: zodResolver(addAssetSchema),
  });

  const { mutate: addAssetPerformance, isPending: isAssetAdding } =
    useCreateAssetPerformance();
  const { mutate: addAssetPlatform, isPending: isPlatformAdding } =
    useCreateAssetPlatform();

  async function onSubmit(values: z.infer<typeof addAssetSchema>) {
    if (isPlatform) {
      const platformPayload = {
        assetPerformanceId: stablecoin?.id || "",
        platform: {
          name: values.name,
          asset: values.asset || "",
          active: values.active || false,
        },
      };
      addAssetPlatform(platformPayload, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      const assetPayload = {
        name: values.name,
        open: values.openPrice || 0,
        close: values.closePrice || 0,
        changePercent: values.changePercent || 0,
        volumeUsd: values.volume || 0,
        symbol: values.asset || "",
        date: new Date().toISOString().split("T")[0],
        minuteKey: new Date().toISOString().split("T")[1],
      };

      addAssetPerformance(assetPayload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border-[1px] border-primary/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Open Price */}
        {!isPlatform && (
          <FormField
            control={form.control}
            name="openPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Volume */}
        {!isPlatform && (
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Close Price */}
        {!isPlatform && (
          <FormField
            control={form.control}
            name="closePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Close Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Change Percent */}
        {!isPlatform && (
          <FormField
            control={form.control}
            name="changePercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change Percent</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Asset Symbol */}
        <FormField
          control={form.control}
          name="asset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asset Symbol</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="border-[1px] border-primary/50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Active Switch */}
        {isPlatform && (
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-[1px] border-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={isAssetAdding || isPlatformAdding}
          className="w-full"
        >
          {isAssetAdding || isPlatformAdding ? "Adding..." : "Add"}
        </Button>
      </form>
    </FormProvider>
  );
}
