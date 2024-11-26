"use client";
import {
  MessageSquareMore,
  TimerIcon,
  UserCheckIcon,
  UserPlus,
} from "lucide-react";
import { DropdownMenuItem } from "../../dropdown-menu";
import FollowButton from "../FollowButton";
import SendMessageButton from "../SendMessageButton";
import { useTranslations } from "next-intl";

const PostUserActions = ({ userId }: { userId: string }) => {
  const t = useTranslations("components.post");
  return (
    <>
      <DropdownMenuItem isClickClose={false} className="gap-2" asChild>
        <FollowButton
          className="cursor-pointer hover:bg-input"
          isButton={false}
          followToUserId={userId}
          isDefaultStatusToContentButton={
            <>
              <UserPlus />
              {t("default_status_text")}
            </>
          }
          isRequestingStatusToContentButton={
            <>
              <TimerIcon />
              {t("follow_requesting_status_text")}
            </>
          }
          isFollowingStatusToContentButton={
            <>
              <UserCheckIcon />
              {t("following_status_text")}
            </>
          }
        />
      </DropdownMenuItem>
      <DropdownMenuItem isClickClose={false} asChild className="gap-2">
        <SendMessageButton
          className="cursor-pointer hover:bg-input"
          userId={userId}
        >
          <MessageSquareMore />
          {t("message_button_text")}
        </SendMessageButton>
      </DropdownMenuItem>
    </>
  );
};

export default PostUserActions;
