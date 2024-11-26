"use client";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useRef } from "react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface resType {
  message: string;
}

const SendResetPasswordEmailModal = () => {
  const { toast } = useToast();
  const t = useTranslations("components.send_reset_password_modal");
  const inputRef = useRef<HTMLInputElement>(null);
  const onSubmit = async () => {
    const email = inputRef.current?.value;

    const { data, error } = await api.post<resType>("/reset-password-request", {
      email,
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Send Reset Password Failed",
        description: error,
      });
      return;
    }
    if (data?.message) {
      toast({
        variant: "default",
        title: data.message,
      });
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-3xl">{t("header")}</DialogTitle>

        <DialogDescription></DialogDescription>
      </DialogHeader>
      <div>
        <Input
          ref={inputRef}
          name="email"
          type="email"
          placeholder={t("input_placeholder")}
        />

        <div className="flex-end gap-4 mt-5">
          <DialogClose>
            <Button type="button" variant="outline" className=" gap-2">
              {t("close_button_text")}
            </Button>
          </DialogClose>
          <Button type="button" onClick={onSubmit} className="gap-2">
            <Send />
            {t("send_button_text")}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default SendResetPasswordEmailModal;
