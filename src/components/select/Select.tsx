import { Fragment, useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LoaderCircle,
  Search,
} from "lucide-react";
import { ISelectData } from "@/components/select/types/SelectTypes";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import _ from "lodash";
import { Button } from "@/components/ui/button";

interface SelectProps {
  hugContent?: boolean;
  selectAll?: boolean;
  title?: string;
  options: ISelectData[];
  defaultValue?: ISelectData[];
  value?: ISelectData[];
  displayLimit?: number;
  multiple?: boolean;
  isSearchable?: boolean;
  placeholder: string;
  displaySelectedOptions?: boolean;
  searchPlaceholder?: string;
  enableSelectAll?: boolean;
  enableClearAll?: boolean;
  checkVariant?: "default" | "checkbox";
  checkAllPosition?: "top" | "bottom";
  selectedVariant?: "default" | "badge";
  checkPosition?: "left" | "right";
  disabled?: boolean;
  isLoading?: boolean;
  onChange?: (value: ISelectData[] | ISelectData) => void;
  slotProps?: {
    parent?: {
      leftContent?: React.ReactNode;
      rightContent?: React.ReactNode;
      className?: string;
    };
    button?: {
      leftContent?: React.ReactNode;
      rightContent?: React.ReactNode;
      className?: string;
    };
    option?: {
      className?: string;
    };
  };
}

