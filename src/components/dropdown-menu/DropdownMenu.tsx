import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { IMenu } from "@/types/MenuTypes";
import { NavLink } from "react-router-dom";

interface DropdownMenuProps {
  menu: IMenu[];
  children: React.ReactNode;
  header?: React.ReactNode;
  slotProps?: {
    DropdownMenuTrigger?: {
      className: string;
    };
    DropdownMenuContent?: {
      className: string;
    };
  };
}

export function DropdownMenu({
  menu,
  header,
  children,
  slotProps,
}: DropdownMenuProps) {
  return (
    <ShadcnDropdownMenu>
      <DropdownMenuTrigger
        className={slotProps?.DropdownMenuTrigger?.className ?? ""}
        asChild
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("w-56", slotProps?.DropdownMenuContent?.className)}
      >
        {header && header}
        {menu.map((item, idx) =>
          item.route ? (
            <NavLink
              key={idx}
              to={item.route ?? ""}
              className="cursor-pointer"
              style={({ isActive }) => ({
                fontWeight: isActive ? "bold" : "normal",
              })}
            >
              <DropdownMenuItem
                key={idx}
                disabled={item.disabled}
                className="h-12 cursor-pointer"
              >
                {item.icon && item.icon}
                <span>{item.label}</span>
              </DropdownMenuItem>
            </NavLink>
          ) : (
            <DropdownMenuItem
              key={idx}
              disabled={item.disabled}
              onClick={() => {
                item.onClick?.();
              }}
              className="h-12 cursor-pointer"
            >
              {item.icon && item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  );
}
