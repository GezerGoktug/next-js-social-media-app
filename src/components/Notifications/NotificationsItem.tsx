"use client";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { NotificationType } from "@/types/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import markReadNotify from "@/actions/notifications/markReadNotify";
import deleteNotify from "@/actions/notifications/deleteNotify";
import { useLocale, useTranslations } from "next-intl";
import "dayjs/locale/tr";

const NotificationsItem = ({
  readed,
  notify,
}: {
  readed?: boolean;
  notify: NotificationType;
}) => {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const t = useTranslations("notifications_page");
  const locale = useLocale();
  const notifyTextGenerator = () => {
    switch (notify?.type) {
      case "LIKE":
        return t("notification_text_1", { name: notify?.sender.name });
      case "REPOST":
        return t("notification_text_2", { name: notify?.sender.name });
      case "FRIEND_REQUEST":
        return t("notification_text_3", { name: notify?.sender.name });
      case "COMMENT":
        return t("notification_text_4", { name: notify?.sender.name });
    }
  };

  const clickToLinkGenerator = () => {
    switch (notify?.type) {
      case "LIKE":
        return `/post/detail/${notify?.postId}`;
      case "REPOST":
        return `/post/detail/${notify?.postId}`;
      case "FRIEND_REQUEST":
        return `/notifications/friend-requests`;
      case "COMMENT":
        return `/post/detail/${notify?.postId}`;
    }
  };

  const handleClickNotify = async () => {
    if (!notify.read) await markReadNotify(notify.id);

    router.refresh();
    router.push(clickToLinkGenerator());
  };
  const deleteNotification = async () => {
    deleteNotify(notify.id);
    router.refresh();
  };

  return (
    <div className="flex border-2 border-input hover:border-primary cursor-pointer bg-card p-4 sm:rounded-lg">
      <div className="flex gap-4" onClick={handleClickNotify}>
        <Avatar className="outline outline-2 outline-primary outline-offset-2 size-10 xs:size-12">
          <AvatarImage src={notify?.sender.image ?? undefined} alt="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm xs:text-base">{notifyTextGenerator()}</p>
          <span className="text-gray-500 text-sm">
            {dayjs(notify?.createdAt).locale(locale).fromNow()}
          </span>
        </div>
      </div>
      <div className="ms-auto">
        {readed && (
          <Button
            onClick={deleteNotification}
            size="icon"
            variant="destructive"
          >
            <Trash2 />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotificationsItem;
