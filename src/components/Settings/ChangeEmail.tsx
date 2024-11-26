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
import { AtSign, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

const emailSchema = z.object({
  newEmail: z.string().email("Invalid email"),
});

const ChangeEmail = () => {
  const t = useTranslations("settings_page.account_settings.change_email");

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const emailOnSubmit = (data: z.infer<typeof emailSchema>) => {
    console.log(data);
  };
  return (
    <Form {...emailForm}>
      <form
        onSubmit={emailForm.handleSubmit(emailOnSubmit)}
        className="space-y-6 bg-card sm:rounded-lg mb-20 sm:mb-0 p-4 mt-6 border border-input"
      >
        <h6 className="row-center gap-2 text-2xl font-medium">
          <AtSign className="size-10 bg-secondary p-2 rounded-full text-white" />
          {t("header")}
        </h6>
        <FormField
          control={emailForm.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextInput<z.infer<typeof emailSchema>>
                  type="email"
                  register={field}
                  field={t("email_input_placeholder")}
                />
              </FormControl>
              <FormMessage className="text-xs ms-4" />
            </FormItem>
          )}
        />

        <div className="flex-end">
          <WarningModal
            header={t("modal_header")}
            desc={t("modal_text")}
            trigger={
              <div className="ms-auto space-x-2">
                <Button className="gap-2" type="button" variant="default">
                  <Save />
                  {t("save_button")}
                </Button>
              </div>
            }
            action={
              <Button
                variant="destructive"
                onClick={async () => {
                  const isValid = await emailForm.trigger();
                  if (isValid) emailForm.handleSubmit(emailOnSubmit)();
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

export default ChangeEmail;
