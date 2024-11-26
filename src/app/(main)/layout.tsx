import LeftAside from "@/components/layout/LeftAside/LeftAside";
import RightAside from "@/components/layout/RightAside/RightAside";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReactNode } from "react";
import Header from "@/components/layout/Header/Header";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="sm:container">
        <main className="grid grid-cols-1  sm:grid-cols-[80px_auto] lg:grid-cols-[80px_auto_350px]  xl:grid-cols-[350px_auto_350px] gap-x-3 pt-20">
          <LeftAside />
          <ScrollArea className="h-[calc(100vh-96px)] sm:py-4">
            <div className="mt-4 sm:mt-0" />
            {children}
          </ScrollArea>
          <RightAside />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
