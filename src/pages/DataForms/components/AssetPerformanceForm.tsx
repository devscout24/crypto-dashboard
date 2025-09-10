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
import type { TCoinData } from "@/types";
import {
  useUpdateAssetPerformance,
  useUpdateAssetPlatform,
} from "@/queries/assetPerformanceQueries";
import { Switch } from "@/components/ui/switch";

const dailyReportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  openPrice: z.number().min(0, "Starting NAV must be a positive number"),
  closePrice: z.number().min(0, "Starting NAV must be a positive number"),
  volume: z.number().min(0, "Starting NAV must be a positive number"),
  changePercent: z.number().min(0, "Ending NAV must be a positive number"),
  asset: z.string().min(1, "Asset is required"),
  active: z.boolean(),
});

export default function AssetPerformanceForm({
  selectedRowToEdit,
  onClose,
}: {
  selectedRowToEdit: TCoinData;
  onClose?: () => void;
}) {
  console.log({ selectedRowToEdit });

  const form = useForm<z.infer<typeof dailyReportSchema>>({
    resolver: zodResolver(dailyReportSchema),
    defaultValues: {
      name: selectedRowToEdit?.name || "",
      openPrice: selectedRowToEdit?.open || 0,
      closePrice: selectedRowToEdit?.close || 0,
      volume: selectedRowToEdit?.volume || 0,
      changePercent: selectedRowToEdit?.change || 0,
      asset: selectedRowToEdit?.symbol || "",
      active: selectedRowToEdit?.active || false,
    },
  });

  const { mutate: updateAssetPerformance } = useUpdateAssetPerformance();
  const { mutate: updateAssetPlatform } = useUpdateAssetPlatform();

  async function onSubmit(values: z.infer<typeof dailyReportSchema>) {
    const assetPayload = {
      name: values.name,
      open: values.openPrice,
      close: values.closePrice,
      changePercent: values.changePercent,
      volumeUsd: values.volume,
    };

    const platformPayload = {
      name: values.name,
      asset: values.asset,
      active: values.active,
    };

    if (selectedRowToEdit && selectedRowToEdit?.id) {
      updateAssetPerformance(
        {
          id: selectedRowToEdit?.id || "",
          data: assetPayload,
        },
        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    } else if (selectedRowToEdit && selectedRowToEdit?.platformId) {
      updateAssetPlatform(
        {
          id: selectedRowToEdit?.platformId || "",
          data: platformPayload,
        },
        {
          onSuccess: () => {
            onClose?.();
          },
        }
      );
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4  p-4">
        {/* name */}
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Open Price */}
        {selectedRowToEdit?.id && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Volume */}
        {selectedRowToEdit?.id && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Close Price */}
        {selectedRowToEdit?.id && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Change Persent */}
        {selectedRowToEdit?.id && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* asset  */}
        {selectedRowToEdit?.platformId && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* active switch */}
        {selectedRowToEdit?.platformId && (
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Update Asset Performance</Button>
      </form>
    </FormProvider>
  );
}
