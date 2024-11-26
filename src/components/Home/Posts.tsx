"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import Post from "../ui/common/post/Post";
import InfiniteScroll from "../ui/infinite-scroll";
import { Loader2 } from "lucide-react";
import { PostType } from "@/types/types"; 

const Posts = ({ initialPosts }: { initialPosts: PostType[] }) => {
  useEffect(() => {
    setMounted(true);
  }, [initialPosts]);

  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(
    initialPosts.length < 5 ? false : true
  );
  const [page, setPage] = useState<number>(2);

  const fetchingMorePosts = async () => {
    if (!mounted) return;
    setLoading(true);

    const res = await api.get<PostType[]>(`/posts?page=${page}`);
    if (res.error) {
      return;
    }
    const posts = res?.data ?? [];
    if (posts.length > 0) {
      setPosts((prv) => [...prv, ...posts]);
      setPage((prv) => prv + 1);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };



  return (
    <>
      {posts.map((post, i) => (
        <Post
          key={"post" + `-${i}-` + post.id}
          post={post}
          isMyPost={post.isMyPost}
        />
      ))}
      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loading}
        next={fetchingMorePosts}
        threshold={1}
      >
        {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin mx-auto" />}
      </InfiniteScroll>
    </>
  );
};

export default Posts;
