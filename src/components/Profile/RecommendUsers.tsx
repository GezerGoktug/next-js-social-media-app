import { UsersRound } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import RecommendUserItem from "../layout/RightAside/RecommendUserItem";
import getRecommendUsers from "@/actions/user/getRecommendUsers";
import { getTranslations } from "next-intl/server";

const RecommendUsers = async () => {
  const users = await getRecommendUsers();
  const t = await getTranslations("profile_page.recommend_users");

  return (
    <div className="bg-card px-4 py-3 border-2 border-input/50 rounded-lg my-3">
      <div className="row-center gap-3 mb-3">
        <UsersRound className="bg-gradient-to-br from-primary text-white to-fuchsia-500 size-10 p-2 rounded-lg" />
        <h6 className="font-semibold text-xl">{t("title")}</h6>
      </div>
      <Separator />
      <div className="mt-4 flex flex-col gap-2">
        {users.map((user) => (
          <RecommendUserItem key={user.id} user={user} />
        ))}
      </div>
      <Link href="/recommend-users">
        <Button
          variant="ghost"
          className="w-full mt-3 hover:bg-primary/20 hover:text-primary text-secondary text-lg"
        >
          {t("button")}
        </Button>
      </Link>
    </div>
  );
};

export default RecommendUsers;
