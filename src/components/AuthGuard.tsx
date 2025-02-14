import Auth from "@/features/auth/AuthPage";
import supabaseClient from "@/features/auth/utils/SupabaseClient";
import { useEffect, useState } from "react";
interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const [authenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setIsAuthenticated(user !== null);
    };
    checkAuth();
  }, []);

  if (authenticated === null) {
    return null;
  }
  if (authenticated) {
    return <>{children}</>;
  } else {
    return <Auth />;
  }
};

export default AuthGuard;
