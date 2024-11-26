import {
  MessageSquareText,
  TimerIcon,
  UserCheckIcon,
  UserRoundPlus,
} from "lucide-react";
import { Button } from "../ui/button";
import FollowButton from "../ui/common/FollowButton";
import SendMessageButton from "../ui/common/SendMessageButton";
import { getTranslations } from "next-intl/server";

const ProfileUserActions = async ({ id }: { id: string }) => {
  const t = await getTranslations("profile_page.profile_user_actions");
  return (
    <>
      <SendMessageButton userId={id}>
        <Button
          variant="default"
          size="icon"
          className="me-2 xs:me-4 rounded-full gap-2"
        >
          <MessageSquareText />
        </Button>
      </SendMessageButton>
      <FollowButton
        followToUserId={id}
        isDefaultStatusToContentButton={
          <>
            <UserRoundPlus />
            {t("default_status_text")}
          </>
        }
        isFollowingStatusToContentButton={
          <>
            <UserCheckIcon />
            {t("following_status_text")}
          </>
        }
        isRequestingStatusToContentButton={
          <>
            <TimerIcon />
            {t("follow_requesting_status_text")}
          </>
        }
        size="default"
        className="xs:me-2 rounded-full gap-2"
      />
    </>
  );
};

export default ProfileUserActions;
