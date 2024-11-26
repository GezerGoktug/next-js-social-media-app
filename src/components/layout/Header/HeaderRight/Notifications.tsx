"use client";
import { Bell, BellRing, RefreshCcw } from "lucide-react";
import "dayjs/locale/tr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { ScrollArea } from "../../../ui/scroll-area";
import { Button } from "../../../ui/button";
import Tooltip from "@/components/ui/common/Tooltip";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useSocket } from "@/Providers/SocketProvider";
import { NotificationType } from "@/types/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter, useSearchParams } from "next/navigation";
import markReadNotify from "@/actions/notifications/markReadNotify";
import { useLocale, useTranslations } from "next-intl";

const NotificationItem = ({
  notify,
  revalidateClickNotify,
}: {
  notify: NotificationType;
  revalidateClickNotify: () => void;
}) => {
  dayjs.extend(relativeTime);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("layout_sections.header.notification_section")
  const notifyTextGenerator = () => {
    switch (notify?.type) {
      case "LIKE":
        return t("notification_text_1",{name:notify?.sender.name});
      case "REPOST":
        return t("notification_text_2",{name:notify?.sender.name});
      case "FRIEND_REQUEST":
        return t("notification_text_3",{name:notify?.sender.name});
      case "COMMENT":
        return t("notification_text_4",{name:notify?.sender.name});
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
    revalidateClickNotify();
    router.push(clickToLinkGenerator());
  };

  return (
    <>
      <DropdownMenuItem
        onClick={handleClickNotify}
        className="flex gap-4 items-start max-w-96"
      >
        <Avatar className="size-10 xs:size-12 outline outline-secondary outline-offset-2">
          <AvatarImage src={notify?.sender.image ?? undefined} alt="" />
          <AvatarFallback className="text-2xl">CN</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="line-clamp-3 text-xs">{notifyTextGenerator()}</p>
          <span className="text-secondary font-semibold text-xs">
            {dayjs(notify?.createdAt).locale(locale).fromNow()}
          </span>
        </div>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
    </>
  );
};

const Notifications = () => {
  const { socket } = useSocket();
  const t = useTranslations("layout_sections.header.notification_section");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [readNotifications, setReadNotifications] = useState<
    NotificationType[]
  >([]);
  const fetchNotify = async () => {
    const res = await api.get<NotificationType[]>("/notifications");

    if (res?.data) {
      setNotifications(res.data.filter((notify) => !notify.read));
      setReadNotifications(res.data.filter((notify) => notify.read));
    }
  };

  useEffect(() => {
    fetchNotify();

    socket?.on("notification", (notify) => {
      if (notify.opr === "CREATE") {
        setNotifications((prev) => {
          if (prev.length === 7) {
            const filteredArr = prev.filter(
              (item) => prev[prev.length - 1] !== item
            );
            return [notify, ...filteredArr];
          }
          return [notify, ...prev];
        });
      } else {
        fetchNotify();
      }
    });

    return () => {
      if (socket) {
        socket?.off("notification");
      }
    };
  }, [socket]);

  return (
    <DropdownMenu>
      <Tooltip message={t("tooltip")}>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="relative">
            <Bell className="size-5 xs:size-6" />
            <span className="absolute -top-1 -right-1 bg-destructive p-1 xs:p-2 size-4 font-semibold flex-center text-xs text-white rounded-full">
              {notifications.length}
            </span>
          </div>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className=" max-w-[300px] xs:max-w-96">
        <DropdownMenuLabel className="text-2xl row-center gap-2">
          <BellRing className="p-2 bg-secondary text-white shadow-md overflow-visible rounded-full size-10" />
          {t("title")}
          <RefreshCcw
            onClick={() => fetchNotify()}
            className="ms-auto me-2 rounded-full bg-secondary p-1 size-8  cursor-pointer"
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Tabs defaultValue="new-notifications">
          <TabsList className="bg-secondary text-white gap-2 xs:gap-4">
            <TabsTrigger
              className="data-[state=active]:bg-indigo-700 "
              value="new-notifications"
            >
              {t("tab_text_1")}
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-indigo-700 "
              value="read-notifications"
            >
              {t("tab_text_2")}
            </TabsTrigger>
          </TabsList>
          <ScrollArea className=" h-[300px] ">
            <TabsContent value="new-notifications">
              {notifications?.map((notify) => (
                <NotificationItem
                  revalidateClickNotify={() => fetchNotify()}
                  key={notify.id}
                  notify={notify}
                />
              ))}
            </TabsContent>
            <TabsContent value="read-notifications">
              {readNotifications?.map((notify) => (
                <NotificationItem
                  revalidateClickNotify={() => fetchNotify()}
                  key={notify.id}
                  notify={notify}
                />
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        <DropdownMenuItem asChild>
          <Link href="/notifications">
            <Button
              variant="default"
              className="w-full bg-secondary cursor-pointer hover:!bg-secondary/90 hover:!text-white"
            >
              {t("button")}
            </Button>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
