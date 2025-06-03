"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import Post from "../ui/common/post/Post";
import InfiniteScroll from "../ui/infinite-scroll";
import { BookOpenCheck, Loader2 } from "lucide-react";
import { PostType } from "@/types/types";
import { toast } from "@/hooks/use-toast";
import { Card } from "../ui/card";

interface IGetPostsResponse {
  posts: PostType[];
  hasMore: boolean;
}

const Posts = ({
  initialPosts,
  initialHasMore,
}: {
  initialPosts: PostType[];
  initialHasMore: boolean;
}) => {
  useEffect(() => {
    setMounted(true);
  }, [initialPosts]);

  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [loading, setLoading] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [page, setPage] = useState<number>(2);

  const fetchingMorePosts = async () => {
    if (!mounted) return;
    setLoading(true);

    const res = await api.get<IGetPostsResponse>(`/posts?page=${page}`);
    if (res.error) {
      toast({
        variant: "destructive",
        title: "Could not be get posts data",
        description: "Please try again",
      });
      return;
    }
    const posts = res?.data?.posts ?? [];
    if (res.data?.hasMore) {
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
        {hasMore ? (
          <Loader2 className="my-4 h-8 w-8 animate-spin mx-auto" />
        ) : (
          <Card className="col-center gap-3 py-12 ">
            <div className="rounded-full bg-primary/30 shadow-primary/30 shadow-md size-16 flex-center">
              <BookOpenCheck className="text-primary" size={35} />
            </div>
            <span className="font-semibold text-lg">
              Looks like you{"'"}ve reached the end
            </span>
          </Card>
        )}
      </InfiniteScroll>
    </>
  );
};

export default Posts;
