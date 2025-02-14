import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PreviewSummaryContent from "@/features/stock-opname/store-detail/components/preview-summary-content";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  DownloadIcon,
  EyeIcon,
  Loader2,
  StickyNoteIcon,
} from "lucide-react";
import useSummary from "@/hooks/query/stock-opname/useSummary";
import { Input } from "@/components/ui/input";
import { FieldValues, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage,
} from "@/components/ui/form";

interface PreviewSummaryModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  summaryHook: ReturnType<typeof useSummary>;
}
const PreviewSummaryModal = ({
  open,
  setOpen,
  summaryHook,
}: PreviewSummaryModalProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const {
    download: { downloadCountReportQuery, downloadReportQuery },
    downloadReportFilters,
  } = summaryHook;

  const form = useForm<{ so: string; pic: string }>({ mode: "onChange" });

  // Motion Variants
  const leftVariant = {
    visible: { x: 0 },
    hidden: { x: "-100%" },
  };

  const rightVariant = {
    visible: { x: 0 },
    hidden: { x: "100%" },
  };

  const onSubmit = (data: FieldValues) => {
    downloadReportFilters.setReportPic(data.pic);
    downloadReportFilters.setReportSo(data.so);
  };

  useEffect(() => {
    !showPreview && form.reset({});
  }, [showPreview]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setShowPreview(false);
      }}
    >
      <DialogContent
        className={`max-w-3xl max-h-full flex flex-col ${showPreview && "h-full"}`}
      >
        <DialogHeader>
          <DialogTitle className="font-medium">
            {showPreview && (
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setShowPreview(false)}
              >
                <ArrowLeft />
              </Button>
            )}
            {showPreview ? "BA Hasil Scan Fisik" : "SO Report"}
          </DialogTitle>
        </DialogHeader>
        <div className={cn("overflow-x-hidden flex relative w-full h-full")}>
          <motion.div
            className="w-full space-y-4"
            variants={leftVariant}
            animate={showPreview ? "hidden" : "visible"}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          >
            {downloadCountReportQuery.isError && (
              <p className="text-red-500">
                {downloadCountReportQuery.error?.message}
              </p>
            )}
            <Card className="flex p-3 gap-3 justify-between">
              <div className="rounded-md min-h-10 min-w-10 bg-muted-foreground/10 flex items-center justify-center">
                <StickyNoteIcon />
              </div>
              <div className="flex flex-col justify-center  w-full">
                <p>{`BA Hasil Scan Fisik`}</p>
              </div>
              <Button variant={"default"} onClick={() => setShowPreview(true)}>
                <EyeIcon />
                Generate PDF
              </Button>
            </Card>
            <Card className="flex p-3 gap-3 justify-between">
              <div className="rounded-md min-h-10 min-w-10 bg-muted-foreground/10 flex items-center justify-center">
                <StickyNoteIcon />
              </div>{" "}
              <div className="flex flex-col justify-center w-full ">
                <p>{`Hasil Count`}</p>
              </div>
              <Button
                variant={"default"}
                disabled={downloadCountReportQuery.isFetching}
                onClick={async () => {
                  downloadCountReportQuery.refetch();
                }}
              >
                {downloadCountReportQuery.isFetching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {"Loading..."}
                  </>
                ) : (
                  <>
                    <DownloadIcon />
                    {"Export CSV"}
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
          <motion.div
            className="absolute overflow-hidden w-full"
            variants={rightVariant}
            animate={showPreview ? "visible" : "hidden"}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            // Only render when showPreview is true
            style={{ display: showPreview ? "block" : "none" }}
          >
            {downloadReportQuery.isError && (
              <p className="text-red-500 mb-2">
                {downloadReportQuery.error?.message}
              </p>
            )}
            <PreviewSummaryContent
              summaryHook={summaryHook}
              pic={form.watch("pic")}
              so={form.watch("so")}
            />
          </motion.div>
        </div>

        {showPreview && (
          <DialogFooter className="mt-4 flex flex-col">
            <div className="flex flex-col w-full gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="flex w-full  gap-4">
                    <FormField
                      control={form.control}
                      name="so"
                      rules={{ required: "SO Team is required" }}
                      render={({ field }) => (
                        <FormItem className="max-sm:w-full flex-1">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Input SO Team"
                              className="max-sm:h-12"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value.toUpperCase());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pic"
                      rules={{ required: "PIC is required" }}
                      render={({ field }) => (
                        <FormItem className="max-sm:w-full flex-1">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Input PIC/SH/SSH/AM"
                              className="max-sm:h-12"
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.value.toUpperCase());
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    variant="default"
                    type={"submit"}
                    disabled={
                      downloadReportQuery.isFetching || !form.formState.isValid
                    }
                    className="w-full"
                  >
                    {downloadReportQuery.isFetching ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {"Loading..."}
                      </>
                    ) : (
                      <>
                        <DownloadIcon />
                        {"Export PDF"}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default PreviewSummaryModal;
