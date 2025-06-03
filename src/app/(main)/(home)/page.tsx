import CreatePost from "@/components/Home/CreatePost";
import Posts from "@/components/Home/Posts";
import api from "@/lib/api";
import { headers } from "next/headers";
import { PostType } from "@/types/types";
import RefreshButton from "@/components/Home/RefreshButton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Connectify",
  description:
    "Welcome to Connectify, where your social journey begins! Discover personalized content, stay connected with your community, and make every moment count. Your hub for connection, interaction, and inspiration.",
};

interface IGetPostsResponse {
  posts: PostType[];
  hasMore: boolean;
}

const Home = async () => {
  const res = await api.get<IGetPostsResponse>("/posts?page=1", {
    header: Object.fromEntries(headers().entries()),
    cache: "no-store",
  });

  return (
    <>
      <CreatePost />
      <RefreshButton />

      <section className="mb-24 flex flex-col gap-3 ">
        {res.data && (
          <Posts
            initialHasMore={res.data.hasMore}
            initialPosts={res.data.posts}
          />
        )}
      </section>
    </>
  );
};

export default Home;
