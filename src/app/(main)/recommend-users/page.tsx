import getRecommendUsers from "@/actions/user/getRecommendUsers";
import RecommendUserItem from "@/components/layout/RightAside/RecommendUserItem";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recommend Users - Connectify",
  description: "...",
};

const RecommendUsers = async () => {
  const users = await getRecommendUsers(true);
  const t = await getTranslations("recommend_users_page");

  return (
    <div className="relative mt-20 sm:mt-0">
      <div className="fixed sm:sticky top-20 sm:top-0 left-0 right-0 row-center gap-5  text-xl font-semibold border border-input bg-card/50 backdrop-blur-lg p-4 z-20">
        <Link href="/">
          <ArrowLeft className="cursor-pointer" />
        </Link>
        {t("header")}
      </div>
      <h6 className="font-semibold text-2xl ms-4 mt-4"> {t("sub_header_text")}</h6>
      <section className="mb-24 mt-4 flex flex-col gap-2 ">
        {users.map((user) => (
          <RecommendUserItem key={user.id} user={user} />
        ))}
      </section>
    </div>
  );
};

export default RecommendUsers;
