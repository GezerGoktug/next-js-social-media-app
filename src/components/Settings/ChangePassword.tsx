"use client";
import { Button } from "@/components/ui/button";
import WarningModal from "@/components/ui/common/WarningModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import TextInput from "@/components/ui/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogTrigger } from "../ui/dialog";
import SendResetPasswordEmailModal from "../Auth/SendResetPasswordEmailModal";
import { changePasswordSchema } from "@/schemas/schema";
import updatePassword from "@/actions/user/updatePassword";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const ChangePassword = ({ isHavePassword }: { isHavePassword: boolean }) => {
  const { toast } = useToast();
  const t = useTranslations("settings_page.account_settings.change_password");
  const passwordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      isHavePassword: isHavePassword,
    },
  });

  const passwordOnSubmit = async (
    data: z.infer<typeof changePasswordSchema>
  ) => {
    try {
      const res = await updatePassword(data);
      if (res.success) {
        toast({ title: "Password updated successfully", variant: "default" });
        passwordForm.reset();
      }
    } catch (error: any) {
      toast({ title: error.message, variant: "destructive" });
    }
  };
  return (
    <Form {...passwordForm}>
      <form
        onSubmit={passwordForm.handleSubmit(passwordOnSubmit)}
        className="space-y-6 bg-card sm:rounded-lg  p-4 mt-6 border border-input"
      >
        <h6 className="row-center gap-2 text-2xl font-medium">
          <Shield className="size-10 bg-secondary p-2 rounded-full text-white" />
          {t("header")}
        </h6>
        {!isHavePassword && (
          <FormField
            control={passwordForm.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl className="">
                  <TextInput<z.infer<typeof changePasswordSchema>>
                    type="password"
                    register={field}
                    field={t("current_password_input_placeholder")}
                  />
                </FormControl>
                <FormMessage className="text-xs ms-4" />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={passwordForm.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextInput<z.infer<typeof changePasswordSchema>>
                  type="password"
                  register={field}
                  field={t("new_password_input_placeholder")}
                />
              </FormControl>
              <FormMessage className="text-xs ms-4" />
            </FormItem>
          )}
        />
        <FormField
          control={passwordForm.control}
          name="newPasswordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextInput<z.infer<typeof changePasswordSchema>>
                  type="password"
                  register={field}
                  field={t("confirm_password_input_placeholder")}
                />
              </FormControl>
              <FormMessage className="text-xs ms-4" />
            </FormItem>
          )}
        />
        <div className="flex-between">
          {!isHavePassword && (
            <Dialog>
              <DialogTrigger>
                <div className="text-sm cursor-pointer hover:underline ">
                  {t("forgot_your_password_text")}
                </div>
              </DialogTrigger>
              <SendResetPasswordEmailModal />
            </Dialog>
          )}
          <WarningModal
            header={t("modal_header")}
            desc={t("modal_text")}
            trigger={
              <Button className="gap-2" type="button" variant="default">
                <Save />
                {t("save_button")}
              </Button>
            }
            action={
              <Button
                variant="destructive"
                onClick={async () => {
                  const isValid = await passwordForm.trigger();
                  if (isValid) passwordForm.handleSubmit(passwordOnSubmit)();
                }}
              >
                {t("save_button")}
              </Button>
            }
          />
        </div>
      </form>
    </Form>
  );
};

export default ChangePassword;
