import { useDocumentFiltersStore } from "@/features/audit/stores/filters/useDocumentFilterStore";
import ItemTransactionService from "@/services/item-transaction/ItemTransactionService";
import { QueryNames } from "@/utils/enumeration";
import { useQuery } from "@tanstack/react-query";

const itemTransactionService = new ItemTransactionService();

export const useTransactionDocument = (open: boolean) => {
  const { filters, setFilters } = useDocumentFiltersStore();

  const query = useQuery({
    queryKey: [
      QueryNames.TRANSACTION_DOCUMENT,
      filters?.busproc,
      filters?.db,
      filters?.docnum,
    ],
    queryFn: async () => {
      const response = await itemTransactionService.getTransactionDocument({
        docnum: filters?.docnum ?? "",
        filters: { busproc: filters?.busproc || "", db: filters?.db || "" },
      });
      return response.data;
    },

    enabled: !!filters?.busproc && !!filters?.db && !!filters?.docnum && open,
  });

  return {
    query,
    filters,
    setFilters,
  };
};
