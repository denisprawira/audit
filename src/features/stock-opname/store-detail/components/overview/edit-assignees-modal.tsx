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
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import useSchedule from "@/hooks/query/stock-opname/useSchedule";
import useScheduleMutation from "@/hooks/mutation/useScheduleMutation";
import { LoaderCircle } from "lucide-react";

interface EditAssigneesModalProps {
  children: React.ReactNode;
  scheduleHook: ReturnType<typeof useSchedule>;
  scheduleMutation: ReturnType<typeof useScheduleMutation>;
}

const EditAssigneesModal = ({
  children,
  scheduleHook: { assigneQuery, scheduleOverviewQuery },
  scheduleMutation: { updateScheduleMutation },
}: EditAssigneesModalProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<{ assignees_id: string[] }>();

  useEffect(() => {
    updateScheduleMutation.isSuccess && setOpen(false);
  }, [updateScheduleMutation.isSuccess]);

  const submit = (data: { assignees_id: string[] }) => {
    updateScheduleMutation.mutate({
      id: scheduleOverviewQuery.data?.data.id ?? "",
      assignees_id: data.assignees_id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl max-h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-medium">Edit Assignees</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
              <FormField
                control={form.control}
                name="assignees_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignees</FormLabel>
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
                        isLoading={assigneQuery.isLoading}
                        defaultValue={scheduleOverviewQuery.data?.data.assignees.map(
                          (item) => ({
                            label: item.name,
                            value: item.id,
                          }),
                        )}
                        disabled={assigneQuery.isPending}
                        options={
                          assigneQuery.data?.data.map(
                            (item) =>
                              ({
                                label: item.name,
                                value: item.id,
                              }) as ISelectData,
                          ) ?? []
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

export default EditAssigneesModal;
