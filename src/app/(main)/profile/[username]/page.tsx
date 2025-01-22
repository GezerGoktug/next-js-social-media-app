import { getUsername } from "@/actions/util/getUserInfos";
import Posts from "@/components/Profile/Posts";
import PostsTabs from "@/components/Profile/PostsTabs";
import ProfileOverview from "@/components/Profile/ProfileOverview";
import RecommendUsers from "@/components/Profile/RecommendUsers";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { ProfileType } from "@/types/types";
import { House, UserRoundX } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const res = await api.get<ProfileType>(`/profile/${params.username}`, {
    header: Object.fromEntries(headers().entries()),
    cache: "no-store",
  });
  if (res.error && res.status === 404) {
    return {
      title: "Profile - Connectify",
      description: `Explore a lot of profiles on Connectify. Discover their posts, followers, and more about their journey.`,
    };
  }
  return {
    title: `${params.username}'s Profile - Connectify`,
    description: `Explore ${params.username}'s profile on Connectify. Discover their posts, followers, and more about their journey.`,
    openGraph: {
      title: `${params.username}'s Profile - Connectify`,
      description: `View ${params.username}'s activities, posts, and connections on Connectify.`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${params.username}`,
      images: [
        {
          url:
            res.data?.image ||
            (process.env.NEXT_PUBLIC_DEFAULT_PROFILE_URL as string),
          alt: `${params.username}'s Avatar`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: `${params.username}'s Profile`,
      description: `Check out ${params.username}'s profile on Connectify.`,
      images: [
        res.data?.image ||
          (process.env.NEXT_PUBLIC_DEFAULT_PROFILE_URL as string),
      ],
    },
  };
}

const Profile = async ({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { posts_type: string };
}) => {
  const res = await api.get<ProfileType>(`/profile/${params.username}`, {
    header: Object.fromEntries(headers().entries()),
    cache: "no-store",
  });
  const username = await getUsername();
  const t = await getTranslations("profile_page");

  if (res.error && res.status === 404) {
    return (
      <div className="col-center mt-8">
        <UserRoundX className="size-28" />
        <h6 className="font-semibold text-4xl my-5">
          {t("user_not_found_header")}
        </h6>
        <p>{t("user_not_found_desc")}</p>
        <Link href="/">
          <Button className="gap-2 mt-4">
            <House />
            {t("home_btn_text")}
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <>
      {res.data && (
        <ProfileOverview
          profile={res.data}
          isMyProfile={res.data?.username === username}
        />
      )}
      <RecommendUsers />
      <PostsTabs />
      <Posts username={params.username} postType={searchParams.posts_type} />
    </>
  );
};

export default Profile;
