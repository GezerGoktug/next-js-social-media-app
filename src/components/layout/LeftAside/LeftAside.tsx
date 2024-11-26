import { ScrollArea } from "@/components/ui/scroll-area";
import FriendRequests from "./FriendRequests";
import AsideNavLinks from "./AsideNavLinks";
import ConditionalRenderWrapper from "../ConditionalRenderWrapper";
import { getUsername } from "@/actions/util/getUserInfos";

const LeftAside = async () => {
  const username = await getUsername();

  return (
    <ScrollArea className="sm:h-[calc(100vh-96px)] sm:py-4">
      <aside>
        {<AsideNavLinks username={username ? username : null} />}
        <ConditionalRenderWrapper
          disabledPath={["/notifications/friend-requests"]}
        >
          <FriendRequests />
        </ConditionalRenderWrapper>
      </aside>
    </ScrollArea>
  );
};

export default LeftAside;
