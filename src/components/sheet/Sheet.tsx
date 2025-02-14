import {
  Sheet as ShadcnSheet,
  SheetClose,
  SheetContent,
  SheetFooter,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/utils/useWindowSize";
import { cn } from "@/lib/utils";
import { useSheetStore } from "@/stores/ui/userSheetStore";

interface SheetProps {
  children?: React.ReactNode;
  defaultClose?: boolean;
  footer?: React.ReactNode;
  description?: string;
  title?: string;
  slotProps?: {
    content?: {
      className?: string;
    };
  };
}

const SheetComponent = ({
  children,
  defaultClose = false,
  footer,
  slotProps,
}: SheetProps) => {
  const { open, setOpen } = useSheetStore();
  const { width } = useWindowSize();
  return (
    <ShadcnSheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={width < 640 ? "bottom" : "right"}
        defaultClose={width < 640 ? true : defaultClose}
        style={{
          height: width < 640 ? "100%" : "auto",
        }}
        className={cn(
          "sm:w-[90%] sm:min-w-[90%] p-6 max-h-full max-sm:overflow-auto ",
          slotProps?.content?.className,
        )}
      >
        <> {children}</>
        {footer && (
          <SheetFooter>
            <SheetClose asChild>{footer} </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </ShadcnSheet>
  );
};

export default SheetComponent;