const Select = ({
  hugContent = false,
  selectAll = false,
  title,
  options = [],
  defaultValue,
  value,
  multiple = false,
  isSearchable = false,
  displayLimit,
  slotProps,
  enableSelectAll = false,
  enableClearAll = false,
  checkVariant = "default",
  selectedVariant = "default",
  checkPosition = "left",
  checkAllPosition = "top",
  disabled = false,
  isLoading = false,
  onChange,
  placeholder,
  displaySelectedOptions = true,
  searchPlaceholder = "Search...",
}: SelectProps) => {
  const [selectedData, setSelectedData] = useState<ISelectData[] | undefined>(
    defaultValue ? defaultValue : [],
  );
  const [tempValue, setTempValue] = useState<
    ISelectData | ISelectData[] | undefined
  >();
  const [filteredOptions, setFilteredOptions] = useState<ISelectData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  function isSelected(value: ISelectData) {
    return selectedData?.find((item) => item.value === value.value)
      ? true
      : false;
  }

  const isDefaultApplied = useRef(true);

  useEffect(() => {
    if (isDefaultApplied.current) {
      if (
        defaultValue &&
        defaultValue &&
        !_.isEqual(selectedData, defaultValue)
      ) {
        setSelectedData(defaultValue);
        isDefaultApplied.current = false;
      }
    }
  }, [defaultValue, options]);

  useEffect(() => {
    if (value && !_.isEqual(tempValue, value)) {
      setSelectedData(Array.isArray(value) ? value : [value]);
      setTempValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const search = (value: string) => {
    const fuse = new Fuse(options, {
      includeScore: true,
      keys: ["label"],
      threshold: 0.4,
    });
    const result = fuse.search(value);
    setFilteredOptions(result.map((item) => item.item));
  };

  useEffect(() => {
    filteredOptions.length === 0 && setFilteredOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  useEffect(() => {
    if (multiple) {
      onChange?.(selectedData ?? []);
    } else {
      onChange?.((selectedData && selectedData[0]) ?? ({} as ISelectData));
    }
  }, [selectedData]);

  return (
    <div
      className={cn(
        `${!hugContent && `sm:min-w-[200px]`}`,
        "sm:w-fit w-full ",
        "max-sm:w-full",
        slotProps?.parent?.className,
      )}
    >
      <Listbox value={selectedData} multiple={multiple}>
        <div className="relative ">
          <ListboxButton
            disabled={disabled}
            id={crypto.randomUUID().toString()}
            className={cn(
              "  flex font-normal h-10 w-full items-center justify-between rounded-md border border-input   px-4 py-2 text-sm  placeholder:text-muted-foreground focus:outline-none  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
              "max-sm:h-12 max-sm:w-full",
              slotProps?.button?.className,
            )}
          >
            {isLoading && (
              <div className=" flex gap-2 items-center">
                <LoaderCircle className="animate-spin size-4" /> Loading...
              </div>
            )}
            {!isLoading && (
              <>
                {selectAll && <div>{"Select All"}</div>}
                {!selectAll && (
                  <div className="flex items-center  gap-2 w-fit overflow-auto whitespace-nowrap ">
                    {slotProps?.button?.leftContent}
                    {!displaySelectedOptions && (
                      <span className="text-muted-foreground">{`${placeholder} ${selectedData && selectedData?.length > 0 ? `(${selectedData?.length})` : ""}`}</span>
                    )}
                    {displaySelectedOptions &&
                      selectedData &&
                      selectedVariant === "default" &&
                      selectedData
                        .slice(0, displayLimit)
                        .map((item) => item.label)
                        .join(", ")}
                    {displaySelectedOptions &&
                      selectedData &&
                      selectedData.length === 0 &&
                      selectedVariant === "default" && (
                        <span className="text-muted-foreground">
                          {placeholder}
                        </span>
                      )}
                    {displaySelectedOptions && selectedVariant === "badge" && (
                      <span>{placeholder}</span>
                    )}
                    {displaySelectedOptions &&
                      selectedVariant === "badge" &&
                      selectedData &&
                      selectedData?.length > 0 && (
                        <div className="flex items-center gap-2 max-w-full overflow-x-auto">
                          <Separator orientation="vertical" className="h-5" />
                          {selectedData.slice(0, 2).map((item) => (
                            <Badge
                              variant={"secondary"}
                              key={item.value}
                              className="ml-1 font-normal rounded-sm"
                            >
                              {item.label}
                            </Badge>
                          ))}
                          {selectedData.length > 2 && (
                            <>+{selectedData.length - 2}</>
                          )}
                        </div>
                      )}
                    {displayLimit &&
                      selectedData &&
                      selectedData.length > displayLimit && (
                        <> {` +${selectedData.length - displayLimit}`}</>
                      )}
                    {slotProps?.button?.rightContent}
                  </div>
                )}
                <div className="ml-2 relative">
                  <span
                    className={cn(
                      "pointer-events-none right-0 flex items-center",
                    )}
                  >
                    <ChevronsUpDownIcon
                      className={cn(
                        "h-4 w-4 text-gray-400",
                        (slotProps?.button?.leftContent ||
                          slotProps?.button?.rightContent) &&
                          "hidden",
                      )}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </>
            )}
          </ListboxButton>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-200"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterEnter={() => {
              setSearchTerm("");
              setFilteredOptions(options);
            }}
          >
            <ListboxOptions
              className={cn(
                "absolute min-w-[200px]  border shadow-md mt-1 font-normal  max-h-60 text-popover-foreground bg-popover rounded-md  text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5 z-10 ",
                slotProps?.option?.className,
                "max-sm:w-full max-sm:shadow-md",
              )}
            >
              {title && (
                <div className="sticky top-0 bg-popover p-2 z-10">
                  <p className="py-2 px-4 font-bold">{title}</p>
                  <Separator />
                </div>
              )}
              <div
                className={cn(
                  "sticky top-0 bg-popover p-2 py-2 z-10 border-b",
                  !isSearchable && "hidden",
                )}
              >
                <div className="relative space-y-2">
                  <div
                    className={cn(
                      "flex items-center px-2",
                      !isSearchable && "hidden",
                    )}
                  >
                    <Search className=" size-4 text-muted-foreground " />
                    <input
                      type="text"
                      className="w-full px-2 py-1 text-sm focus:outline-none font-normal bg-transparent"
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value.toUpperCase());
                        search(e.target.value.toUpperCase());
                        if (e.target.value.length === 0) {
                          setFilteredOptions(options);
                        }
                      }}
                    />
                  </div>
                  {enableSelectAll &&
                    checkAllPosition !== "bottom" &&
                    filteredOptions.length !== 0 && (
                      <div className="flex items-center space-x-2 mx-1">
                        <Checkbox
                          id="terms"
                          checked={
                            selectedData?.length === options.length || false
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedData(options);
                              onChange && onChange(options);
                            } else {
                              setSelectedData([]);
                              onChange && onChange([]);
                            }
                          }}
                        />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {"Select All"}
                        </label>
                      </div>
                    )}
                </div>
              </div>
              <div className="overflow-hidden">
                {filteredOptions && filteredOptions.length === 0 && (
                  <p className="p-4">Options is empty</p>
                )}
                {filteredOptions &&
                  filteredOptions.map((item, idx) => {
                    const selected = isSelected(item);

                    return (
                      <ListboxOption
                        key={idx}
                        value={item}
                        onClick={() => {
                          if (multiple) {
                            const currentData = selectedData ?? [];
                            const exists = _.some(currentData, {
                              value: item.value,
                            });

                            if (exists) {
                              const updatedData = _.filter(
                                currentData,
                                (i) => i.value !== item.value,
                              );
                              setSelectedData(updatedData);
                            } else {
                              const updatedData = [...currentData, item];
                              setSelectedData(updatedData);
                            }
                          } else {
                            setSelectedData([item]);
                          }
                        }}
                      >
                        <div
                          className={cn(
                            `flex max-sm:h-12 items-center  cursor-pointer hover:bg-accent hover:text-accent-foreground m-1 rounded-sm  select-none relative py-2 px-2 gap-2`,
                            checkVariant == "checkbox" &&
                              checkPosition == "right" &&
                              "justify-between",
                          )}
                        >
                          {checkVariant == "checkbox" &&
                            checkPosition == "left" && (
                              <Checkbox checked={selected} />
                            )}
                          {selected &&
                            checkVariant == "default" &&
                            checkPosition == "left" && (
                              <CheckIcon
                                className={`${selected && `absolute right-2 w-4 h-4 text-foreground `}`}
                              />
                            )}
                          <span className={cn("block truncate")}>
                            {item.label}
                          </span>
                          {checkVariant == "checkbox" &&
                            checkPosition == "right" && (
                              <Checkbox checked={selected} />
                            )}
                          {selected &&
                            checkVariant == "default" &&
                            checkPosition == "right" && (
                              <CheckIcon
                                className={`${selected && `absolute right-2 w-4 h-4 text-foreground `}`}
                              />
                            )}
                        </div>
                      </ListboxOption>
                    );
                  })}
              </div>
              {enableSelectAll &&
                checkAllPosition === "bottom" &&
                filteredOptions.length !== 0 && (
                  <div className="sticky bottom-0 bg-popover">
                    <Separator />
                    <div className="flex items-center space-x-2 mx-1 px-4 py-3">
                      <Checkbox
                        id="terms"
                        checked={
                          selectedData?.length === options.length || false
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedData(options);
                            onChange && onChange(options);
                          } else {
                            setSelectedData([]);
                            onChange && onChange([]);
                          }
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {"Select All"}
                      </label>
                    </div>
                  </div>
                )}

              {enableClearAll && filteredOptions.length !== 0 && (
                <div className="sticky bottom-0 bg-popover w-full ">
                  <Separator />
                  <div className="flex items-center   w-full">
                    <Button
                      className="w-full"
                      variant={"ghost"}
                      onClick={() => setSelectedData([])}
                    >
                      Clear filters
                    </Button>
                  </div>
                </div>
              )}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
