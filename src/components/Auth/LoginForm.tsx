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
import { Separator } from "../ui/separator";
import { ChevronRight, Loader } from "lucide-react";
import GoogleIcon from "../icons/GoogleIcon";
import FacebookIcon from "../icons/FacebookIcon";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger } from "../ui/dialog";
import SendResetPasswordEmailModal from "./SendResetPasswordEmailModal";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { loginSchema } from "@/schemas/schema";
import { useTranslations } from "next-intl";

const LoginForm = () => {
  const t = useTranslations("auth_page");
  const params = useSearchParams();
  const formInfo = params?.get("form");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginWithApps = async (provider: "google" | "facebook") => {
    await signIn(provider, { redirect: false });
  };

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      const callback = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (callback?.error) throw new Error(callback?.error);
      if (callback?.ok) {
        toast({
          variant: "default",
          title: "Login successful",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (formInfo === "register") return;
  return (
    <>
      <Form {...form}>
        <form
          id="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextInput<z.infer<typeof loginSchema>>
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
                  <TextInput<z.infer<typeof loginSchema>>
                    field={t("password_input_placeholder")}
                    type="password"
                    register={field}
                  />
                </FormControl>
                <FormMessage className="text-xs ms-4" />
              </FormItem>
            )}
          />
          <Dialog>
            <DialogTrigger>
              <div className="text-sm cursor-pointer hover:underline w-max ">
                {t("forgot_password_text")}
              </div>
            </DialogTrigger>
            <SendResetPasswordEmailModal />
          </Dialog>
          <Button
            disabled={form.formState.isSubmitting}
            type="submit"
            className="w-full [&_.btn-icon]:hover:opacity-100 [&_.btn-icon]:hover:translate-x-0 disabled:opacity-70 "
          >
            {form.formState.isSubmitting ? (
              <>
                {t("loading")}
                <Loader size={20} className="animate-spin ms-2" />
              </>
            ) : (
              <>
                {t("login_button")}
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
        href="/auth?form=register"
      >
        {t("register_form_chance_text")}
      </Link>
      <div className="row-center w-full my-4">
        <Separator className="flex-1" />
        <span className="px-6">{t("or_text")}</span>
        <Separator className="flex-1" />
      </div>
      <div className="flex  gap-3">
        <Button
          onClick={(e) => {
            e.preventDefault();
            loginWithApps("google");
          }}
          variant="outline"
          className=" border-foreground/20 py-6     flex-1 gap-2"
        >
          <GoogleIcon className="size-5  " />
          Google
        </Button>
        <Button
          onClick={() => loginWithApps("facebook")}
          variant="outline"
          className=" border-foreground/20 py-6    flex-1 gap-2"
        >
          <FacebookIcon className="size-5" />
          Facebook
        </Button>
      </div>
    </>
  );
};

export default LoginForm;
