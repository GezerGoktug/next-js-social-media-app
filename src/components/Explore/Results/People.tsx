import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/ui/common/FollowButton";
import api from "@/lib/api";
import { UserItemType } from "@/types/types";
import { headers } from "next/headers";

const People = async ({ search }: { search: string }) => {
  const res = await api.get<UserItemType[]>(`/user-search?q=${search}`, {
    header: Object.fromEntries(headers().entries()),
  });

  return (
    <>
      {res.data &&
        res.data.map((people) => (
          <div
            key={people.id}
            className="row-center gap-4 border-2 border-input bg-card px-4 py-4 sm:rounded-lg"
          >
            <Avatar className="outline outline-2 outline-primary outline-offset-2 size-12">
              <AvatarImage src={people.image} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold ">{people.name}</h4>
              <span className="text-sm     text-gray-500">
                @{people.username}
              </span>
            </div>
            <FollowButton
              size="default"
              followToUserId={people.id}
              className="ms-auto"
            />
          </div>
        ))}
    </>
  );
};

export default People;
