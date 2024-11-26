"use client";
import { evaluationOfFriendRequest } from "@/actions/user/followingHandle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Tooltip from "@/components/ui/common/Tooltip";
import { FriendReqItemType } from "@/types/types";
import { UserRoundPlus, UserRoundX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const FriendRequestItem = ({ req }: { req: FriendReqItemType }) => {
  const router = useRouter();
  const t = useTranslations("layout_sections.friend_requests")
  const evalReq = async (status: boolean) => {
    await evaluationOfFriendRequest(req?.senderId, status);
    router.refresh();
  };
  return (
    <li className="row-center">
      <Avatar className="outline outline-2 outline-primary outline-offset-2 size-12">
        <AvatarImage src={req?.sender.image ?? undefined} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="w-full row-center  rounded-lg bg-card py-2 ps-8 pe-3 -ms-5 border border-input/50  shadow">
        <div className="flex flex-col">
          <span className="font-medium">{req?.sender.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            @{req?.sender.username}
          </span>
        </div>
        <Tooltip message={t("reject_tooltip")}>
          <Button
            onClick={() => evalReq(false)}
            className="ms-auto me-2 size-7 p-1 "
            size="icon"
            variant="destructive"
          >
            <UserRoundX />
          </Button>
        </Tooltip>
        <Tooltip message={t("accept_tooltip")}>
          <Button
            onClick={() => evalReq(true)}
            size="icon"
            className="size-7 p-1"
            variant="success"
          >
            <UserRoundPlus />
          </Button>
        </Tooltip>
      </div>
    </li>
  );
};

export default FriendRequestItem;
