import getFriendRequests from "@/actions/user/getFriendRequests";
import NotificationsItem from "@/components/Notifications/NotificationsItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { NotificationType } from "@/types/types";
import { Bell, ChevronRight, UserPlus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Notifications - Connectify",
  description: "...",
};

const Notifications = async () => {
  const count = await getFriendRequests(true);
  const res = await api.get<NotificationType[]>(
    "/notifications?extended=true",
    {
      header: Object.fromEntries(headers().entries()),
    }
  );

  const readNotifications = res.data?.filter((notify) => notify.read);
  const notReadNotifications = res.data?.filter((notify) => !notify.read);

  const t = await getTranslations("notifications_page");
  return (
    <div className="relative">
      <h6 className="text-2xl sm:text-3xl font-semibold row-center gap-3 p-4 mb-4 sm:rounded-lg border border-input bg-card">
        <Bell className="bg-primary/30 size-10 p-2 rounded-full text-purple-800 dark:text-purple-200" />
        {t("header")}
      </h6>
      <Link
        href="/notifications/friend-requests"
        className="[&_.btn-icon]:hover:opacity-100 [&_.btn-icon]:hover:translate-x-0 flex gap-3 p-3 bg-fuchsia-800/20 my-4 sm:rounded-lg cursor-pointer  border-2  border-transparent hover:border-primary"
      >
        <UserPlus className="bg-purple-900 p-2 xs:p-3 size-10 xs:size-12 overflow-visible rounded-full text-white" />
        <div>
          <h6 className="font-semibold xs:text-lg">
            {t("friend_requests_header")}
          </h6>
          <p className="text-muted-foreground text-sm xs:text-base">
            {t("friend_requests_text", { count: count.toString() })}
          </p>
        </div>
        <ChevronRight
          size={35}
          className="my-auto me-2 ms-auto transition-all btn-icon -translate-x-4 opacity-0 hidden sm:inline"
        />
      </Link>
      <Tabs defaultValue="new">
        <TabsList className="w-full bg-primary/40 dark:bg-primary/20 py-6 xs:py-7 justify-start   ">
          <TabsTrigger
            className="data-[state=active]:bg-primary/70 dark:data-[state=active]:bg-background py-2 xs:text-lg text-foreground"
            value="new"
          >
            {t("tab_text_1")}
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary/70 dark:data-[state=active]:bg-background py-2 xs:text-lg text-foreground"
            value="read"
          >
            {t("tab_text_2")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="new" className="mt-4">
          <div className="flex flex-col gap-4">
            {notReadNotifications &&
              notReadNotifications.map((notify) => (
                <NotificationsItem notify={notify} key={notify.id} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="read">
          <div className="flex flex-col gap-4">
            {readNotifications &&
              readNotifications.map((notify) => (
                <NotificationsItem readed notify={notify} key={notify.id} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
