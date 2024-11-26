"use client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Loader,
  Image as LucideImage,
  Pencil,
  SmilePlus,
  SquarePlay,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState, useTransition } from "react";
import Image from "next/image";
import ReactPlayer from "react-player";
import Tooltip from "../Tooltip";
import EmojiPicker from "../EmojiPicker";
import WarningModal from "../WarningModal";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../dialog";
import { MediaType, PostType, PreviewType } from "@/types/types";
import updatePost from "@/actions/post/updatePost";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const EditPostModal = ({ post }: { post: PostType }) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("components.edit_post_modal");
  const form = useRef<HTMLFormElement | null>(null);
  const [postText, setPostText] = useState<string>(post.content || "");
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [mediaPreview, setMediaPreview] = useState<PreviewType | null>(
    post.media || null
  );
  const [pending, startTransition] = useTransition();
  const [isEmojiPickerVisible, setEmojiPickerVisibility] =
    useState<boolean>(false);

  const handleMediaSelection = (
    e: ChangeEvent<HTMLInputElement>,
    mediaType: "IMAGE" | "VIDEO"
  ) => {
    const file = e.target.files ? e.target.files[0] : undefined;
    if (file) {
      setSelectedMedia({
        type: mediaType,
        file,
      });
      const previewUrl = URL.createObjectURL(file);
      setMediaPreview({
        type: mediaType,
        url: previewUrl,
      });
    }
    e.target.value = "";
  };

  const clearMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
  };

  const handlePostSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (postText.length > 250) return;
    if (!(postText.trim() || selectedMedia)) return;
    const formData = new FormData();
    formData.append("content", postText);
    formData.append("postId", post.id);
    if (selectedMedia) {
      formData.append("mediaFile", selectedMedia?.file);
      formData.append("mediaType", selectedMedia?.type);
    }
    try {
      startTransition(async () => {
        const res = await updatePost(formData);
        if (res.success) {
          router.refresh();
          toast({
            variant: "default",
            title: "Post updating successfully",
          });
          setSelectedMedia(null);
          setMediaPreview(null);
          setPostText("");
        }
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
      });
    }
  };

  return (
    <DialogContent className="bg-card">
      <DialogHeader>
        <DialogTitle className="text-2xl">{t("modal_header")}</DialogTitle>
        <DialogDescription></DialogDescription>
      </DialogHeader>
      <form ref={form} onSubmit={handlePostSubmit}>
        <AutosizeTextarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={t("modal_input_placeholder")}
          className="bg-transparent border-none  xs:text-lg focus-visible:ring-offset-0 focus-visible:ring-0 resize-none p-0"
          maxHeight={250}
          maxLength={200}
        />

        {mediaPreview && (
          <div className="relative">
            <X
              className="absolute right-0 top-4 bg-primary size-10 p-2 rounded-full cursor-pointer z-20"
              onClick={clearMedia}
            />
            <Separator className="my-4 " />
            {mediaPreview?.type === "VIDEO" ? (
              <div className=" min-[500px]:h-[300px]">
                <ReactPlayer
                  controls
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                  url={mediaPreview.url}
                />
              </div>
            ) : (
              mediaPreview?.url && (
                <div className="relative w-full h-[300px] dark:bg-gray-900 bg-gray-200 rounded-lg">
                  <Image
                    fill
                    priority
                    alt=""
                    className="object-cover"
                    src={mediaPreview?.url}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
                  />
                </div>
              )
            )}
          </div>
        )}

        <Separator className="my-4 " />
        <div className="row-center gap-4">
          <Tooltip message={t("edit_post_tooltip_1")}>
            <label className="relative" htmlFor="imageUpload">
              <LucideImage className="cursor-pointer" />
              <input
                id="imageUpload"
                type="file"
                className="hidden "
                accept="image/*"
                onChange={(e) => handleMediaSelection(e, "IMAGE")}
              />
            </label>
          </Tooltip>
          <Tooltip message={t("edit_post_tooltip_2")}>
            <label htmlFor="videoUpload" className="relative">
              <SquarePlay className="cursor-pointer" />
              <input
                id="videoUpload"
                type="file"
                className="hidden "
                accept="video/*"
                onChange={(e) => handleMediaSelection(e, "VIDEO")}
              />
            </label>
          </Tooltip>
          <div className="relative">
            <Tooltip message={t("edit_post_tooltip_3")}>
              <SmilePlus
                onClick={(e) => {
                  e.preventDefault();
                  setEmojiPickerVisibility(!isEmojiPickerVisible);
                }}
                className="cursor-pointer"
              />
            </Tooltip>

            {isEmojiPickerVisible && (
              <EmojiPicker
                setIsPickerVisible={setEmojiPickerVisibility}
                setContent={setPostText}
                className="!-top-[320px]  min-[480px]:!left-full"
              />
            )}
          </div>
          <WarningModal
            header={t("update_post_modal.modal_header")}
            desc={t("update_post_modal.modal_title")}
            trigger={
              <Button variant="default" className="gap-2 ms-auto">
                <Pencil />
                {t("modal_button_text")}
              </Button>
            }
            action={
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (form.current)
                      form.current.dispatchEvent(
                        new Event("submit", { cancelable: true, bubbles: true })
                      );
                  }}
                  disabled={pending}
                  variant="default"
                  className="gap-2"
                >
                  {pending ? (
                    <>
                      {t("loading")}
                      <Loader size={20} className="animate-spin ms-2" />
                    </>
                  ) : (
                    <>
                      <Pencil />
                      {t("modal_button_text")}
                    </>
                  )}
                </Button>
              </DialogClose>
            }
          />
        </div>
      </form>
    </DialogContent>
  );
};

export default EditPostModal;
