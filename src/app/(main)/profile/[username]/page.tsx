import { getUsername } from "@/actions/util/getUserInfos";
import Posts from "@/components/Profile/Posts";
import PostsTabs from "@/components/Profile/PostsTabs";
import ProfileOverview from "@/components/Profile/ProfileOverview";
import RecommendUsers from "@/components/Profile/RecommendUsers";
import api from "@/lib/api";
import { ProfileType } from "@/types/types";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const res = await api.get<ProfileType>(`/profile/${params.username}`, {
    header: Object.fromEntries(headers().entries()),
    cache: "no-store",
  });

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
