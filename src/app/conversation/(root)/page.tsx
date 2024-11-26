import { getUsername } from "@/actions/util/getUserInfos";
import Chat from "@/components/Conversation/Chat";
import ConversationsWrapper from "@/components/Conversation/ConversationWrapper";
import Persons from "@/components/Conversation/Persons";
import Header from "@/components/layout/Header/Header";
import AsideNavLinks from "@/components/layout/LeftAside/AsideNavLinks";

const Conversation = async () => {
  const username = await getUsername();

  return (
    <>
      <Header />
      <div className="sm:container">
        <main className="grid grid-cols-1 h-screen sm:grid-cols-[80px_auto]  lg:grid-cols-[80px_1fr_1.5fr] xl:grid-cols-[80px_auto_750px] 2xl:grid-cols-[80px_auto_800px]   gap-x-3 sm:pt-20">
          <div className="mt-4">
            <AsideNavLinks
              username={username ? username : null}
              isChatPage={true}
            />
          </div>
          <ConversationsWrapper conditionToPersonId={true}>
            <div className="my-16  sm:my-4">
              <Persons />
            </div>
          </ConversationsWrapper>
          <ConversationsWrapper conditionToPersonId={false}>
            <Chat />
          </ConversationsWrapper>
        </main>
      </div>
    </>
  );
};

export default Conversation;
