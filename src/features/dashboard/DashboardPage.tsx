import Header from "@/components/header/Header";
import { useGetUser } from "@/features/auth/hooks/query/useUserQueries";
import { useUserStore } from "@/stores/Data/useUserStore";
import { useEffect } from "react";

import { Outlet } from "react-router";

const Dashboard = () => {
  const { data: userData } = useGetUser();
  const { user, setUser } = useUserStore();

  useEffect(() => {
    if (userData && !user) {
      setUser(userData);
    }
  }, [userData]);

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className=" flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
