import getPostDetail from "@/actions/post/getPostDetail";
import Comments from "@/components/PostDetail/Comments";
import CreateComment from "@/components/PostDetail/CreateComment";
import PostDetailContent from "@/components/PostDetail/PostDetailContent";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const postDetail = await getPostDetail(params.id);

  const contentPreview = postDetail.content
    ? postDetail.content.length > 60
      ? `${postDetail.content.slice(0, 60)}...`
      : postDetail.content
    : "";

  return {
    title: `${postDetail.user.username}'s post: ${contentPreview}`,
    description: postDetail.content,
    openGraph: {
      title: postDetail.user.username + "'s post:" + postDetail.content,
      description: postDetail.content || "",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${params.id}`,
      images: [
        {
          url:
            postDetail.media?.url ||
            (process.env.NEXT_PUBLIC_DEFAULT_LOGO_URL as string),
          alt: `${postDetail.user.username}'s post: ${contentPreview}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${postDetail.user.username}'s post: ${contentPreview}`,
      description: postDetail.content || "",
      images: [
        postDetail.media?.url ||
          (process.env.NEXT_PUBLIC_DEFAULT_LOGO_URL as string),
      ],
    },
  };
}

const PostDetail = async ({ params }: { params: { id: string } }) => {
  const { comments, ...postDetail } = await getPostDetail(params.id);

  const t = await getTranslations("post_detail_page");

  return (
    <div className="relative bg-card  my-[50px] sm:my-0  ">
      <div className="fixed sm:sticky top-20 sm:top-0 left-0 right-0 row-center gap-3  text-xl font-semibold border border-input bg-card/50 backdrop-blur-lg p-4 z-20">
        <Link href="/">
          <ArrowLeft className="cursor-pointer" />
        </Link>
        {t("title")}
      </div>
      <Card className="!rounded-none">
        <CardContent className="pt-6">
          <PostDetailContent post={postDetail} isMyPost={postDetail.isMyPost} />

          <Separator />
          <CreateComment
            sendingUserId={postDetail.userId}
            postId={postDetail.id}
          />

          <Comments comments={comments} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
