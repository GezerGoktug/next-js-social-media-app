import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import FollowButton from "../ui/common/FollowButton";

interface UserType {
  image: string | null;
  name: string;
  username: string | null;
  id: string;
}

const FollowUserItem = ({ user }: { user: UserType }) => {
  return (
    <div className="row-center gap-3 xs:gap-4 border-2 border-input bg-card p-4 sm:rounded-lg">
      <Avatar className="outline outline-2 outline-primary outline-offset-2 size-12">
        <AvatarImage src={user.image ?? undefined} alt="" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="font-semibold ">{user.name}</h4>
        <span className="text-sm  text-gray-500">@{user.username}</span>
      </div>
      <FollowButton
        followToUserId={user.id}
        size="default"
        className="ms-auto gap-2 rounded-full"
      />
    </div>
  );
};

export default FollowUserItem;
