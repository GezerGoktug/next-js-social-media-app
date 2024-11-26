import Link from "next/link";
import ChanceLanguageFooter from "./ChanceLanguageFooter";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations("layout_sections.footer");

  return (
    <footer>
      <nav className="flex flex-wrap gap-3 text-sm text-gray-500">
        <Link href=""> {t("links_1")}</Link>
        <Link href=""> {t("links_2")}</Link>
        <Link href=""> {t("links_3")}</Link>
      </nav>
      <div className="text-sm text-gray-500">
        &copy; 2024 Connectify {t("rights_reserved_text")}
      </div>

      <ChanceLanguageFooter />
    </footer>
  );
};

export default Footer;
