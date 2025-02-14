import { Button } from "@/components/ui/button";
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
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useReviewMutation } from "@/hooks/mutation/useReviewMutation";
import { useWarehouseOverviewDetailData } from "@/features/audit/stores/data/useItemOverviewStore";
import { useWarehouseOverviewFilters } from "@/features/audit/stores/filters/useWarehouseOverviewFiltersStore";
import { Filter } from "@/features/audit/types/filters/WarehouseOverviewFilters";
import { remarkValidationSchema } from "@/features/audit/validator/RemarkValidator";
import { useUserStore } from "@/stores/Data/useUserStore";
import { WarehouseOverviewFilterNames } from "@/utils/enumeration";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

interface IRemarkDialogProps {
  children: React.ReactNode;
}

const RemarkDialog = ({ children }: IRemarkDialogProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isSuccess, isPending } = useReviewMutation();
  const {
    queryParams: { db1, db2, cutoff_to, filters },
    company,
  } = useWarehouseOverviewFilters();
  const { warehouseOverviewData: itemData } = useWarehouseOverviewDetailData();
  const { user } = useUserStore();
  const form = useForm({
    resolver: yupResolver(remarkValidationSchema),
  });

  const submit = (data: FieldValues) => {
    mutate({
      itemcode: itemData?.itemcode ?? "",
      whscode: company,
      db1: db1,
      db2: db2,
      cutoff_date: cutoff_to,
      is_reviewed: itemData?.review?.is_reviewed,
      remark: data.remark,
      brand_code: itemData?.brand_code,
      qty_soh: itemData?.qty_soh,
      qty_soh_1: itemData?.qty_soh_1,
      qty_difference: itemData?.qty_difference,
      brand_codes: (filters?.find(
        (f: Filter) => f.field === WarehouseOverviewFilterNames.BRAND_CODE,
      )?.values || []) as string[],
    });
  };

  useEffect(() => {
    isSuccess && setOpen(false);
  }, [isSuccess]);

  return (
    <Dialog open={open && !itemData?.is_finalized} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-medium">Add Remarks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p>{"Reporter"}</p>
            <p className="text-muted-foreground">
              {user
                ? `${user?.name || "---"} (${user?.role.name || "No Role"})`
                : "-"}
            </p>
          </div>
          <Form {...form}>
            <FormField
              control={form.control}
              name="remark"
              defaultValue={itemData?.review?.remark ?? ""}
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                        value={field.value}
                        placeholder="Type your message here."
                        className="min-h-[10rem]"
                      />
                    </FormControl>
                    <FormMessage content={error?.message} className="text-xs" />
                  </FormItem>
                );
              }}
            />
          </Form>
        </div>
        <DialogFooter>
          <div className="flex justify-between  w-full mt-2">
            <Button variant={"ghost"} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              onClick={() => {
                form.handleSubmit(submit)();
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"Loading..."}
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default RemarkDialog;
