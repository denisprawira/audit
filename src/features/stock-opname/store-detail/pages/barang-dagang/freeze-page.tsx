import { Button } from "@/components/ui/button";
import DefaultTable from "@/components/default-table/default-table";
import useFetchFreezeItems from "@/hooks/query/stock-opname/useFreezeItems";
import { IFreezeData } from "@/types/data";
import { useEffect, useState } from "react";
import { itemFreezeColdef } from "@/utils/column-definition/item-freeze-coldef";
import { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Select from "@/components/select/Select";
import { useFetchBrands } from "@/hooks/query/useFetchBrands";
import { ISelectData } from "@/components/select/types/SelectTypes";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFilters } from "@/stores/Data/useFilterStores";
import toast from "react-hot-toast";
import debounce from "@/utils/debounce";
import SelectFreezeDataModal from "@/features/stock-opname/store-detail/components/freeze/select-freeze-data-modal";

const FreezePage = () => {
  const { scheduleID, storeCode } = useFilters();
  const freezeHook = useFetchFreezeItems({
    scheduleID: scheduleID,
  });
  const form = useForm();
  const { data: brandOptions, isPending: isLoadingBrands } = useFetchBrands();
  const debouncedSetSearch = debounce(freezeHook.setSearch, 1000);
  const { pullFreezeDataQuery, freezeItemQuery } = freezeHook;
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if (pullFreezeDataQuery.isSuccess) {
      freezeHook.setIsPullData(false);
      toast.success(pullFreezeDataQuery.data.message);
      freezeItemQuery.refetch();
    }
    if (pullFreezeDataQuery.error) {
      freezeHook.setIsPullData(false);
      toast.error(pullFreezeDataQuery.error.message);
    }
  }, [pullFreezeDataQuery.error, pullFreezeDataQuery.isSuccess]);

  return (
    <div className="flex flex-col w-full max-h-[calc(100vh-4.125rem)] gap-4 max-sm:px-6 px-6 py-6 overflow-x-auto">
      <SelectFreezeDataModal
        freezeHook={freezeHook}
        open={open}
        setOpen={setOpen}
      />
      <div className="w-full flex sm:justify-between items-center flex-col sm:flex-row gap-2">
        <p className="font-semibold text-lg max-sm:w-full">{`PS ${storeCode}`}</p>
        <Button
          variant="default"
          className=" w-fit"
          onClick={() => setOpen(true)}
        >
          {"Freeze Data"}
        </Button>
      </div>

      <div className="w-full flex items-center gap-2 flex-col sm:flex-row">
        <Form {...form}>
          <FormField
            control={form.control}
            name="brand"
            render={({ field, fieldState }) => (
              <FormItem className="max-sm:w-full">
                <FormControl>
                  <Select
                    multiple
                    selectAll={
                      (field.value?.length ?? 0) ===
                        (brandOptions?.data.length ?? 0) ||
                      (field.value?.length ?? 0) === 0
                    }
                    isSearchable
                    enableClearAll
                    placeholder="Brand"
                    isLoading={isLoadingBrands}
                    disabled={isLoadingBrands}
                    searchPlaceholder="Search Brand"
                    checkVariant="checkbox"
                    selectedVariant="badge"
                    slotProps={{
                      button: {
                        className: "border max-sm:h-12 min-w-32",
                      },
                    }}
                    options={
                      brandOptions
                        ? brandOptions?.data.map((item) => ({
                            label: item.brand,
                            value: item.brand_code,
                          }))
                        : []
                    }
                    value={
                      field.value
                        ? field.value.map((item: string) => ({
                            label: item,
                            value: item,
                          }))
                        : []
                    }
                    onChange={(e) => {
                      const selected = e as ISelectData[];
                      freezeHook.setBrands(
                        selected.map((item) => item.value as string),
                      );
                      field.onChange(selected.map((item) => item.value));
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
            name="search Item Code"
            render={({ field, fieldState }) => (
              <FormItem className="max-sm:w-full">
                <FormControl>
                  <div className="relative w-full sm:w-fit max-sm:w-full">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4" />
                    <Input
                      className="w-full sm:min-w-[200px] sm:w-[200px] pl-10 max-sm:h-12"
                      placeholder="Search"
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
        </Form>
      </div>
      {freezeItemQuery.isError && (
        <p className="text-red-500"> {freezeItemQuery.error.message}</p>
      )}
      <div className="flex-1 overflow-hidden">
        <DefaultTable<IFreezeData>
          coldef={itemFreezeColdef() as ColumnDef<IFreezeData>[]}
          data={freezeItemQuery.data?.data ?? []}
          isLoading={freezeItemQuery.isLoading}
          isFetching={freezeItemQuery.isFetching}
          page={freezeHook.page}
          setPage={freezeHook.setPage}
          sorting={freezeHook.sorting}
          setSorting={freezeHook.setSorting}
          totalPage={freezeItemQuery.data?.meta?.total}
          isSearchActive={freezeHook.search.length > 0}
        />
      </div>
    </div>
  );
};

export default FreezePage;
