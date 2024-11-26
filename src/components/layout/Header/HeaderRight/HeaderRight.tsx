import Search from "./Search";
import Messages from "./Messages";
import Notifications from "./Notifications";
import Profile from "./Profile";
import { getCurrentUser } from "@/actions/util/getUserInfos";

const HeaderRight = async () => {
  const user = await getCurrentUser();
  return (
    <nav className="row-center gap-4 xs:gap-6">
      <Search />
      <Messages />
      <Notifications />
      {user && <Profile user={user} />}
    </nav>
  );
};

export default HeaderRight;
