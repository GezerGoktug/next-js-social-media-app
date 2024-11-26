import getFriendRequests from "@/actions/user/getFriendRequests";
import FriendRequestItem from "@/components/Notifications/FriendRequestItem";

const FriendRequests = async () => {
  const reqs = await getFriendRequests();
  return (
    <>
      <h6 className="font-semibold row-center gap-4 text-2xl xs:text-3xl ms-4">
        Pending Requests
        <span className="px-4 py-1 rounded-lg  bg-primary text-white">
          {typeof reqs !== "number" && reqs.length}
        </span>
      </h6>
      <section className="mb-24 mt-4 flex flex-col gap-3 ">
        {typeof reqs !== "number" &&
          reqs.map((req, index) => (
            <FriendRequestItem key={"friend-reqs" + index} req={req} />
          ))}
      </section>
    </>
  );
};

export default FriendRequests;
