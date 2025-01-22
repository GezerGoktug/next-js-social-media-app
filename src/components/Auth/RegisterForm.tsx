"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TextInput from "../ui/TextInput";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { ChevronRight, Loader } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import register from "@/actions/user/register";
import { signIn } from "next-auth/react";
import { registerSchema } from "@/schemas/schema";
import { useTranslations } from "next-intl";

const RegisterForm = () => {
  const t = useTranslations("auth_page");
  const params = useSearchParams();
  const formInfo = params?.get("form");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      const res = await register(data);
      if (!res?.success && res) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: Object.entries(res.errors)
            .map(([field, messages]) => `${field}: ${messages?.join(", ")}`)
            .join("\n"),
        });
        return;
      }
      const callback = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (callback?.ok) {
        toast({
          variant: "default",
          title: "Registration successful",
        });
        router.refresh();
        router.push("/auth/complete-profile");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Register failed",
        description: error.message,
      });
    }
  };

  if (formInfo !== "register") return;
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput<z.infer<typeof registerSchema>>
                    field={t("fullname_input_placeholder")}
                    register={field}
                  />
                </FormControl>
                <FormMessage className="text-xs ms-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput<z.infer<typeof registerSchema>>
                    type="email"
                    field={t("email_input_placeholder")}
                    register={field}
                  />
                </FormControl>
                <FormMessage className="text-xs ms-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput<z.infer<typeof registerSchema>>
                    field={t("password_input_placeholder")}
                    type="password"
                    register={field}
                  />
                </FormControl>
                <FormMessage className="text-xs ms-4" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput<z.infer<typeof registerSchema>>
                    field={t("confirm_password_input_placeholder")}
                    type="password"
                    register={field}
                  />
                </FormControl>
                <FormMessage className="text-xs ms-4" />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full [&_.btn-icon]:hover:opacity-100 [&_.btn-icon]:hover:translate-x-0 disabled:opacity-70  "
          >
            {form.formState.isSubmitting ? (
              <>
                {t("loading")}
                <Loader size={20} className="animate-spin ms-2" />
              </>
            ) : (
              <>
                {t("register_button")}
                <ChevronRight
                  size={15}
                  className="ms-1 transition-all btn-icon -translate-x-2 opacity-0"
                />
              </>
            )}
          </Button>
        </form>
      </Form>
      <Link
        className="text-sm block my-6 mx-auto w-max  hover:underline"
        href="/auth?form=login"
      >
        {t("login_form_chance_text")}
      </Link>
    </>
  );
};

export default RegisterForm;
