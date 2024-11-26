import getExplorePosts from "@/actions/post/getExplorePosts";
import Post from "@/components/ui/common/post/Post";
import { queryType } from "@/types/types";

const Posts = async ({ query }: { query: queryType | null }) => {
  const posts = await getExplorePosts(query);
  return (
    <>
      {posts?.map((post) => (
        <Post key={post.id} post={post} isMyPost={post.isMyPost} />
      ))}
    </>
  );
};

export default Posts;
