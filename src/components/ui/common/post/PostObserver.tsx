"use client";

import increaseView from "@/actions/post/increaseView";
import { FC, ReactNode, useEffect, useRef } from "react";

interface PostObserverProps {
  children: ReactNode;
  postId: string;
}

const PostObserver: FC<PostObserverProps> = ({ children, postId }) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            await increaseView(postId);

            if (boxRef.current) observer.unobserve(boxRef?.current);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (boxRef.current) observer.observe(boxRef.current);
  }, [boxRef]);
  return <div ref={boxRef}>{children}</div>;
};

export default PostObserver;
