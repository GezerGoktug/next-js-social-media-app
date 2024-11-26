"use client";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useRouter } from "next/navigation";
import { setUserLocale } from "@/actions/util/locale";
import { useTranslations } from "next-intl";

const ChangeLanguage = ({ preferLang }: { preferLang: "tr" | "en" }) => {
  const router = useRouter();
  const t = useTranslations("settings_page.app_settings");

  return (
    <div className="px-3 py-5 bg-card border border-input sm:rounded-lg row-center flex-wrap gap-3 mb-4">
      <Languages className="bg-secondary size-10 sm:size-12 p-2 sm:p-3 overflow-visible rounded-full text-white" />
      <div className="flex-1">
        <h6 className="font-semibold sm:text-lg">{t("change_language_header")}</h6>
        <p className="text-sm">{t("change_language_text")}</p>
      </div>
      <Select
        onValueChange={(value) => {
          setUserLocale(value as "tr" | "en");
          router.refresh();
        }}
        defaultValue={preferLang || "tr"}
      >
        <SelectTrigger className="w-max">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tr">
            <div className="row-center gap-2">
              <span className="tracking-wide font-bold">TR</span>
              Türkçe
            </div>
          </SelectItem>
          <SelectItem value="en">
            <div className="row-center gap-2">
              <span className="tracking-wide font-bold">EN</span>
              English
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChangeLanguage;
