import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import {
  Filters,
  IItemTransactionData,
} from "@/features/audit/types/data/TransactionTypes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { IItemTransactionQueryParams } from "@/features/audit/types/filters/ItemTransactionFilters";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { AlignHorizontalDistributeCenter, CirclePlus } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ItemTransactionFilterNames, Operators } from "@/utils/enumeration";

interface DetailTableToolbarProps {
  title: string;
  updateFilters: (newParams: Partial<IItemTransactionQueryParams>) => void;
  removeFilter: (fieldName: string) => void;
  table: Table<IItemTransactionData>;
  //eslint-disable-next-line
  columnVisibility: {};
  //eslint-disable-next-line
  setColumnVisibility: React.Dispatch<React.SetStateAction<{}>>;
  listboxMargin?: boolean;
  filters?: Filters;
}

const DetailTableToolbar = forwardRef<HTMLDivElement, DetailTableToolbarProps>(
  (
    {
      title,
      table,
      listboxMargin,
      setColumnVisibility,
      filters,
      updateFilters,
      removeFilter,
    },
    ref,
  ) => {
    const form = useForm();
    const formValues = form.watch();
    const [options] = useState<ISelectData[]>(
      (table.getAllLeafColumns().map((column) => {
        return {
          value: column.id,
          label: column.columnDef.header,
        };
      }) as ISelectData[]) ?? [],
    );

    const handleViewChange = (selected: ISelectData[] | ISelectData) => {
      const selectedData = Array.isArray(selected) ? selected : [selected];
      const newState = Object.fromEntries(
        options.map((option) => [
          option.value,
          selectedData.some(
            (selectedItem) => selectedItem.value === option.value,
          ),
        ]),
      );
      setColumnVisibility(newState);
    };

    useEffect(() => {
      if (formValues) {
        const { busproc, from, to } = formValues;

        if (busproc && busproc.length !== 0) {
          updateFilters({
            filters: [
              {
                field: ItemTransactionFilterNames.BUS_PROC,
                operator: Operators.IN,
                values: busproc.map((item: string) => item as string),
              },
            ],
          });
        } else {
          removeFilter(ItemTransactionFilterNames.BUS_PROC);
        }

        if (from && from.length !== 0) {
          updateFilters({
            filters: [
              {
                field: ItemTransactionFilterNames.FROM,
                operator: Operators.IN,
                values: from.map((item: string) => item as string),
              },
            ],
          });
        } else {
          removeFilter(ItemTransactionFilterNames.FROM);
        }

        if (to && to.length !== 0) {
          updateFilters({
            filters: [
              {
                field: ItemTransactionFilterNames.TO,
                operator: Operators.IN,
                values: to.map((item: string) => item as string),
              },
            ],
          });
        } else {
          removeFilter(ItemTransactionFilterNames.TO);
        }
      }
    }, [formValues.busproc, formValues.from, formValues.to]);

    return (
      <div ref={ref}>
        <p className="px-4 pt-3 text-sm text-muted-foreground">{title}</p>
        <div className="flex px-4 py-3 flex-wrap gap-y-4 flex-col sm:flex-row ">
          <div className="w-full flex-1 flex gap-4 flex-col sm:flex-row flex-wrap">
            <Form {...form}>
              <FormField
                control={form.control}
                name="busproc"
                render={({ field }) => (
                  <FormItem className=" max-sm:w-full">
                    <FormControl>
                      <Select
                        isSearchable
                        enableClearAll
                        placeholder="Busproc"
                        searchPlaceholder="Search Busproc"
                        checkVariant="checkbox"
                        displaySelectedOptions={false}
                        multiple
                        options={
                          filters && filters.busproc
                            ? filters.busproc
                                .filter((item: string) => item !== null)
                                .map((item: string) => ({
                                  value: item,
                                  label: item,
                                }))
                            : []
                        }
                        slotProps={{
                          parent: { className: "sm:min-w-32 sm:max-w-[200px]" },
                          button: {
                            leftContent: (
                              <CirclePlus className="text-gray-400 size-4" />
                            ),
                            className:
                              "border-2 border-dotted max-sm:h-12 min-w-32 overflow-x-scroll",
                          },
                        }}
                        onChange={(e) => {
                          const selected = e as ISelectData[];
                          field.onChange(selected.map((item) => item.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem className=" max-sm:w-full">
                    <FormControl>
                      <Select
                        isSearchable
                        enableClearAll
                        placeholder="From"
                        searchPlaceholder="Search From"
                        checkVariant="checkbox"
                        displaySelectedOptions={false}
                        multiple
                        options={
                          filters && filters.from
                            ? filters.from
                                .filter((item) => item !== null)
                                .map((from: string) => ({
                                  value: from,
                                  label: from,
                                }))
                            : []
                        }
                        slotProps={{
                          parent: { className: "sm:min-w-14 sm:max-w-[200px]" },
                          button: {
                            leftContent: (
                              <CirclePlus className="text-gray-400 size-4" />
                            ),
                            className:
                              "border-2 border-dotted max-sm:h-12 min-w-14",
                          },
                        }}
                        onChange={(e) => {
                          const selected = e as ISelectData[];
                          field.onChange(selected.map((item) => item.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem className=" max-sm:w-full">
                    <FormControl>
                      <Select
                        isSearchable
                        enableClearAll
                        placeholder="To"
                        searchPlaceholder="Search From"
                        checkVariant="checkbox"
                        displaySelectedOptions={false}
                        multiple
                        options={
                          filters && filters.from
                            ? filters.from
                                .filter((item: string) => item !== null)
                                .map((from) => ({
                                  value: from,
                                  label: from,
                                }))
                            : []
                        }
                        slotProps={{
                          parent: { className: "sm:min-w-14 sm:max-w-[200px]" },
                          button: {
                            leftContent: (
                              <CirclePlus className="text-gray-400 size-4" />
                            ),
                            className:
                              "border-2 border-dotted max-sm:h-12 min-w-14",
                          },
                        }}
                        onChange={(e) => {
                          const selected = e as ISelectData[];
                          field.onChange(selected.map((item) => item.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>

          <div>
            <Select
              title="Toggle columns"
              enableSelectAll
              checkAllPosition="bottom"
              placeholder="View"
              checkPosition="left"
              displaySelectedOptions={false}
              onChange={handleViewChange}
              slotProps={{
                parent: { className: "w-fit sm:min-w-fit" },
                button: {
                  leftContent: (
                    <AlignHorizontalDistributeCenter className="text-gray-400 size-4" />
                  ),
                },
                option: {
                  className: cn(
                    "sm:fixed w-full sm:w-48 ",
                    listboxMargin && "sm:right-10",
                  ),
                },
              }}
              defaultValue={options}
              options={options}
              multiple
            />
          </div>
        </div>
      </div>
    );
  },
);

DetailTableToolbar.displayName = "DetailTableToolbar";

export default DetailTableToolbar;
