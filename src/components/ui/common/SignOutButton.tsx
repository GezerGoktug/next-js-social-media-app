"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();
  const t = useTranslations("layout_sections.header.profile_section")
  return (
    <span
      onClick={async () => {
        await signOut({ redirect: false });
        router.refresh();
        router.push("/auth");
      }}
      className="row-center gap-2"
    >
      <LogOut />
      <span>{t("links_4")}</span>
    </span>
  );
};

export default SignOutButton;
