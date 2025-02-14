import CalendarInput from "@/components/calendar/Calendar";
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import Tooltip from "@/components/tooltip/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFinalizeReport } from "@/hooks/mutation/useReportMutation";
import { useCheckFinalize } from "@/hooks/query/useCheckFinalize";

import { useFetchWarehouses } from "@/hooks/query/useFetchWarehouses";
import { useWarehouseOverviewFilters } from "@/features/audit/stores/filters/useWarehouseOverviewFiltersStore";
import useWindowSize from "@/hooks/utils/useWindowSize";
import { useElementRefs } from "@/stores/ui/userRefsStore";
import { Operators, WarehouseOverviewFilterNames } from "@/utils/enumeration";
import { getDb } from "@/utils/string-helpers";
import dayjs from "dayjs";
import {
  CirclePlus,
  Download,
  Info,
  Loader2,
  LoaderCircle,
  Lock,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetchBrands } from "@/hooks/query/useFetchBrands";
import { useFetchDatabases } from "@/hooks/query/useFetchDatabases";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import _ from "lodash";
import { useUIStateStore } from "@/features/audit/stores/ui/useUIStore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useFetchFinalizeDocumentReport } from "@/hooks/query/useFetchFinalizeDocumentReport";
import TooltipFinalized from "@/components/tooltip-finalized/TooltipFinalized";
import { Filter } from "@/features/audit/types/filters/WarehouseOverviewFilters";
dayjs.extend(isSameOrAfter);

