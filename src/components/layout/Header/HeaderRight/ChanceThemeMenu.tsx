"use client";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ChanceThemeMenu = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("layout_sections.header.profile_section")
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
      <DropdownMenuRadioItem className="gap-2 py-2" value="light">
        <Sun />
        <span>{t("themes_text_1")}</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem className="gap-2 py-2" value="dark">
        <Moon />
        <span>{t("themes_text_2")}</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem className="gap-2 py-2" value="system">
        <LaptopMinimal />
        <span>{t("themes_text_3")}</span>
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
};

export default ChanceThemeMenu;
