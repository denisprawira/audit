import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CirclePlus, Grid2X2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ScanCard from "@/features/stock-opname/store-detail/components/scan-card";
import Pagination from "@/components/pagination/pagination";
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import { useFilters } from "@/stores/Data/useFilterStores";
import useScanItems from "@/hooks/query/stock-opname/useScanItems";
import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";
import debounce from "@/utils/debounce";
import { useNavigate } from "react-router";
import Loader from "@/components/loader/Loader";
import { ItemsType } from "@/utils/enumeration";

const ScanPage = () => {
  const form = useForm();
  const { scheduleID, setScanId, storeCode } = useFilters();
  const scanHook = useScanItems({ scheduleID });
  const { scannedBy } = useFilters();
  const debouncedSetSearch = debounce(scanHook.scanItemFilters.setSearch, 1000);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full max-h-[calc(100vh-4.125rem)] gap-4 px-6 py-6 overflow-x-auto">
      <div className="flex justify-between items-center w-full">
        <p className="font-semibold text-lg">{`PS ${storeCode}`}</p>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Form {...form}>
          <FormField
            control={form.control}
            name="status"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <Select
                    placeholder="Scanned by"
                    selectedVariant="badge"
                    value={field.value}
                    isSearchable
                    multiple
                    enableClearAll
                    slotProps={{
                      button: {
                        leftContent: (
                          <CirclePlus className="text-gray-400 size-4" />
                        ),
                        className: "border-2 border-dotted max-sm:h-12",
                      },
                    }}
                    options={
                      scannedBy.map((item) => ({
                        value: item.id,
                        label: item.name,
                      })) as ISelectData[]
                    }
                    onChange={(e) => {
                      const selected = e as ISelectData[];
                      scanHook.scanItemFilters.setScannedBy(
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
            name="search"
            render={({ field, fieldState }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative w-full sm:w-fit">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4" />
                    <Input
                      className="w-full sm:w-[200px] pl-10"
                      placeholder="Search Location"
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
      <Tabs
        defaultValue={ItemsType.SALE}
        className="flex-1 flex flex-col overflow-hidden "
        onValueChange={(e) => {
          scanHook.scanItemFilters.setScanType(e as ItemsType);
        }}
      >
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value={ItemsType.SALE}>Barang Dagang</TabsTrigger>
          <TabsTrigger value={ItemsType.NON_SALE}>Non-Dagang</TabsTrigger>
        </TabsList>
        <div className="w-full h-full flex-1 flex flex-col ">
          {scanHook.scanItemQuery.isFetching && (
            <div className=" inset-0 w-full h-full gap-2 flex justify-center items-center bg-gray-50 dark:bg-black/30 bg-opacity-75">
              <Loader />
            </div>
          )}
          {!scanHook.scanItemQuery.isFetching &&
            scanHook.scanItemQuery.data?.data.length === 0 && (
              <EmptyPlaceholder
                icon={<Grid2X2 />}
                title="No items found"
                description="This list is currently empty."
                className="border border-muted-foreground/10 rounded-md"
              />
            )}
          {scanHook.scanItemQuery.data?.data &&
            !scanHook.scanItemQuery.isFetching && (
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 h-fit overflow-y-scroll">
                  {scanHook.scanItemQuery.data.data.map((item) => (
                    <ScanCard
                      key={item.id}
                      data={item}
                      onClick={() => {
                        navigate(`/stock-opname/store/detail/scan/detail`);
                        setScanId(item.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          <Pagination
            page={scanHook.scanItemFilters.page}
            setPage={scanHook.scanItemFilters.setPage}
            total={scanHook.scanItemQuery.data?.meta?.total ?? 0}
          />
        </div>
      </Tabs>
    </div>
  );
};
export default ScanPage;
