import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/ui/common/FollowButton";
import Link from "next/link";

interface RecommendUserType {
  id: string;
  name: string;
  image: string | null;
  username: string | null;
}
const RecommendUserItem = ({ user }: { user: RecommendUserType }) => {
  return (
    <div className="row-center gap-4 border-2 border-primary/30 bg-primary/10 px-4 py-2 rounded-lg">
      <Link href={`/profile/${user.username}?posts_type=base`}>
        <Avatar className="outline outline-2 outline-primary outline-offset-2 size-8">
          <AvatarImage src={user?.image ?? undefined} alt="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <h4 className="font-semibold text-sm">{user?.name}</h4>
        <span className="text-xs text-gray-500">@{user?.username}</span>
      </div>
      <FollowButton followToUserId={user?.id} size="sm" className="ms-auto" />
    </div>
  );
};

export default RecommendUserItem;