const Toolbar = () => {
  const form = useForm();
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const shownMessages = useRef(new Set());
  const {
    hideSubmit,
    setHideSubmit,
    overviewFetchingStatus,
    isFinalizeActive,
    showBottomFilters,
    setResetOverviewSort,
    isAllFinalized,
  } = useUIStateStore();

  const {
    queryParams,
    company,
    setCompany,
    removeFilter,
    addFilter,
    setDb1,
    setDb2,
    setCutOffTo,
    setFilters,
    setSearch,
  } = useWarehouseOverviewFilters();
  const [shouldShowResetButton, setShouldShowResetButton] = useState(false);

  const {
    data: brandsData,
    isPending: isBrandsPending,
    error: brandError,
  } = useFetchBrands();

  const {
    data: databaseData,
    isPending: isDatabasePending,
    error: dbError,
  } = useFetchDatabases();

  const {
    data: warehouseData,
    isPending: isWarehousePending,
    error: warehouseError,
  } = useFetchWarehouses({});

  const { triggerDownload, query: exportQuery } =
    useFetchFinalizeDocumentReport();

  const { width } = useWindowSize();
  const { setRef } = useElementRefs();
  const { mutate: finalizeReport, isPending } = useFinalizeReport();
  const [searchInput, setSearchInput] = useState("");
  const [defaultDb, setDefaultDb] = useState<ISelectData[]>([]);

  const formValues = form.watch();
  const { store, comparison, brand, status, cutoff_to, search } = formValues;

  const { data: checkFinalizeData } = useCheckFinalize({
    whscode: company,
    db1: queryParams.db1,
    db2: queryParams.db2,
    cutoff_date: queryParams.cutoff_to,
    brand_codes:
      (queryParams?.filters?.find(
        (f: Filter) => f.field === WarehouseOverviewFilterNames.BRAND_CODE,
      )?.values as string[]) || [],
  });

  const handleShowResetButton = () => {
    const hasCustomQueryParams =
      queryParams &&
      Object.keys(queryParams).some(
        (key) =>
          !["cutoff_to", "db1", "db2"].includes(key) &&
          key !== "filters" &&
          key !== "search" &&
          key !== "sorts",
      );

    const hasNonBrandCodeFilter = queryParams?.filters?.some(
      (filter: Filter) =>
        filter.field !== WarehouseOverviewFilterNames.BRAND_CODE,
    );

    const hasSearch = !!queryParams?.search;
    const hasSorts = !!queryParams?.sorts;

    const result =
      !!hasCustomQueryParams ||
      !!hasNonBrandCodeFilter ||
      hasSearch ||
      hasSorts;

    setShouldShowResetButton(result);
  };

  useEffect(() => {
    if (brandError && !shownMessages.current.has(brandError.message)) {
      toast.error(
        brandError.message || "An unknown error occurred while loading brands.",
      );
      shownMessages.current.add(brandError.message);
    }
    if (dbError && !shownMessages.current.has(dbError.message)) {
      toast.error(
        dbError.message || "An unknown error occurred while loading databases.",
      );
      shownMessages.current.add(dbError.message);
    }
    if (warehouseError && !shownMessages.current.has(warehouseError.message)) {
      toast.error(
        warehouseError.message ||
          "An unknown error occurred while loading warehouses.",
      );
      shownMessages.current.add(warehouseError.message);
    }
  }, [brandError, dbError, warehouseError]);

  const resetFilters = () => {
    form.setValue("status", [{ label: "Show All", value: 0 }]);
    setSearchInput("");
    form.setValue("search", "");
    delete queryParams.sorts;
    delete queryParams.search;
    const filteredFilters =
      queryParams.filters &&
      queryParams.filters.filter(
        (filter: Filter) =>
          filter.field === WarehouseOverviewFilterNames.BRAND_CODE,
      );
    setResetOverviewSort(true);
    setFilters(filteredFilters ?? []);
  };

  useEffect(() => {
    if (databaseData) {
      setDefaultDb(
        databaseData?.data.slice(0, 1).map((item) => {
          return {
            label: `${item.db_1} vs ${item.db_2}`,
            value: `${item.db_1}&${item.db_2}`,
          };
        }) ?? [],
      );
    }
  }, [databaseData]);

  useEffect(() => {
    const defaultDate = dayjs().subtract(1, "day").toISOString();
    form.setValue("cutoff_to", defaultDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { db1, db2 } = comparison ? getDb(comparison) : {};
    const formattedCutoff = cutoff_to
      ? dayjs(cutoff_to).format("YYYY-MM-DD")
      : "";
    const filterBrand = _.find(queryParams.filters, {
      field: WarehouseOverviewFilterNames.BRAND_CODE,
    });
    const isBrandsSame = _.isEqual(brand, filterBrand?.values ?? []);
    const hasChanges =
      store !== company ||
      db1 !== queryParams.db1 ||
      db2 !== queryParams.db2 ||
      !isBrandsSame ||
      formattedCutoff !== queryParams.cutoff_to;

    setHideSubmit(hasChanges ? false : !overviewFetchingStatus);
  }, [store, comparison, brand, status, cutoff_to]);

  useEffect(() => {
    const hasFiltersExceptBrandCode = queryParams.filters?.some(
      (filter: Filter) =>
        filter.field !== WarehouseOverviewFilterNames.BRAND_CODE,
    );
    if (
      queryParams.sorts ||
      hasFiltersExceptBrandCode ||
      queryParams.search?.length
    ) {
      handleShowResetButton();
    } else {
      setShouldShowResetButton(false);
    }
  }, [queryParams.sorts, queryParams.filters, queryParams.search]);

  const updateQueryParamsFromForm = () => {
    const validateForm = () => {
      const errors = [];
      if (!store)
        errors.push({ field: "store", message: "Please select a store" });
      if (!company)
        errors.push({ field: "company", message: "Please select comparison" });
      if (!cutoff_to)
        errors.push({ field: "cutoff_to", message: "Please select date" });

      if (errors.length && !isDatabasePending && !isWarehousePending) {
        errors.forEach(({ field, message }) =>
          form.setError(field, { message }),
        );
      } else {
        form.clearErrors();
      }
    };

    const handleStoreChange = () => {
      if (store && store !== company) {
        resetFilters();
        setCompany(store);
      }
    };

    const handleComparisonChange = () => {
      if (!comparison) return;
      const { db1, db2 } = getDb(comparison);

      if (db1 !== queryParams.db1 || db2 !== queryParams.db2) {
        resetFilters();
        setDb1(db1);
        setDb2(db2);
      }
    };

    const handleCutoffChange = () => {
      if (cutoff_to) {
        const formattedCutoff = dayjs(cutoff_to).format("YYYY-MM-DD");
        if (formattedCutoff !== queryParams.cutoff_to) {
          resetFilters();
          setCutOffTo(formattedCutoff);
        }
      }
    };

    const handleBrandFilter = () => {
      if (
        brand &&
        brand.length > 0 &&
        brand.length !== brandsData?.data.length
      ) {
        const filterBrand = _.filter(queryParams.filters, {
          field: WarehouseOverviewFilterNames.BRAND_CODE,
        });
        const isSameArray = _.isEqual(brand, filterBrand[0]?.values ?? []);

        if (!isSameArray) {
          resetFilters();
          addFilter({
            field: WarehouseOverviewFilterNames.BRAND_CODE,
            operator: Operators.IN,
            values: brand,
          });
        }
      } else {
        removeFilter(WarehouseOverviewFilterNames.BRAND_CODE);
      }
    };

    // Execute validation and updates
    validateForm();
    handleStoreChange();
    handleComparisonChange();
    handleCutoffChange();
    handleBrandFilter();
    handleShowResetButton();
  };

  useEffect(() => {
    if (status && typeof status.value === "number") {
      if (status.value === 0) {
        removeFilter(WarehouseOverviewFilterNames.IS_REVIEWED);
      } else {
        addFilter({
          field: WarehouseOverviewFilterNames.IS_REVIEWED,
          operator: Operators.EQUAL,
          values: [status.value === 1 ? true : false],
        });
      }
    }

    search ? setSearch(search) : delete queryParams.search;
  }, [status, search]);

  useEffect(() => {
    if (ref) {
      setRef("toolbar", ref);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <Form {...form}>
        <div className="flex font-bold gap-4 flex-col sm:flex-row items-start sm:items-center w-full justify-between">
          <div className="flex flex-col w-full sm:flex-row gap-4 flex-1 items-start  flex-wrap">
            <div className="flex flex-wrap gap-4 w-full items-start sm:w-fit sm:items-center sm:flex-row ">
              <p>Store</p>
              <FormField
                control={form.control}
                name="store"
                render={({ field, fieldState }) => (
                  <FormItem className=" max-sm:w-full">
                    <FormControl>
                      <Select
                        isLoading={isWarehousePending}
                        disabled={isWarehousePending}
                        placeholder="Select Store"
                        searchPlaceholder="Search Store"
                        isSearchable
                        defaultValue={warehouseData?.data
                          .slice(0, 1)
                          .map((item) => {
                            return { label: item.code, value: item.code };
                          })}
                        options={
                          warehouseData
                            ? warehouseData?.data.map((item) => ({
                                label: item.code,
                                value: item.code,
                              }))
                            : []
                        }
                        onChange={(e) => {
                          const selected = e as ISelectData;
                          field.onChange(selected.value);
                        }}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full items-start sm:w-fit sm:items-center sm:flex-row">
              <p>Company</p>
              <FormField
                control={form.control}
                name="comparison"
                render={({ field, fieldState }) => (
                  <FormItem className=" max-sm:w-full">
                    <FormControl>
                      <Select
                        placeholder="Select Company"
                        defaultValue={defaultDb}
                        isLoading={isDatabasePending}
                        disabled={isDatabasePending}
                        options={
                          databaseData?.data.map((item) => {
                            return {
                              label: `${item.db_1} vs ${item.db_2}`,
                              value: `${item.db_1}&${item.db_2}`,
                            };
                          }) ?? []
                        }
                        onChange={(e) => {
                          const selected = e as ISelectData;
                          field.onChange(selected.value);
                        }}
                      />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full items-start sm:w-fit sm:items-center sm:flex-row">
              <p>Cut Off Date</p>
              <CalendarInput
                control={form.control}
                disabled={(date: Date) => {
                  return (
                    dayjs(date).isSameOrAfter(dayjs(), "day") ||
                    dayjs(date).isBefore("1900-01-01")
                  );
                }}
                // disabled={(date) =>
                //   date >= new Date() || date < new Date("1900-01-01")
                // }
              />
            </div>
            <div className="flex flex-wrap gap-4 w-full items-start sm:w-fit sm:items-center sm:flex-row">
              <p>Brand</p>
              <FormField
                control={form.control}
                name="brand"
                render={({ field, fieldState }) => (
                  <FormItem className=" max-sm:w-full">
                    <FormControl>
                      <Select
                        multiple
                        selectAll={
                          (field.value?.length ?? 0) ===
                            (brandsData?.data.length ?? 0) ||
                          (field.value?.length ?? 0) === 0
                        }
                        isSearchable
                        enableClearAll
                        placeholder="Brand"
                        isLoading={isBrandsPending}
                        disabled={isBrandsPending}
                        searchPlaceholder="Search Brand"
                        checkVariant="checkbox"
                        selectedVariant="badge"
                        slotProps={{
                          button: {
                            className: "border max-sm:h-12 min-w-32",
                          },
                        }}
                        options={
                          brandsData
                            ? brandsData?.data.map((item) => ({
                                label: item.brand,
                                value: item.brand_code,
                              }))
                            : []
                        }
                        value={
                          field.value
                            ? field.value.map((item: string) => {
                                return {
                                  label: item,
                                  value: item,
                                };
                              })
                            : []
                        }
                        onChange={(e) => {
                          const selected = e as ISelectData[];
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
            </div>
            <Button
              disabled={overviewFetchingStatus}
              className={`min-w-28 max-sm:w-full self-start max-sm:h-12 ${hideSubmit ? "hidden" : ""}`}
              onClick={() => {
                updateQueryParamsFromForm();
              }}
            >
              Submit
            </Button>
          </div>
        </div>

        <div
          className={cn(
            "hidden  flex-col justify-between gap-4 sm:flex-row sm:gap-4 flex-wrap",
            showBottomFilters ? "flex" : "hidden",
          )}
        >
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap max-w-full">
            <FormField
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      placeholder="Reviewed"
                      selectedVariant="badge"
                      defaultValue={[{ label: "Show All", value: 0 }]}
                      value={field.value}
                      slotProps={{
                        button: {
                          leftContent: (
                            <CirclePlus className="text-gray-400 size-4" />
                          ),
                          className: "border-2 border-dotted max-sm:h-12",
                        },
                      }}
                      options={
                        [
                          { label: "Show All", value: 0 },
                          { label: "Reviewed", value: 1 },
                          { label: "Not Reviewed", value: 2 },
                        ] as ISelectData[]
                      }
                      onChange={(e) => {
                        const selected = e as ISelectData;
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
                <FormItem className="max-sm:w-full">
                  <FormControl>
                    <div className="relative w-full  sm:w-fit max-sm:w-full ">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4" />
                      <Input
                        className="w-full sm:min-w-[200px] sm:w-[200px] pl-10 max-sm:h-12 "
                        placeholder="Search"
                        value={searchInput}
                        onChange={(e) => {
                          const newValue = e.target.value.toUpperCase();
                          setSearchInput(newValue);
                          if (debounceRef.current) {
                            clearTimeout(debounceRef.current);
                          }
                          debounceRef.current = setTimeout(() => {
                            field.onChange(newValue);
                          }, 1000);
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
            {shouldShowResetButton && (
              <Button
                onClick={() => {
                  resetFilters();
                }}
                variant={"ghost"}
              >
                {"Reset"}
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex justify-end place-self-end flex-1 w-full sm:w-fit max-sm:w-full gap-4 max-sm:flex-col max-sm:justify-center max-sm:items-center ">
            <div className="flex sm:justify-end align-bottom w-full sm:w-fit sm:self-end gap-1">
              {checkFinalizeData && checkFinalizeData?.data.length > 0 && (
                <Tooltip
                  toopTipContentProps={{ side: "bottom", align: "end" }}
                  content={<TooltipFinalized data={checkFinalizeData.data} />}
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
            </div>
            {isAllFinalized && (
              <Button
                variant="outline"
                className="w-full sm:max-w-[12rem] max-sm:w-full"
                disabled={exportQuery.isFetching || exportQuery.isLoading}
                onClick={() => {
                  triggerDownload();
                }}
              >
                {exportQuery.isLoading || exportQuery.isFetching ? (
                  <div className="flex gap-2 items-center">
                    <LoaderCircle className="animate-spin size-4" />
                    Loading...
                  </div>
                ) : (
                  <>
                    <Download />
                    Download Report
                  </>
                )}
              </Button>
            )}
            {!isAllFinalized && (
              <Tooltip content="Unlock by reviewing all the rows">
                <Button
                  className={cn(
                    "flex  items-center gap-2 w-full sm:w-auto max-sm:h-12 dark:bg-white",
                  )}
                  disabled={!isFinalizeActive || isPending}
                  onClick={() => {
                    try {
                      finalizeReport({
                        whs_code: company,
                        db1: queryParams.db1,
                        db2: queryParams.db2,
                        cutoff_date: queryParams.cutoff_to,
                        brand_codes:
                          (queryParams?.filters?.find(
                            (f: Filter) =>
                              f.field ===
                              WarehouseOverviewFilterNames.BRAND_CODE,
                          )?.values as string[]) || [],
                      });
                    } catch (error) {
                      console.error("Error finalizing report:", error);
                    }
                  }}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!isFinalizeActive && <Lock className="ml-2 h-4 w-4 " />}
                  <p> Finalize Audit</p>
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Toolbar;
