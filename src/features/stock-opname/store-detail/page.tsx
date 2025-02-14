import SideMenu from "@/components/side-menu/SideMenu";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftCircle,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Tags,
} from "lucide-react";
import MenuItem from "@/types/component";

const menuData: MenuItem[] = [
  {
    title: "Overview",
    link: "/stock-opname/store/detail/overview",
    icon: <LayoutGrid />,
  },
  {
    title: "Inventory",
    icon: <Tags />,
    children: [
      { title: "Freeze", link: "/stock-opname/store/detail/freeze" },
      { title: "Scan", link: "/stock-opname/store/detail/scan" },
      { title: "Summary", link: "/stock-opname/store/detail/summary" },
    ],
  },
];

const SideMenuHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-start gap-2">
      <Button
        variant="ghost"
        className="w-full flex justify-start"
        onClick={() => navigate("/stock-opname/store")}
      >
        <ArrowLeftCircle className="w-4 h-4" />
        <p>Back to Store List</p>
      </Button>
    </div>
  );
};

const SoStoreDetailPage = () => {
  const [showMenu, setShowMenu] = useState(true);

  return (
    <div className="flex max-h-[calc(100vh-4.125rem)] h-full w-full">
      <motion.div
        className="w-fit flex-shrink-0 h-full relative "
        animate={{ x: showMenu ? 0 : "-16rem" }} // Move left when hidden
      >
        <SideMenu menu={menuData} header={<SideMenuHeader />} />
      </motion.div>

      <motion.div
        className="flex flex-shrink-0 max-h-[calc(100vh-4.125rem)] max-w-full relative "
        style={{ width: showMenu ? "calc(100vw - 16rem)" : "100%" }}
        animate={{
          x: showMenu ? 0 : "-16rem", // Shift left when menu hides
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

export default SoStoreDetailPage;
