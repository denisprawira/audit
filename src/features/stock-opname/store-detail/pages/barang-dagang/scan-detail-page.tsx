import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  CirclePlus,
  DownloadIcon,
  Loader2,
  Search,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import DefaultTable from "@/components/default-table/default-table";
import { IScanItemDetail } from "@/types/data";
import { ColumnDef } from "@tanstack/react-table";
import { scanItemDetailColdef } from "@/utils/column-definition/scan-item-detail-coldef";
import dayjs from "dayjs";
import { useFilters } from "@/stores/Data/useFilterStores";
import useScanItems from "@/hooks/query/stock-opname/useScanItems";
import { debounce } from "lodash";
import api from "@/services/interceptor/Interceptor";

const ScanDetailPage = () => {
  const form = useForm();
  const { scheduleID, scanId, storeCode } = useFilters();
  const {
    scanItemDetailQuery: { data, isFetching, isLoading },
    scanItemDetail: { page, setPage, setBrand, setSearch, sort, setSort },
    download: { downloadScanItemsQuery },
  } = useScanItems({ scheduleID, scanId: scanId });
  const debouncedSetSearch = debounce(setSearch, 1000);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full max-h-[calc(100vh-4.125rem)] gap-4 px-6 py-6 overflow-x-auto">
      <div className="flex justify-start items-center w-full">
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size={"icon"}
            onClick={() => navigate("/stock-opname/store/detail/scan")}
          >
            <ArrowLeft />
          </Button>
          <p className="font-semibold text-lg">{`PS ${storeCode}`}</p>
        </div>
        <Button
          variant={"outline"}
          className="ml-auto"
          disabled={downloadScanItemsQuery.isFetching}
          onClick={async () => {
            downloadScanItemsQuery.refetch();
          }}
        >
          {downloadScanItemsQuery.isFetching ? (
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
      </div>
      {data?.notes && (
        <div className="flex px-6 gap-3 py-2 border-l-4 border-black space-y-2">
          <img
            src={
              data.notes.comment_image
                ? api.defaults.baseURL + "/images/" + data.notes.comment_image
                : "/empty-placeholder.jpg"
            }
            className="size-20"
          />
          <div>
            <p className="font-bold">{"Comment"}</p>
            <p className="text-base">{data.notes.comment}</p>
            <p className="text-base pt-1 flex gap-2 items-center text-muted-foreground">
              {<User className="size-4" />} {data?.notes?.user?.name ?? "--"}{" "}
              {`, Updated ` +
                dayjs(data.notes.scanned_at).format("DD MMM YYYY")}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 w-full">
        <Form {...form}>
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
                    slotProps={{
                      button: {
                        leftContent: (
                          <CirclePlus className="text-gray-400 size-4" />
                        ),
                        className: "border-2 border-dotted max-sm:h-12",
                      },
                    }}
                    options={
                      data?.brand_codes.map((item) => ({
                        label: item,
                        value: item,
                      })) ?? ([] as ISelectData[])
                    }
                    onChange={(e) => {
                      const selected = e as ISelectData;
                      selected.value
                        ? setBrand([selected.value as string])
                        : setBrand([]);
                      field.onChange(selected);
                    }}
                    enableClearAll
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
                      placeholder="Search Item Code"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        debouncedSetSearch(value);
                        field.onChange(value.toUpperCase());
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
      <div className="flex-1 overflow-hidden ">
        <DefaultTable<IScanItemDetail>
          coldef={scanItemDetailColdef() as ColumnDef<IScanItemDetail>[]}
          data={data?.data ?? []}
          page={page}
          setPage={setPage}
          sorting={sort}
          isFetching={isFetching}
          isLoading={isLoading}
          totalPage={data?.meta?.total}
          setSorting={setSort}
        />
      </div>
    </div>
  );
};
export default ScanDetailPage;
