import Post from "@/components/ui/common/post/Post";
import getMySavedPosts from "@/actions/post/getSavedPosts";
import ClearSavedPostsButton from "@/components/Saved/ClearSavedPostsButton";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: 'My Saved Posts - Connectify',
  description: '...',
}

const Saved = async () => {
  const posts = await getMySavedPosts();
  const t = await getTranslations("saved_page");

  return (
    <>
      <div className="flex-between p-4 sm:rounded-lg bg-card mb-3 border border-input">
        <h6 className="text-2xl font-semibold">{t("title")}</h6>
        <ClearSavedPostsButton />
      </div>
      <section className="mb-24 flex flex-col gap-3 ">
        {posts.map((post) => (
          <Post key={post.id} post={post} isMyPost={post.isMyPost} />
        ))}
      </section>
    </>
  );
};

export default Saved;
