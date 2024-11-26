"use client";
import { ReactNode, forwardRef, useEffect, useState } from "react";
import { Button } from "../button";
import userFollowingStatus from "@/actions/user/userFollowingStatus";
import {
  cancelFollowing,
  followReqHandle,
} from "@/actions/user/followingHandle";
import { useRouter } from "next/navigation";
import { useSocket } from "@/Providers/SocketProvider";
import { useTranslations } from "next-intl";

type FollowButtonProps = {
  isFollowingStatusToContentButton?: ReactNode;
  isRequestingStatusToContentButton?: ReactNode;
  isDefaultStatusToContentButton?: ReactNode;
  followToUserId: string;
  size?: "default" | "sm" | "lg" | "icon";
  isButton?: boolean;
  className?: string;
  onError?: (error: any) => void;
};

const FollowButton = forwardRef<
  HTMLButtonElement | HTMLDivElement,
  FollowButtonProps
>(
  (
    {
      isFollowingStatusToContentButton,
      isRequestingStatusToContentButton,
      isDefaultStatusToContentButton,
      followToUserId,
      size,
      isButton = true,
      className,
      onError,
    },
    ref
  ) => {
    const router = useRouter();
    const { socket } = useSocket();
    const t = useTranslations("components.follow_button")
    const [followingStatus, setFollowingStatus] = useState({
      isFollowing: false,
      isRequesting: false,
    });

    useEffect(() => {
      const fetchFollowingStatus = async () => {
        try {
          const status = await userFollowingStatus(followToUserId);
          if (status) {
            setFollowingStatus({
              isFollowing: status.isFollowing,
              isRequesting: status.isRequesting,
            });
          }
        } catch (error) {
          onError?.(error);
        }
      };
      fetchFollowingStatus();
    }, [followToUserId, onError]);

    const followingHandle = async () => {
      if (!followingStatus.isFollowing) {
        const prevState = followingStatus;
        setFollowingStatus((prev) => ({
          ...prev,
          isRequesting: !prev.isRequesting,
        }));

        try {
          const res = await followReqHandle(
            followToUserId,
            prevState.isRequesting
          );
          if (res) {
            socket?.emit(
              "notification",
              { ...res.notification, opr: res.opr },
              followToUserId
            );
          }
        } catch (error) {
          setFollowingStatus(prevState);
          onError?.(error);
        }
      } else {
        setFollowingStatus((prev) => ({
          ...prev,
          isFollowing: !prev.isFollowing,
        }));

        try {
          await cancelFollowing(followToUserId);
        } catch (error) {
          setFollowingStatus((prev) => ({
            ...prev,
            isFollowing: true,
          }));
          onError?.(error);
        }
      }
      router.refresh();
    };

    const renderToButtonByFollowStatus = () => {
      if (followingStatus.isFollowing) {
        return isFollowingStatusToContentButton || t("following_status_text");
      }

      return followingStatus.isRequesting
        ? isRequestingStatusToContentButton || t("follow_requesting_status_text")
        : isDefaultStatusToContentButton || t("default_status_text");
    };

    const content = renderToButtonByFollowStatus();

    return isButton ? (
      <Button
        ref={ref as any}
        size={size}
        onClick={followingHandle}
        className={className}
      >
        {content}
      </Button>
    ) : (
      <div ref={ref as any} onClick={followingHandle} className={className}>
        {content}
      </div>
    );
  }
);

FollowButton.displayName = "FollowButton";

export default FollowButton;
