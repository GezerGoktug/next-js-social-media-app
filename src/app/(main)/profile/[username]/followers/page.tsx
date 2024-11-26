import getFollowers from "@/actions/user/getFollowers";
import FollowUserItem from "@/components/Profile/FollowUserItem";

import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const Followers = async ({
  params,
}: {
  params: {
    username: string;
  };
}) => {
  const followers = await getFollowers(params.username);
  const t = await getTranslations("followers_page");
  return (
    <div className="relative mt-20 sm:mt-0">
      <div className="fixed sm:sticky top-20 sm:top-0 left-0 right-0 row-center gap-5  text-xl font-semibold border border-input bg-card/50 backdrop-blur-lg px-4 py-2 z-20">
        <Link href={`/profile/${params.username}?posts_type=base`}>
          <ArrowLeft className="cursor-pointer" />
        </Link>
        <div>
          {t("text")}
          <div className="text-sm font-medium">
            {followers?.length} {t("text")}
          </div>
        </div>
      </div>
      <section className="mb-24 mt-4 flex flex-col gap-2 ">
        {followers?.map((item) => (
          <FollowUserItem user={item} key={item.id} />
        ))}
      </section>
    </div>
  );
};

export default Followers;
