import { Button } from "@/components/ui/button";
import Link from "next/link";
import FriendRequestItem from "./FriendRequestItem";
import getFriendRequests from "@/actions/user/getFriendRequests";
import { getTranslations } from "next-intl/server";

const FriendRequests = async () => {
  const reqs = await getFriendRequests();
  const t = await getTranslations("layout_sections.friend_requests");

  return (
    <div className="hidden xl:block border-2 border-input/50 rounded-lg bg-slate-50 dark:bg-gray-950 p-4">
      <h6 className="text-lg font-medium">
        {t("title")}{" "}
        <span className=" ms-2 bg-primary text-primary-foreground rounded-lg px-3 py-1">
          {typeof reqs !== "number" && reqs.length}
        </span>
      </h6>
      <ul className="mt-6 space-y-6">
        {typeof reqs !== "number" &&
          (reqs.length === 0 ? (
            <div className="text-center py-6">{t("have_any_requests")}</div>
          ) : (
            reqs.map((req, index) => (
              <FriendRequestItem key={index} req={req} />
            ))
          ))}
      </ul>
      <Link href="/notifications/friend-requests">
        <Button
          variant="ghost"
          className="w-full mt-3 hover:bg-primary/20 hover:text-primary text-secondary text-lg"
        >
          {t("button")}
        </Button>
      </Link>
    </div>
  );
};

export default FriendRequests;
