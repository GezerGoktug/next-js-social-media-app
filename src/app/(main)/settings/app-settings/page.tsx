import ChangeLanguage from "@/components/Settings/ChangeLanguage";
import ChangeTheme from "@/components/Settings/ChangeTheme";
import DeleteAccount from "@/components/Settings/DeleteAccount";
import { Button } from "@/components/ui/button";
import SignOutButton from "@/components/ui/common/SignOutButton";
import { getLocale, getTranslations } from "next-intl/server";

const AppSettings = async () => {
  const locale = await getLocale();
  const t = await getTranslations("settings_page");
  return (
    <>
      <h6 className="font-semibold text-3xl ms-4 mt-2 mb-5">{t("app_settings_header")}</h6>
      <ChangeLanguage
        preferLang={locale === undefined ? "en" : (locale as "tr" | "en")}
      />
      <ChangeTheme />
      <DeleteAccount />
      <div className="flex-end">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 mt-5 me-4 py-6 font-semibold    text-xl"
        >
          <SignOutButton />
        </Button>
      </div>
    </>
  );
};

export default AppSettings;
