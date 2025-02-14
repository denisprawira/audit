import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CirclePlus, Info, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import { Button } from "@/components/ui/button";
import DefaultTable from "@/components/default-table/default-table";
import { ColumnDef } from "@tanstack/react-table";
import { itemSummaryColdef } from "@/utils/column-definition/summary-coldef";
import SheetComponent from "@/components/sheet/Sheet";
import SheetContent from "@/features/stock-opname/store-detail/components/adjustment-sheet-content";
import { ISummaryData } from "@/types/data";
import { useFilters } from "@/stores/Data/useFilterStores";
import useSummary from "@/hooks/query/stock-opname/useSummary";
import debounce from "@/utils/debounce";
import { useSummaryMutation } from "@/hooks/mutation/useSummaryMutation";
import Tooltip from "@/components/tooltip/Tooltip";
import dayjs from "dayjs";
import PreviewSummaryModal from "@/features/stock-opname/store-detail/components/preview-summary-modal";
import { useState } from "react";
import { ItemsType } from "@/utils/enumeration";

const SummaryPage = () => {
  const form = useForm();
  const { storeCode, scheduleID } = useFilters();
  const summaryHook = useSummary({ scheduleID });
  const { summaryQuery, summaryFilters, checkFinalizeEligibilityQuery } =
    summaryHook;
  const { finalizeSummary } = useSummaryMutation();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const debouncedSetSearch = debounce(summaryFilters.setSearch, 1000);

  return (
    <div className="flex flex-col w-full max-h-[calc(100vh-4.125rem)] gap-4 px-6 py-6 overflow-x-auto">
      <PreviewSummaryModal
        open={reportModalOpen}
        setOpen={setReportModalOpen}
        summaryHook={summaryHook}
      />
      <SheetComponent
        slotProps={{
          content: {
            className: "sm:w-[80%] sm:min-w-[80%] md:w-[50%] md:min-w-[50%]  ",
          },
        }}
      >
        <SheetContent data={summaryQuery.data?.data ?? []} />
      </SheetComponent>
      <div className="flex justify-start items-center w-full">
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-lg">{`PS ${storeCode}`}</p>
        </div>
        <div className="ml-auto flex gap-4">
          {summaryQuery.data?.finalize_data && (
            <Tooltip
              toopTipContentProps={{ side: "bottom", align: "end" }}
              content={
                <div className="space-y-2 p-2">
                  <p>{`${summaryQuery.data.finalize_data.user.name ?? ""}`}</p>
                  <p className="text-muted-foreground">{`Finalize at ${dayjs(summaryQuery.data.finalize_data.created_at).format("DD MMM YYYY")}`}</p>
                </div>
              }
            >
              <Button
                variant={"link"}
                size={"default"}
                className="max-sm:h-12 underline"
              >
                <Info />
                Details
              </Button>
            </Tooltip>
          )}
          <Button
            disabled={
              summaryQuery.isPending ||
              finalizeSummary.isPending ||
              (!summaryQuery.data?.finalize_data &&
                !checkFinalizeEligibilityQuery.data?.is_finalize_eligible)
            }
            variant={summaryQuery.data?.finalize_data ? "outline" : "default"}
            onClick={() => {
              if (summaryQuery.data?.finalize_data) {
                setReportModalOpen(true);
              } else {
                finalizeSummary.mutate(scheduleID);
              }
            }}
          >
            {summaryQuery.data?.finalize_data ? (
              "Generate SO Report"
            ) : finalizeSummary.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {"Loading..."}
              </>
            ) : (
              "Finalize SO Report"
            )}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full flex-wrap">
        <Form {...form}>
          <FormField
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select
                    placeholder="Status"
                    selectedVariant="badge"
                    value={field.value}
                    isSearchable
                    enableClearAll
                    multiple
                    slotProps={{
                      button: {
                        leftContent: (
                          <CirclePlus className="text-gray-400 size-4" />
                        ),
                        className: "border-2 border-dotted max-sm:h-12",
                      },
                    }}
                    options={
                      summaryQuery.data?.all_statuses.map((status) => {
                        return {
                          label: status.toUpperCase(),
                          value: status,
                        };
                      }) ?? ([] as ISelectData[])
                    }
                    onChange={(e) => {
                      const selected = e as ISelectData[];
                      summaryFilters.setStatus(
                        selected.map((item) => item.value as string),
                      );
                      field.onChange(selected);
                    }}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select
                    placeholder="Brand"
                    selectedVariant="badge"
                    value={field.value}
                    isSearchable
                    enableClearAll
                    multiple
                    slotProps={{
                      button: {
                        leftContent: (
                          <CirclePlus className="text-gray-400 size-4" />
                        ),
                        className: "border-2 border-dotted max-sm:h-12",
                      },
                    }}
                    options={
                      summaryQuery.data?.all_brands.map((brand) => {
                        return {
                          label: brand.toUpperCase(),
                          value: brand,
                        };
                      }) ?? ([] as ISelectData[])
                    }
                    onChange={(e) => {
                      const selected = e as ISelectData[];
                      summaryFilters.setBrands(
                        selected.map((item) => item.value as string) ?? [],
                      );
                      field.onChange(selected);
                    }}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="items-type"
            defaultValue={Object.entries(ItemsType)
              .filter((item) => item[1] !== ItemsType.NON_SALE)
              //eslint-disable-next-line
              .map(([_, value]) => {
                return {
                  label: value.toUpperCase(),
                  value: value,
                };
              })}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select
                    placeholder="Type"
                    selectedVariant="badge"
                    value={field.value}
                    defaultValue={field.value}
                    enableClearAll
                    slotProps={{
                      button: {
                        leftContent: (
                          <CirclePlus className="text-gray-400 size-4" />
                        ),
                        className: "border-2 border-dotted max-sm:h-12",
                      },
                    }}
                    //eslint-disable-next-line
                    options={Object.entries(ItemsType).map(([_, value]) => {
                      return {
                        label: value.toUpperCase(),
                        value: value,
                      };
                    })}
                    onChange={(e) => {
                      const selected = e as ISelectData;
                      summaryHook.summaryFilters.setSummaryType(
                        selected.value as ItemsType,
                      );
                      field.onChange(selected);
                    }}
                  />
                </FormControl>
                {fieldState.error && (
                  <FormMessage>{fieldState.error.message}</FormMessage>
                )}
              </FormItem>
            )}
          />
          <div className=" flex flex-1">
            <FormField
              control={form.control}
              name="search"
              render={({ field, fieldState }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="relative w-full sm:w-fit">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4" />
                      <Input
                        className="w-full sm:w-[200px] pl-10"
                        placeholder="Search Item Code"
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value.toUpperCase();
                          field.onChange(value);
                          debouncedSetSearch(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>
      <div className="flex-1 overflow-hidden ">
        <DefaultTable<ISummaryData>
          setSorting={summaryFilters.setSorting}
          sorting={summaryFilters.sorting}
          headerVerticalBorder
          coldef={itemSummaryColdef() as ColumnDef<ISummaryData>[]}
          data={summaryQuery.data?.data ?? []}
          page={summaryFilters.page}
          setPage={summaryFilters.setPage}
          totalPage={summaryQuery.data?.meta?.total}
          isLoading={summaryQuery.isLoading}
          isFetching={summaryQuery.isFetching}
          isSearchActive={summaryFilters.search.length > 0}
        />
      </div>
    </div>
  );
};
export default SummaryPage;
