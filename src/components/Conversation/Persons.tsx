import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, MessageSquareShare } from "lucide-react";
import PersonItem from "./PersonItem";
import { Dialog, DialogTrigger } from "../ui/dialog";
import CreateNewConversation from "./CreateNewConversation";
import api from "@/lib/api";
import { headers } from "next/headers";
import { PersonItemType } from "@/types/types";
import { getTranslations } from "next-intl/server";

const Persons = async () => {
  const res = await api.get<PersonItemType[]>("/conversations", {
    header: Object.fromEntries(headers().entries()),
    cache: "no-store",
  });
  const t = await getTranslations("conversations_page");
  return (
    <div className="bg-card border border-input sm:rounded-lg pb-3">
      <div className="flex-between p-4 border-b">
        <h6 className="row-center text-2xl gap-3 font-bold">
          <Mail />
          {t("header")}
        </h6>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon">
              <MessageSquareShare />
            </Button>
          </DialogTrigger>
          <CreateNewConversation />
        </Dialog>
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="flex flex-col border-y-2 border-input divide-y-2">
          {res?.data?.map((person, index) => (
            <PersonItem key={index} person={person} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Persons;
