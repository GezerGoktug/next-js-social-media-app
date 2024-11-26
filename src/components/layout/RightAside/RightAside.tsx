import { ScrollArea } from "@/components/ui/scroll-area";
import RecommendUsers from "./RecommendUsers";
import Trends from "./Trends";
import Footer from "./Footer";
import ConditionalRenderWrapper from "../ConditionalRenderWrapper";

const RightAside = async () => {
  return (
    <ScrollArea className="sm:h-[calc(100vh-96px)] sm:py-4 hidden lg:block">
      <aside>
        <RecommendUsers />
        <ConditionalRenderWrapper disabledPath={["/explore"]}>
          <Trends />
        </ConditionalRenderWrapper>
        <Footer />
      </aside>
    </ScrollArea>
  );
};

export default RightAside;
