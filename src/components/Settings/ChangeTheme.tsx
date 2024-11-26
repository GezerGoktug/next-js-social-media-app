"use client";

import { LaptopMinimal, Moon, Sun } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const ChangeTheme = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("settings_page.app_settings");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  const Icon = ({ ...props }) => {
    if (theme === "light") return <Sun {...props} />;
    else if (theme === "dark") return <Moon {...props} />;
    else if (theme === "system") return <LaptopMinimal {...props} />;
  };
  return (
    <div className="px-3 py-5 bg-background  border-2 border-input sm:rounded-lg row-center gap-3 mb-4">
      <Icon className="bg-background border     border-input size-10 sm:size-12 p-2 sm:p-3 overflow-visible rounded-full " />
      <div className="flex-1">
        <h6 className="font-semibold sm:text-lg">{t("change_theme_header")}</h6>
        <p className="text-sm">{t("change_theme_text")}</p>
      </div>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-max">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">
            <div className="row-center gap-2">
              <Sun />
              {t("themes_text_1")}
            </div>
          </SelectItem>
          <SelectItem value="dark">
            <div className="row-center gap-2">
              <Moon />
              {t("themes_text_2")}
            </div>
          </SelectItem>
          <SelectItem value="system">
            <div className="row-center gap-2">
              <LaptopMinimal />
              {t("themes_text_3")}
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChangeTheme;
