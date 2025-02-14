import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import MenuItem from "@/types/component";

const SideMenu = ({
  menu,
  header,
}: {
  menu: MenuItem[];
  header?: React.ReactNode;
}) => {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (title: string) => {
    const newOpenMenus = new Set(openMenus);
    if (newOpenMenus.has(title)) {
      newOpenMenus.delete(title);
    } else {
      newOpenMenus.add(title);
    }
    setOpenMenus(newOpenMenus);
  };

  useEffect(() => {
    // Automatically open the parent menu if the current location matches a child link
    menu.forEach((menu) => {
      if (menu.children?.some((child) => child.link === location.pathname)) {
        setOpenMenus((prev) => new Set(prev).add(menu.title));
      }
    });
  }, [location]);

  const renderMenu = (menuItems: MenuItem[]) => {
    return (
      <ul className="w-full space-y-1">
        {menuItems.map((item, index) => (
          <li key={index} className="relative w-full">
            <Button
              variant="ghost"
              size="sm"
              className={`w-full max-w-full flex justify-between  ${item.link === location.pathname && "bg-muted-foreground/10"}`}
              onClick={() => {
                if (item.children) toggleMenu(item.title);
                if (item.link) navigate(item.link);
              }}
            >
              <div className="flex gap-3">
                {item.icon}
                {item.title}
              </div>
              {item.children && (
                <ChevronRight
                  className={`transition-all ${openMenus.has(item.title) ? "rotate-90" : ""}`}
                />
              )}
            </Button>
            {item.children && (
              <motion.div
                animate={
                  openMenus.has(item.title)
                    ? { height: "auto", opacity: 1 }
                    : { height: 0, opacity: 0 }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <ul className="pl-2 space-y-2 w-full border-l-2 border-gray-200 mx-6">
                  {renderMenu(item.children)}
                </ul>
              </motion.div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-[16rem] h-full border-r px-2 py-4 gap-2 flex flex-col shadow-lg">
      {header && header}
      {header && <Separator orientation="horizontal" />}
      <div>{renderMenu(menu)}</div>
    </div>
  );
};

export default SideMenu;
