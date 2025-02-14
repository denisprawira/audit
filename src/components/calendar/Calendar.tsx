import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control } from "react-hook-form";
import { useState } from "react";
import { CalendarProps } from "@/components/ui/calendar";
interface CalendarInputProps {
  label?: string;
  description?: string;
  control: Control;
  onSelect?: (date: Date) => void;
}

type Props = CalendarInputProps & CalendarProps;

const CalendarInput = ({
  label,
  description,
  control,
  onSelect,
  ...props
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name="cutoff_to"
      render={({ field, fieldState }) => {
        return (
          <FormItem className=" max-sm:w-full ">
            {label && <FormLabel>{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className=" max-sm:h-12 flex justify-start max-sm:w-full"
                  >
                    <Calendar
                      className={cn(
                        "h-4 w-4 opacity-50 ",
                        !field.value && "text-muted-foreground",
                      )}
                    />
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>{"Cut-off Date"}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <ShadcnCalendar
                  {...props}
                  mode="single"
                  selected={field.value}
                  onSelect={(e) => {
                    field.onChange(e);
                    onSelect && e && onSelect(e);
                    setOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState && (
              <FormMessage>{fieldState.error?.message}</FormMessage>
            )}
          </FormItem>
        );
      }}
    />
  );
};
export default CalendarInput;
