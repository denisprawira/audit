import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import useSchedule from "@/hooks/query/stock-opname/useSchedule";
import useScheduleMutation from "@/hooks/mutation/useScheduleMutation";
import { LoaderCircle } from "lucide-react";
import { DatePicker } from "@/components/date-picker/date-picker";
import dayjs from "dayjs";

interface EditAssigneesModalProps {
  children: React.ReactNode;
  scheduleHook: ReturnType<typeof useSchedule>;
  scheduleMutation: ReturnType<typeof useScheduleMutation>;
}

const EditPeriodModal = ({
  children,
  scheduleHook: { scheduleOverviewQuery },
  scheduleMutation: { updateScheduleMutation },
}: EditAssigneesModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<{ period: { from: Date; to: Date } }>({});

  useEffect(() => {
    if (
      scheduleOverviewQuery.data?.data.start_date &&
      scheduleOverviewQuery.data?.data.end_date
    ) {
      form.setValue("period", {
        from: dayjs(scheduleOverviewQuery.data.data.start_date).toDate(),
        to: dayjs(scheduleOverviewQuery.data.data.end_date).toDate(),
      });
    }
  }, [scheduleOverviewQuery.data, form.reset, open]);

  useEffect(() => {
    updateScheduleMutation.isSuccess && setOpen(false);
  }, [updateScheduleMutation.isSuccess]);

  const submit = (data: { period: { from: Date; to: Date } }) => {
    updateScheduleMutation.mutate({
      id: scheduleOverviewQuery.data?.data.id ?? "",
      start_date: dayjs(data.period.from).format("YYYY-MM-DD"),
      end_date: dayjs(data.period.to).format("YYYY-MM-DD"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-medium">Edit Period</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <FormField
                control={form.control}
                name="period"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <DatePicker
                          mode="range"
                          dateFormat="DD MMM YYYY"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                          }} // Ensure it's controlled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter className="mt-4">
                <Button
                  variant="default"
                  className=" w-fit"
                  type="submit"
                  disabled={updateScheduleMutation.isPending}
                >
                  {updateScheduleMutation.isPending ? (
                    <div className="flex gap-2 items-center">
                      <LoaderCircle className="animate-spin size-4" />
                      Loading...
                    </div>
                  ) : (
                    <>Save</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPeriodModal;
