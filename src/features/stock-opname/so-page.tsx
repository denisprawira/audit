import SideMenu from "@/components/side-menu/SideMenu";
import MenuItem from "@/types/component";
import { Building, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { Outlet } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const menuData: MenuItem[] = [
  {
    title: "Store",
    link: "/stock-opname/store",
    icon: <Building />,
  },
  {
    title: "Warehouse",
    link: "/stock-opname/warehouse",
    icon: <Store />,
  },
];

const StockOpname = () => {
  const [showMenu, setShowMenu] = useState(true);
  return (
    <div className="flex h-full overflow-hidden">
      <motion.div
        className="w-fit flex-shrink-0 h-full relative "
        animate={{ x: showMenu ? 0 : "-16rem" }}
      >
        <SideMenu menu={menuData} />
      </motion.div>

      <motion.div
        className="flex flex-shrink-0 max-h-[calc(100vh-4.125rem)] max-w-full relative "
        style={{ width: showMenu ? "calc(100vw - 16rem)" : "100%" }}
        animate={{
          x: showMenu ? 0 : "-16rem",
        }}
      >
        <Button
          onClick={() => setShowMenu(!showMenu)}
          variant="outline"
          size="icon"
          className={`rounded-full shadow-md absolute transition-all  ${showMenu ? "-left-[20px]" : "-left-[1rem]"} z-10  mt-11`}
        >
          {showMenu ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        <Outlet />
      </motion.div>
    </div>
  );
};

export default StockOpname;
