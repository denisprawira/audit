import AuthGuard from "@/components/AuthGuard";
import NotFoundPage from "@/pages/404page";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import supabaseClient from "@/features/auth/utils/SupabaseClient";
import { lazy, Suspense, useEffect, useState } from "react";
import Loader from "@/components/loader/Loader";
import StockOpname from "@/features/stock-opname/so-page";
import { RowData } from "@tanstack/react-table";
import EmptyPlaceholder from "@/components/empty-placeholder/EmptyPlaceholder";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "center" | "right";
    rowspan?: number;
  }
}

const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const StorePage = lazy(() => import("@/features/audit/StorePage"));
const SoStorePage = lazy(
  () => import("@/features/stock-opname/store/store-page"),
);
const SoStoreDetailPage = lazy(
  () => import("@/features/stock-opname/store-detail/page"),
);
const OverviewPage = lazy(
  () => import("@/features/stock-opname/store-detail/pages/overview-page"),
);
const FreezePage = lazy(
  () =>
    import(
      "@/features/stock-opname/store-detail/pages/barang-dagang/freeze-page"
    ),
);
const ScanPage = lazy(
  () =>
    import(
      "@/features/stock-opname/store-detail/pages/barang-dagang/scan-page"
    ),
);
const SummaryPage = lazy(
  () =>
    import(
      "@/features/stock-opname/store-detail/pages/barang-dagang/summary-page"
    ),
);
const NonBarangDagangPage = lazy(
  () => import("@/features/stock-opname/store-detail/pages/non-dagang-page"),
);

const ScanDetailPage = lazy(
  () =>
    import(
      "@/features/stock-opname/store-detail/pages/barang-dagang/scan-detail-page"
    ),
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setIsAuthenticated(user !== null);
    };

    checkAuth();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthGuard authenticated={isAuthenticated}>
          <Suspense
            fallback={
              <div className="h-full w-full flex items-center justify-center">
                <Loader showText />
              </div>
            }
          >
            <DashboardPage />
          </Suspense>
        </AuthGuard>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/audit" replace />,
        },
        {
          path: "audit",
          element: (
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  <Loader showText />
                </div>
              }
            >
              <StorePage />
            </Suspense>
          ),
        },
        {
          path: "stock-opname",
          element: (
            <Suspense fallback={<p className="text-lg m-4">Loading...</p>}>
              <StockOpname />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: <Navigate to="store" replace />,
            },
            {
              path: "store",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <SoStorePage />
                </Suspense>
              ),
            },
            {
              path: "warehouse",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <EmptyPlaceholder
                    icon={"🚧"}
                    title={"Menu is under construction"}
                    description="Warehouse SO will show up here"
                  />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "stock-opname/store/detail",
          element: (
            <Suspense
              fallback={
                <div className="h-full w-full flex items-center justify-center">
                  <Loader showText />
                </div>
              }
            >
              <SoStoreDetailPage />
            </Suspense>
          ),
          children: [
            // Redirect "/stock-opname/store/detail" to "/stock-opname/store/detail/overview"
            {
              index: true,
              element: <Navigate to="overview" replace />,
            },
            {
              path: "overview",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <OverviewPage />
                </Suspense>
              ),
            },
            {
              path: "freeze",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <FreezePage />
                </Suspense>
              ),
            },
            {
              path: "scan",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <ScanPage />
                </Suspense>
              ),
            },
            {
              path: "scan/detail",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <ScanDetailPage />
                </Suspense>
              ),
            },
            {
              path: "summary",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <SummaryPage />
                </Suspense>
              ),
            },
            {
              path: "non-dagang",
              element: (
                <Suspense
                  fallback={
                    <div className="h-full w-full flex items-center justify-center">
                      <Loader showText />
                    </div>
                  }
                >
                  <NonBarangDagangPage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return (
    <>
      <Toaster />
      {import.meta.env.VITE_MAINTENANCE_MODE === "true" ? (
        <div className="w-full h-full gap-4 flex flex-col justify-center items-center">
          <h1 className="font-semibold text-2xl">🚧 We'll Be Back Soon! 🚧</h1>
          <p className="text-wrap text-center leading-7 text-lg">
            Our website is currently undergoing scheduled maintenance to improve
            your experience.
            <br /> Thank you for your patience. We'll be back online shortly!
          </p>
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </>
  );
}

export default App;
