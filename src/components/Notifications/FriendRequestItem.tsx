"use client";
import { UserRoundPlus, UserRoundX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { evaluationOfFriendRequest } from "@/actions/user/followingHandle";
import { FriendReqItemType } from "@/types/types";

const FriendRequestItem = ({ req }: { req: FriendReqItemType }) => {
  const router = useRouter();
  const evalReq = async (status: boolean) => {
    await evaluationOfFriendRequest(req?.senderId, status);
    router.refresh();
  };
  return (
    <div className="row-center gap-3 xs:gap-4 border-2 border-input bg-card p-4 sm:rounded-lg">
      <Avatar className="outline outline-2 outline-primary outline-offset-2 size-12">
        <AvatarImage src={req.sender.image ?? undefined} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-semibold ">{req.sender.name}</h4>
        <span className="text-sm     text-gray-500">
          @{req.sender.username}
        </span>
      </div>
      <Button
        onClick={() => evalReq(false)}
        className="ms-auto gap-2"
        size="sm"
        variant="destructive"
      >
        <UserRoundX className="size-5" />
        <span className="hidden min-[420px]:inline">Reject</span>
      </Button>
      <Button
        onClick={() => evalReq(true)}
        size="sm"
        variant="success"
        className="gap-2"
      >
        <UserRoundPlus className="size-5" />
        <span className="hidden min-[420px]:inline">Accept</span>
      </Button>
    </div>
  );
};

export default FriendRequestItem;
