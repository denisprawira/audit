import { DatePicker } from "@/components/date-picker/date-picker";
import Select from "@/components/select/Select";
import { ISelectData } from "@/components/select/types/SelectTypes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import debounce from "@/utils/debounce";
import { ScheduleType } from "@/utils/enumeration";
import { formatEnumSnakeCase } from "@/utils/string-helpers";
import dayjs from "dayjs";
import { CirclePlus, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";

interface FilterProps {
  setSearch: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  setStatus: (value: string[]) => void;
}
const Filters = ({
  setSearch,
  setStartDate,
  setEndDate,
  setStatus,
}: FilterProps) => {
  const form = useForm();
  const debouncedSetSearch = debounce(setSearch, 1000);

  return (
    <Form {...form}>
      <div className="flex gap-4 flex-wrap">
        <DatePicker
          mode="range"
          isApplyButtonVisible
          onApplyClick={(e) => {
            const { from, to } = e as DateRange;
            setStartDate(dayjs(from).format("YYYY-MM-DD"));
            setEndDate(dayjs(to).format("YYYY-MM-DD"));
          }}
        />
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
                  options={Object.entries(ScheduleType).map(([key, value]) => ({
                    label: formatEnumSnakeCase(key).toUpperCase(),
                    value: value,
                  }))}
                  onChange={(e) => {
                    const selected = e as ISelectData[];
                    field.onChange(selected);
                    setStatus(selected.map((item) => item.value as string));
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
      <FormField
        control={form.control}
        name="search"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative w-full sm:w-fit max-sm:w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 size-4" />
                <Input
                  className="w-full sm:min-w-[200px] sm:w-[200px] pl-10 max-sm:h-12"
                  placeholder="Search"
                  value={field.value}
                  onChange={(e) => {
                    const searchValue = e.target.value.toUpperCase();
                    field.onChange(searchValue);
                    debouncedSetSearch(searchValue);
                  }}
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
};

export default Filters;
