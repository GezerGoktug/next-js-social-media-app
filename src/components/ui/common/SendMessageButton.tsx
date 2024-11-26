"use client";
import createNewConversation from "@/actions/chat/createNewConversation";
import haveConversationToUser from "@/actions/chat/haveConversationToUser";
import { useRouter } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

interface SendMessageButtonProps {
  children: ReactNode;
  userId: string;
  className?: string;
}

const SendMessageButton = forwardRef<HTMLDivElement, SendMessageButtonProps>(
  ({ children, userId, className = "" }, ref) => {
    const isMobileScreenSize = useMediaQuery({
      query: "(min-width: 640px)",
    });
    const router = useRouter();
    const handleConversationsToUser = async () => {
      const res = await haveConversationToUser(userId);
      if (res.isFindConv) {
        if (!isMobileScreenSize) router.push(`/conversation/${res.convId}`);
        else router.push(`/conversation?conversation_id=${res.convId}`);
      } else {
        const res = await createNewConversation(userId);
        if (res?.success) {
          router.prefetch(`/conversation/${res.convId}`);
          if (!isMobileScreenSize) router.push(`/conversation/${res.convId}`);
          else router.push(`/conversation?conversation_id=${res.convId}`);
        }
      }
    };
    return (
      <div
        ref={ref as any}
        className={className}
        onClick={handleConversationsToUser}
      >
        {children}
      </div>
    );
  }
);

SendMessageButton.displayName = "SendMessageButton";

export default SendMessageButton;
