"use client";

import { useToast } from "@/hooks/use-toast";
import { Button } from "../../button";
import deletePost from "@/actions/post/deletePost";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const DeletePost = ({
  postId,
  isDetailPage = false,
}: {
  postId: string;
  isDetailPage?: boolean;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const t = useTranslations("components");
  const handleDeleteToPost = async () => {
    try {
      await deletePost(postId);
      if (isDetailPage) router.push("/");

      toast({
        variant: "default",
        title: "Post delete process succesfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    }
  };
  return <Button onClick={handleDeleteToPost}>{t("delete_post_button")}</Button>;
};

export default DeletePost;
