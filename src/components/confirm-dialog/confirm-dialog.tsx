import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";

interface IConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  closeText?: string;
  content: React.ReactNode;
  confirmText?: string;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export function ConfirmDialog({
  children,
  title,
  description,
  closeText = "Close",
  content,
  confirmText = "Confirm",
  onClick,
  isLoading = false,
  isDisabled = false,
}: IConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex items-center space-x-2">{content}</div>
        <DialogFooter className=" flex   w-full justify-end ">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {closeText}
            </Button>
          </DialogClose>
          <Button
            variant="default"
            className=" w-fit"
            onClick={onClick && onClick}
            disabled={isDisabled}
          >
            {isLoading ? (
              <div className="flex gap-2 items-center">
                <LoaderCircle className="animate-spin size-4" />
                Loading...
              </div>
            ) : (
              <>{confirmText}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
