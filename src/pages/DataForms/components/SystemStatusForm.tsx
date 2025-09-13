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
  const form = useForm<z.infer<typeof systemStatusSchema>>({
    resolver: zodResolver(systemStatusSchema),
    defaultValues: {
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
    console.log("System Status Form Submitted", values);
    toast.success("System status updated successfully!");
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Update System Status</Button>
      </form>
    </FormProvider>
  );
}

// import { useForm, FormProvider } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   FormControl,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormField,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const systemStatusSchema = z.object({
//   tradingEngine: z.string().min(1, "Trading Engine status is required"),
//   riskManagement: z.string().min(1, "Risk Management status is required"),
//   dataFeeds: z.string().min(1, "Data Feeds status is required"),
//   operationalCompliance: z
//     .string()
//     .min(1, "Operational Compliance status is required"),
// });

// export default function SystemStatusForm() {
//   const form = useForm<z.infer<typeof systemStatusSchema>>({
//     resolver: zodResolver(systemStatusSchema),
//     defaultValues: {
//       tradingEngine: "Operational",
//       riskManagement: "Operational",
//       dataFeeds: "Operational",
//       operationalCompliance: "Operational",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof systemStatusSchema>) {
//     console.log("System Status Form Submitted", values);
//     toast.success("System status updated successfully!");
//   }

//   return (
//     <FormProvider {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-4 bg-card p-4 rounded-lg"
//       >
//         <h2 className="text-xl font-semibold">System Status</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <FormField
//             control={form.control}
//             name="tradingEngine"
//             render={({ field }) => (
//               <FormItem  className="flex justify-between items-center">
//                 <FormLabel>Trading Engine</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Operational">Operational</SelectItem>
//                     <SelectItem value="Down">Down</SelectItem>
//                     <SelectItem value="Maintenance">Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="riskManagement"
//             render={({ field }) => (
//               <FormItem  className="flex justify-between items-center">
//                 <FormLabel>Risk Management</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Operational">Operational</SelectItem>
//                     <SelectItem value="Down">Down</SelectItem>
//                     <SelectItem value="Maintenance">Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="dataFeeds"
//             render={({ field }) => (
//               <FormItem  className="flex justify-between items-center">
//                 <FormLabel>Data Feeds</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Operational">Operational</SelectItem>
//                     <SelectItem value="Down">Down</SelectItem>
//                     <SelectItem value="Maintenance">Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="operationalCompliance"
//             render={({ field }) => (
//               <FormItem  className="flex justify-between items-center">
//                 <FormLabel>Operational Compliance</FormLabel>
//                 <Select
//                   onValueChange={field.onChange}
//                   defaultValue={field.value}
//                 >
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Operational">Operational</SelectItem>
//                     <SelectItem value="Down">Down</SelectItem>
//                     <SelectItem value="Maintenance">Maintenance</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//         <Button type="submit">Update System Status</Button>
//       </form>
//     </FormProvider>
//   );
// }
