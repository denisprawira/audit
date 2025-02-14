import { useDocumentFiltersStore } from "@/features/audit/stores/filters/useDocumentFilterStore";
import ItemTransactionService from "@/services/item-transaction/ItemTransactionService";
import { QueryNames } from "@/utils/enumeration";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const itemTransactionService = new ItemTransactionService();

export const useFetchItemDocumentReport = () => {
  const { filters, setFilters } = useDocumentFiltersStore();
  const [isDownload, setIsDownload] = useState(false);

  const canFetch =
    !!filters?.busproc && !!filters?.db && !!filters?.docnum && isDownload;

  const query = useQuery({
    queryKey: [
      QueryNames.TRANSACTION_DOCUMENT_REPORT,
      filters?.busproc,
      filters?.db,
      filters?.docnum,
    ],
    queryFn: async () => {
      const response =
        await itemTransactionService.getTransactionDocumentReport({
          docnum: filters?.docnum ?? "",
          filters: { busproc: filters?.busproc || "", db: filters?.db || "" },
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

  return { query, filters, setFilters, triggerDownload };
};
