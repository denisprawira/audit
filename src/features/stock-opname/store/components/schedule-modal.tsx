import { DatePicker } from "@/components/date-picker/date-picker";
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import useScheduleMutation from "@/hooks/mutation/useScheduleMutation";
import useSchedule from "@/hooks/query/stock-opname/useSchedule";
import { useFetchWarehouses } from "@/hooks/query/useFetchWarehouses";
import dayjs from "dayjs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ScheduleFormValues {
  period: { from: Date; to: Date };
  store: string;
  assignees: string[];
}

interface ScheduleModalProps {
  children: React.ReactNode;
  scheduleHook: ReturnType<typeof useSchedule>;
  warehouseHook: ReturnType<typeof useFetchWarehouses>;
  mutationHook: ReturnType<typeof useScheduleMutation>;
}

export const addScheduleValidator = yup.object().shape({
  period: yup
    .object()
    .shape({
      from: yup
        .date()
        .typeError("Start date must be a valid date") // Ensures it's a Date object
        .required("Start date is required"),
      to: yup
        .date()
        .typeError("End date must be a valid date")
        .required("End date is required"),
    })
    .required("Period field is required"),
  store: yup.string().required("Store is required"),
  assignees: yup
    .array()
    .of(yup.string().uuid("Invalid UUID format").required()) // Ensure each value is a string
    .min(1, "At least one assignee is required")
    .required("Assignees field is required"),
});

const ScheduleModal = ({
  children,
  scheduleHook,
  warehouseHook,
  mutationHook,
}: ScheduleModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<ScheduleFormValues>({
    resolver: yupResolver(addScheduleValidator),
    defaultValues: {
      period: { from: new Date(), to: new Date() },
    },
  });

  const submit = (data: ScheduleFormValues) => {
    mutationHook.createScheduleMutation.mutate({
      assignees_id: data.assignees,
      end_date: dayjs(data.period?.to).format("YYYY-MM-DD"),
      start_date: dayjs(data.period?.from).format("YYYY-MM-DD"),
      store_code: data.store,
    });
  };

  useEffect(() => {
    mutationHook.createScheduleMutation.isSuccess && setOpen(false);
  }, [mutationHook.createScheduleMutation.isSuccess]);

  useEffect(() => {
    form.reset({});
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">Add Schedule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              {/* Period Field */}
              <FormField
                control={form.control}
                name="period"
                defaultValue={{ from: new Date(), to: new Date() }}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <DatePicker
                          {...field}
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

              {/* Store Field */}
              <FormField
                control={form.control}
                name="store"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select One"
                        slotProps={{
                          parent: { className: "sm:w-full" },
                          option: { className: "w-full" },
                        }}
                        isLoading={warehouseHook.isLoading}
                        disabled={warehouseHook.isPending}
                        options={
                          warehouseHook.data?.data.map((item) => ({
                            label: `${item.code}`,
                            value: `${item.code}`,
                          })) ?? []
                        }
                        onChange={(e) =>
                          field.onChange((e as ISelectData).value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assigne Field */}
              <FormField
                control={form.control}
                name="assignees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigne</FormLabel>
                    <FormControl>
                      <Select
                        placeholder="Select One"
                        isSearchable
                        slotProps={{
                          parent: { className: "sm:w-full" },
                          option: { className: "w-full" },
                        }}
                        multiple
                        displayLimit={2}
                        isLoading={scheduleHook.assigneQuery.isLoading}
                        disabled={scheduleHook.assigneQuery.isPending}
                        options={
                          scheduleHook.assigneQuery.data?.data.map((item) => ({
                            label: `${item.name}`,
                            value: `${item.id}`,
                          })) ?? []
                        }
                        onChange={(e) => {
                          field.onChange(
                            (e as ISelectData[]).map((item) => item.value),
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Footer */}
              <DialogFooter>
                <div className="flex justify-between w-full mt-2">
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutationHook.createScheduleMutation.isPending}
                  >
                    {mutationHook.createScheduleMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {"Saving..."}
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;
