import getProfilePosts from "@/actions/post/getProfilePosts";
import Post from "../ui/common/post/Post";

const Posts = async ({
  username,
  postType,
}: {
  username: string;
  postType: string;
}) => {
  const posts = await getProfilePosts(postType, username);

  return (
    <section className="mb-24 flex flex-col gap-3 ">
      {posts.map((post) => (
        <Post key={post.id} post={post} isMyPost={post.isMyPost} />
      ))}
    </section>
  );
};

export default Posts;
