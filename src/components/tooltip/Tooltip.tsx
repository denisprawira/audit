import {
  Tooltip as ShacnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipContentProps } from "@radix-ui/react-tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  toopTipContentProps?: TooltipContentProps;
}

const Tooltip = ({
  children,
  content,
  delayDuration = 200,
  toopTipContentProps,
}: TooltipProps) => {
  return (
    <TooltipProvider>
      <ShacnTooltip delayDuration={delayDuration}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...toopTipContentProps}>{content}</TooltipContent>
      </ShacnTooltip>
    </TooltipProvider>
  );
};
export default Tooltip;
