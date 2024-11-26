"use client";
import {   Trash2Icon, UserXIcon } from "lucide-react";
import { Button } from "../ui/button";
import WarningModal from "../ui/common/WarningModal";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import deleteUser from "@/actions/user/deleteUser";
import { useTranslations } from "next-intl";

const DeleteAccount = () => {
  const router = useRouter();
  const t = useTranslations("settings_page.app_settings");

  const deleteAccount = async () => {
    await deleteUser();
    await signOut({ redirect: false });
    router.refresh();
    router.push("/auth");
  };

  return (
    <div className="px-3 py-5 bg-destructive/20 border border-destructive/40 sm:rounded-lg row-center gap-3 ">
      <UserXIcon className="bg-destructive size-10 sm:size-12 p-2 sm:p-3 overflow-visible rounded-full text-white" />
      <div>
        <h6 className="font-semibold sm:text-lg">{t("delete_account_header")}</h6>
        <p className="text-sm">{t("delete_account_text")}</p>
      </div>
      <WarningModal
        header={t("delete_account_modal_header")}
        desc={t("delete_account_modal_text")}
        trigger={
          <Button variant="destructive" className="gap-2 ms-auto">
            <Trash2Icon />
            {t("delete_account_button")}
          </Button>
        }
        action={
          <Button
            onClick={async () => await deleteAccount()}
            variant="destructive"
            className="gap-2 !bg-destructive hover:!bg-destructive/90 ms-auto"
          >
            <Trash2Icon />
            {t("delete_account_modal_button")}
          </Button>
        }
      />
    </div>
  );
};

export default DeleteAccount;
