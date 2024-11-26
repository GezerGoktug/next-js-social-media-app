"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TextInput from "@/components/ui/TextInput";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { passwordSchema } from "@/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface paramsPropsType {
  token: string;
}

const ResetPassword = ({ searchParams }: { searchParams: paramsPropsType }) => {
  const { toast } = useToast();
  const router = useRouter();
  const token = searchParams.token;
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
    },
  });
  const onSubmit: SubmitHandler<{ password: string }> = async (formData) => {
    const { data, error } = await api.post<{
      message: string;
    }>("/reset-password", {
      token,
      password: formData.password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: error,
      });
      return;
    }
    if (data?.message) {
      toast({
        variant: "default",
        title: data.message,
      });
      router.push("/auth");
    }
  };
  if(searchParams.token)
    return null;
  return (
    <div className="w-screen h-screen flex-center">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent className="!pt-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TextInput
                        type="password"
                        field="New Password"
                        register={field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs ms-4" />
                  </FormItem>
                )}
              />
              <div className="flex-end">
                <Button type="submit" className="mt-4">
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
