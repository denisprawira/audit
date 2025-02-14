import Avatar from "@/components/avatar/avatar";
import { DropdownMenu } from "@/components/dropdown-menu/DropdownMenu";
import { MainMenu } from "@/components/header/menu/menu";
import { useTheme } from "@/components/theme-provider/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import supabaseClient from "@/features/auth/utils/SupabaseClient";
import useWindowSize from "@/hooks/utils/useWindowSize";
import { useUserStore } from "@/stores/Data/useUserStore";
import { useElementRefs } from "@/stores/ui/userRefsStore";
import { getInitials } from "@/utils/string-helpers";
import { ChevronDown, LogOut, MenuIcon, Moon, Sun } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const Header = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { setRef } = useElementRefs();
  const { width } = useWindowSize();
  const { theme, setTheme } = useTheme();
  const { user } = useUserStore();
  useEffect(() => {
    ref && setRef("header", ref);
  }, [width]);

  return (
    <div
      ref={ref}
      className="px-6 sm:px-8  py-3 border-solid border-b-2 border-gray-200 dark:border-slate-900 flex items-center justify-between gap-12 "
    >
      <img
        alt="PSM logo"
        src={"/psm.png"}
        className={`size-10  object-contain hidden sm:order-1 sm:block `}
      />
      <DropdownMenu
        menu={MainMenu}
        slotProps={{ DropdownMenuTrigger: { className: " sm:hidden" } }}
      >
        <Button variant={"outline"} size={"icon"} className="max-sm:size-12">
          <MenuIcon />
        </Button>
      </DropdownMenu>
      <nav className="min-h-10  gap-6 items-center justify-start w-full order-2 hidden sm:flex">
        {MainMenu.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.route ?? ""}
            className="cursor-pointer"
            style={({ isActive }) => {
              return {
                fontWeight: isActive ? "bold" : "normal",
              };
            }}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="order-2 flex items-center gap-2 w-full justify-end">
        <Button
          className="rounded-full size-10"
          variant={"outline"}
          size={"icon"}
          onClick={() =>
            theme === "light" ? setTheme("dark") : setTheme("light")
          }
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
        <DropdownMenu
          header={
            <div className="pt-4 px-2 space-y-2">
              <p className="flex flex-col gap-1">
                {`${user?.name ?? "User"} `}
                <br />
                <span className="text-muted-foreground text-sm">
                  {`(${user?.role.name ?? ""})`}
                </span>
              </p>
              <Separator />
            </div>
          }
          menu={[
            {
              label: "Logout",
              icon: <LogOut className="size-6" />,
              onClick: async () => {
                const response = await supabaseClient.auth.signOut();
                if (!response.error) {
                  for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key !== "vite-ui-theme") {
                      localStorage.removeItem(key);
                    }
                  }
                  window.location.href = "/";
                } else {
                  toast.error(response.error.message);
                }
              },
            },
          ]}
        >
          <Button
            variant={"outline"}
            className="rounded-full flex justify-center items-center p-1 py-2 gap-2  max-sm:h-12"
          >
            <Avatar
              fallback={getInitials(user?.name ?? "")}
              src=""
              className="max-sm:size-10"
            />
            <ChevronDown className="size-6 text-gray-500 hidden sm:block" />
          </Button>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
