import Auth from "@/features/auth/AuthPage";
interface AuthGuardProps {
  children: React.ReactNode;
  authenticated: boolean | null;
}

const AuthGuard = ({ children, authenticated }: AuthGuardProps) => {
  if (authenticated == null) {
    return null;
  }
  if (authenticated) {
    return <>{children}</>;
  } else {
    return <Auth />;
  }
};

export default AuthGuard;
