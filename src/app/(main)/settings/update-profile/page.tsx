import { getCurrentUser } from "@/actions/util/getUserInfos";
import UpdateProfileClient from "@/components/Settings/UpdateProfileClient";

const UpdateProfile = async () => {
  const currentUser = await getCurrentUser();

  return (
    <>{currentUser && <UpdateProfileClient currentUser={currentUser} />}</>
  );
};

export default UpdateProfile;
