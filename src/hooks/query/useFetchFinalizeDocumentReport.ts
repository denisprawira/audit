import { useWarehouseOverviewFilters } from "@/features/audit/stores/filters/useWarehouseOverviewFiltersStore";
import { Filter } from "@/features/audit/types/filters/WarehouseOverviewFilters";
import WarehouseService from "@/services/warehouse/WarehouseService";
import { QueryNames, WarehouseOverviewFilterNames } from "@/utils/enumeration";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const warehouseService = new WarehouseService();

export const useFetchFinalizeDocumentReport = () => {
  const { queryParams, company } = useWarehouseOverviewFilters();

  const [isDownload, setIsDownload] = useState(false);

  const brands = (queryParams.filters?.find(
    (f: Filter) => f.field === WarehouseOverviewFilterNames.BRAND_CODE,
  )?.values || []) as string[];

  const canFetch =
    !!company &&
    !!queryParams?.db1 &&
    !!queryParams.db2 &&
    !!queryParams.cutoff_to &&
    !!brands &&
    isDownload;

  const query = useQuery({
    queryKey: [
      QueryNames.FINALIZED_DOCUMENT_REPORT,
      company,
      queryParams?.db1,
      queryParams.db2,
      queryParams.cutoff_to,
      brands,
    ],
    queryFn: async () => {
      const response = await warehouseService.getFinalizeDocumentReport({
        whscode: company ?? "",
        filters: {
          db1: queryParams?.db1 || "",
          db2: queryParams.db2 || "",
          cutoff_date: queryParams.cutoff_to || "",
          brand_codes: brands || "",
        },
      });
      return response;
    },
    enabled: canFetch,
  });

  useEffect(() => {
    if (query.isSuccess || query.isError) {
      setIsDownload(false);
    }
  }, [query.isSuccess, query.isError]);

  const triggerDownload = () => {
    setIsDownload(true);
    query.refetch();
  };

  return { query, triggerDownload };
};
