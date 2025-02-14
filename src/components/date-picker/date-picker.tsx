import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { CalendarProps } from "@/components/ui/calendar";
type Props = {
  mode?: "range" | "multiple" | "single";
  dateFormat?: string;
  onSelect?: (date: Date | Date[] | DateRange) => void;
  onApplyClick?: (date: Date | Date[] | DateRange) => void;
  isApplyButtonVisible?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  icon?: React.ReactNode;
} & CalendarProps;

export function DatePicker({
  className,
  mode = "single",
  dateFormat = "DD-MM-YYYY",
  onSelect,
  onApplyClick,
  isApplyButtonVisible,
  variant = "outline",
  icon,
  selected,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & Props) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    selected ? (selected as DateRange) : { from: new Date(), to: new Date() },
  );
  const [open, setOpen] = React.useState(false);
  const [multiDate, setMultiDate] = React.useState<Date[]>([]);
  const [singleDate, setSingleDate] = React.useState<Date | undefined>();

  const handleSelect = (selected: DateRange | Date | Date[] | undefined) => {
    onSelect && selected && onSelect(selected);
    switch (mode) {
      case "range":
        setDateRange(selected as DateRange);
        break;
      case "multiple":
        setMultiDate(selected as Date[]);
        break;
      case "single":
        setSingleDate(selected as Date);
        break;
    }
  };

  const renderLabel = () => {
    if (mode === "range" && dateRange?.from) {
      return dateRange.to
        ? `${dayjs(dateRange.from).format(dateFormat)} - ${dayjs(
            dateRange.to,
          ).format(dateFormat)}`
        : dayjs(dateRange.from).format(dateFormat);
    }
    if (mode === "multiple" && multiDate.length > 0) {
      const displayedDates = multiDate
        .slice(0, 2)
        .map((d) => dayjs(d).format(dateFormat));
      const remainingCount = multiDate.length - 2;
      return remainingCount > 0
        ? `${displayedDates.join(", ")},  +${remainingCount}`
        : displayedDates.join(", ");
    }

    if (mode === "single" && singleDate) {
      return dayjs(singleDate).format(dateFormat);
    }
    return "Pick a date";
  };

  const renderCalendar = () => {
    if (mode === "range") {
      return (
        <Calendar
          {...props}
          initialFocus
          mode="range"
          selected={dateRange}
          onSelect={(selected) => handleSelect(selected)}
          numberOfMonths={2}
        />
      );
    }
    if (mode === "multiple") {
      return (
        <Calendar
          {...props}
          initialFocus
          mode="multiple"
          selected={multiDate}
          onSelect={(selected) => handleSelect(selected)}
        />
      );
    }
    return (
      <Calendar
        {...props}
        initialFocus
        mode="single"
        selected={singleDate}
        onSelect={(selected) => handleSelect(selected)}
      />
    );
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            className={cn(
              " justify-start text-left font-normal w-full sm:min-w-[10rem]",
              !dateRange && "text-muted-foreground",
            )}
          >
            {icon ? icon : <CalendarIcon />}
            <span>{renderLabel()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 " align="start">
          {renderCalendar()}
          {isApplyButtonVisible && (
            <div className="p-2 w-full flex justify-end ">
              <Button
                className="m-4"
                onClick={() => {
                  if (!onApplyClick) return;

                  switch (mode) {
                    case "range":
                      onApplyClick(dateRange as DateRange);
                      break;
                    case "multiple":
                      onApplyClick(multiDate as Date[]);
                      break;
                    case "single":
                      setSingleDate(singleDate as Date);
                      break;
                  }
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
