import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { AdjustmentReason } from "@/utils/enumeration";
import { FieldValues, useForm } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  Form,
  FormMessage,
} from "@/components/ui/form";
import { useFilters } from "@/stores/Data/useFilterStores";
import { capitalizeFirstLetter } from "@/utils/string-helpers";
import {
  ISaveAdjustmentPayload,
  useSummaryMutation,
} from "@/hooks/mutation/useSummaryMutation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Adjustment } from "@/types/data";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { checkIfFilesAreTooBig } from "@/utils/FileValidator";

interface EditAdjustmentCardProps {
  type: "edit" | "create";
  onCancel: () => void;
  data?: Adjustment;
  scheduleID: string;
  itemCode: string;
}

export const adjustmentScheme = () =>
  yup
    .object()
    .shape({
      qty: yup.number().required("Qty is required").min(1),
      reason: yup.string().required("Reason is required"),
      description: yup.string().required("Description is required"),
      item_photo: yup.mixed().test("file-required-and-size", function (value) {
        if (!value) {
          return this.createError({ message: "Image file is required" });
        }
        if (value) {
          if (!checkIfFilesAreTooBig([value as File], 1)) {
            return this.createError({
              message: "Image file too big, must be less than 1 MB",
            });
          }
        }

        return true;
      }),
    })
    .required();

const EditAdjustmentCard = ({
  onCancel,
  type,
  data: AdjustmentData,
  scheduleID,
  itemCode,
}: EditAdjustmentCardProps) => {
  // Conditional validation resolver based on 'type'
  const form = useForm({
    resolver: yupResolver(adjustmentScheme()),
    defaultValues: {
      reason: undefined,
      qty: undefined,
      description: "",
      item_photo: undefined,
    },
  });

  const { saveAdjustmentMutation } = useSummaryMutation();

  const {
    adjustmentFilters: { status, qtyDifference },
  } = useFilters();

  useEffect(() => {
    if (type === "edit" && AdjustmentData) {
      form.setValue("reason", AdjustmentData.reason);
      form.setValue("qty", AdjustmentData.qty);
      form.setValue("description", AdjustmentData.description);
      form.setValue("item_photo", undefined);
    }
  }, [type, AdjustmentData]);

  const adjustmentLabels: Record<AdjustmentReason, string> = {
    [AdjustmentReason.Forgotten]: "Lupa Scan",
    [AdjustmentReason.LostFound]: "Lost and Found",
    [AdjustmentReason.Lost]: "Barang Tidak Ditemukan",
    [AdjustmentReason.MultipleScans]: "Multiple Scans",
    [AdjustmentReason.StockSurplus]: "Stock Surplus",
    [AdjustmentReason.Other]: "Lainnya",
  };

  const onSubmitData = (data: FieldValues) => {
    if (type === "create") {
      saveAdjustmentMutation.mutate({
        scheduleID,
        data: {
          item_code: itemCode,
          adjustment_type: status,
          ...data,
        } as ISaveAdjustmentPayload,
      });
    } else {
      saveAdjustmentMutation.mutate({
        scheduleID,
        data: {
          item_code: itemCode,
          adjustment_type: status,
          adjustment_id: AdjustmentData?.id,
          ...data,
        } as ISaveAdjustmentPayload,
      });
    }
  };

  useEffect(() => {
    saveAdjustmentMutation.isSuccess && onCancel();
    saveAdjustmentMutation.isSuccess && form.reset({});
  }, [saveAdjustmentMutation.isSuccess]);

  return (
    <Card className="bg-red p-4 flex flex-col items-center rounded-sm gap-4">
      <div className="flex gap-2 items-center justify-between w-full ">
        <div className="flex items-center gap-2">
          {`Barang ${capitalizeFirstLetter(status)}`}
          <Badge variant="outline">{`${qtyDifference ?? 0} pcs`}</Badge>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmitData)} className="space-y-5">
          <FormField
            control={form.control}
            name="reason"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-wrap w-full gap-x-4 gap-y-4">
                      {Object.entries(adjustmentLabels).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={field.value === key}
                            value={key}
                            onCheckedChange={(e) => {
                              field.onChange(e ? key : null);
                            }}
                          />
                          <label
                            htmlFor={key}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage content={error?.message} className="text-xs" />
                </FormItem>
              );
            }}
          />

          <div className="flex flex-wrap gap-6 justify-between w-full ">
            <FormField
              control={form.control}
              name="qty"
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <div className="space-y-2">
                        <Label
                          htmlFor="number-qty"
                          className="text-muted-foreground"
                        >
                          Item Pcs
                        </Label>
                        <Input
                          {...field}
                          type="number"
                          defaultValue={field.value}
                          onChange={field.onChange}
                          placeholder="Enter Qty"
                        />
                      </div>
                    </FormControl>
                    <FormMessage content={error?.message} className="text-xs" />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="item_photo"
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <div className="space-y-2">
                        <Label
                          htmlFor="picture"
                          className="text-muted-foreground"
                        >
                          Item Photo
                        </Label>
                        <Input
                          type="file"
                          accept=".jpeg,.jpg,.png,.gif"
                          onChange={(e) => {
                            const file = e.target.files?.[0]; // Extract the first file
                            field.onChange(file);
                          }}
                          // ref={field.ref}
                        />
                      </div>
                    </FormControl>
                    <FormMessage content={error?.message} className="text-xs" />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field, fieldState: { error } }) => {
              return (
                <FormItem className="w-full ">
                  <FormControl>
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-muted-foreground"
                      >
                        Description
                      </Label>
                      <Textarea
                        {...field}
                        placeholder="Enter Description"
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </div>
                  </FormControl>
                  <FormMessage content={error?.message} className="text-xs" />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-end w-full gap-4 mt-2 ">
            <Button
              variant={"destructive"}
              type="reset"
              onClick={() => {
                onCancel();
                form.reset({});
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saveAdjustmentMutation.isPending}>
              {saveAdjustmentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"Loading..."}
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default EditAdjustmentCard;
