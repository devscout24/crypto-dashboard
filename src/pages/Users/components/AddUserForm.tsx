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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/queries/authQueries";
import { useSingleUser, useUpdateUser } from "@/queries/userQueries";

const userImages = [
  "https://i.ibb.co/jPWwK4hG/5864188-1.png",
  "https://i.ibb.co/fYYnTXR0/5864188.png",
  "https://i.ibb.co/vvqCyX6Y/5864188-4.png",
  "https://i.ibb.co/jkKtDKWJ/5864188-3.png",
  "https://i.ibb.co/nqxx12G2/5864188-2.png",
  "https://i.ibb.co/RkrCphLx/photo-2022-02-28-00-35-30-1024x1024.png",
  "https://i.ibb.co/1DszX8q/0x0-1.png",
  "https://i.ibb.co/7x3kcfvF/cute-detective-bear-cartoon-character-138676-2911.png",
  "https://i.ibb.co/3gKgdkV/cdb7d8e432b1742585aa24c498e65ecc.png",
  "https://i.ibb.co/3mqH2LWM/1-23-3-17-16-2-13m.png",
];

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["USER", "ADMIN"]),
  img: z.string().min(1, "Image is required"),
  isStatus: z.boolean(),
});

export default function AddUserForm({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      img: userImages[0],
      isStatus: true,
    },
  });

  const { mutate: createUser, isPending: isRegisterPending } = useRegister();
  const { mutate: updateUser, isPending: isUpdatePending } = useUpdateUser();
  const { data: user } = useSingleUser(userId ?? "");

  // Update form values when user data is loaded
  useEffect(() => {
    if (user?.data && userId) {
      console.log("User data loaded:", user.data);
      form.reset({
        fullName: user.data.fullName || "",
        email: user.data.email || "",
        password: undefined,
        role: user.data.role || "USER",
        img: user.data.img || userImages[0],
        isStatus: user.data.isStatus ?? true,
      });
    }
  }, [user, userId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const editPayload = {
      fullName: values.fullName,
      email: values.email,
      role: values.role,
      img: values.img,
      isStatus: values.isStatus,
    };

    if (userId) {
      updateUser(
        { data: editPayload, id: userId },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createUser(values, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Avatar */}
        <FormField
          control={form.control}
          name="img"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Avatar</FormLabel>
              <FormControl>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="w-full md:w-[40%] flex items-center justify-center">
                    <div className="h-34 w-34 rounded-full border border-border flex items-center justify-center">
                      {field.value && (
                        <img
                          src={field.value}
                          alt="user avatar"
                          className="h-32 w-32 rounded-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-4 w-full md:w-[60%]">
                    {userImages.map((image) => (
                      <img
                        key={image}
                        src={image}
                        alt="user avatar"
                        className={`h-12 w-12 cursor-pointer rounded-full object-cover ring-2 ${
                          field.value === image
                            ? "ring-primary"
                            : "ring-transparent"
                        }`}
                        onClick={() => field.onChange(image)}
                      />
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Name */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        {!userId && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg">Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="isStatus"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="text-lg">Status</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "true")}
                  value={field.value ? "true" : "false"}
                  className="flex items-center gap-4"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="true" id="r1" />
                    <Label htmlFor="r1">Active</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="false" id="r2" />
                    <Label htmlFor="r2">Inactive</Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isRegisterPending || isUpdatePending}
        >
          {isRegisterPending || isUpdatePending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <>{userId ? "Update User" : "Add User"}</>
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
