import {
  Tooltip as TooltipWrapper,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactNode } from "react";
const Tooltip = ({
  children,
  message,
}: {
  children: ReactNode;
  message: string;
}) => {
  return (
    <TooltipProvider>
      <TooltipWrapper>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{message}</p>
        </TooltipContent>
      </TooltipWrapper>
    </TooltipProvider>
  );
};

export default Tooltip;
