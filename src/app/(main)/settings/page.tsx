import {
  AppWindowMac,
  ChevronRight,
  CircleUserRound,
  LockKeyhole,
  Settings as LucideSettings,
} from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Settings - Connectify",
  description: "...",
};

const Settings = async () => {
  const t = await getTranslations("settings_page");
  return (
    <>
      <h6 className="row-center gap-3 font-semibold text-3xl bg-card sm:rounded-lg border-2 border-secondary/30   ">
        <LucideSettings className="size-16 p-3 bg-secondary sm:rounded-s-lg text-white" />
        {t("header")}
      </h6>
      <div className="mt-4 space-y-3">
        <Link
          href="settings/update-profile"
          className="bg-card min-h-24 border border-input sm:rounded-lg py-3 px-4 row-center gap-5 [&_.btn-icon]:hover:opacity-100 [&_.btn-icon]:hover:translate-x-0"
        >
          <CircleUserRound className="size-10 sm:size-12 bg-primary/30 px-2 rounded-full " />
          <div className="flex-1">
            <h6 className="font-semibold sm:text-lg">
              {t("profile_settings_header")}
            </h6>
            <p className="text-sm text-muted-foreground">
              {t("profile_settings_text")}
            </p>
          </div>
          <ChevronRight
            size={35}
            className="my-auto me-2 ms-auto transition-all btn-icon -translate-x-4 opacity-0 hidden sm:inline"
          />
        </Link>
        <Link
          href="settings/update-account-infos"
          className="bg-card min-h-24 border border-input sm:rounded-lg py-3 px-4 row-center gap-5 [&_.btn-icon]:hover:opacity-100 [&_.btn-icon]:hover:translate-x-0"
        >
          <LockKeyhole className="size-10 sm:size-12 bg-primary/30 px-2 rounded-full" />
          <div className="flex-1">
            <h6 className="font-semibold sm:text-lg">
              {t("account_settings_header")}
            </h6>
            <p className="text-sm text-muted-foreground">
              {t("account_settings_text")}
            </p>
          </div>
          <ChevronRight
            size={35}
            className="my-auto me-2 ms-auto transition-all btn-icon -translate-x-4 opacity-0 hidden sm:inline"
          />
        </Link>
        <Link
          href="settings/app-settings"
          className="bg-card min-h-24 border border-input sm:rounded-lg py-3 px-4 row-center gap-5 [&_.btn-icon]:hover:opacity-100 [&_.btn-icon]:hover:translate-x-0"
        >
          <AppWindowMac className="size-10 sm:size-12 bg-primary/30 px-2 rounded-full" />
          <div className="flex-1">
            <h6 className="font-semibold sm:text-lg">
              {t("app_settings_header")}
            </h6>
            <p className="text-sm text-muted-foreground">
              {t("app_settings_text")}
            </p>
          </div>
          <ChevronRight
            size={35}
            className="my-auto me-2 ms-auto transition-all btn-icon -translate-x-4 opacity-0 hidden sm:inline"
          />
        </Link>
      </div>
    </>
  );
};

export default Settings;
