import {
  Filters,
  IItemTransactionResponse,
  ITransactionResponse,
} from "@/features/audit/types/data/TransactionTypes";
import { IItemTransactionQueryParams } from "@/features/audit/types/filters/ItemTransactionFilters";
import { IItemTransactionData } from "@/features/audit/types/data/TransactionTypes";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { IMetaData } from "@/types/network/Response";
import { QueryNames } from "@/utils/enumeration";
import ItemTransactionService from "@/services/item-transaction/ItemTransactionService";
const itemTransactionService = new ItemTransactionService();

export const generateMockTransactionData = (
  count: number,
): ITransactionResponse => {
  const generateItemTransactionData = (): IItemTransactionData => ({
    busproc: faker.helpers.arrayElement(["Purchase", "Sale", "Transfer"]),
    doc_num: faker.string.uuid().slice(0, 6),
    from: faker.string.alpha({ length: 5, casing: "upper" }),
    to: faker.string.alpha({ length: 5, casing: "upper" }),
    qty: faker.number.int({ min: 0, max: 100 }),
    doc_date: faker.date.past().toISOString().split("T")[0],
    base_doc: faker.string.uuid().slice(0, 6),
    db: faker.string.uuid(),
    cumulative_qty: faker.number.int({ min: 0, max: 100 }),
  });

  const generateFilters = (): Filters => ({
    from: Array.from({ length: 5 }, () => faker.address.city()),
    to: Array.from({ length: 5 }, () => faker.address.city()),
    busproc: ["Purchase", "Sale", "Transfer"],
  });

  const mockData = Array.from({ length: count }, generateItemTransactionData);

  return {
    transactions: {
      data: mockData,
      meta: {
        current_page: 1,
        from: 1,
        last_page: Math.ceil(count / 10),
        total: count,
        per_page: 10,
        to: count > 10 ? 10 : count,
      } as IMetaData,
    } as IItemTransactionResponse,
    filters: generateFilters(),
  };
};

export const useFetchItemTransaction = (
  warehouseCode: string,
  filters: IItemTransactionQueryParams,
  isMock?: boolean,
) =>
  //eslint-disable-next-line
  useQuery<{}, { message: string }, ITransactionResponse>({
    queryKey: [QueryNames.ITEM_TRANSACTION, filters, warehouseCode],
    queryFn: async () => {
      if (!isMock) {
        const response = await itemTransactionService.getItemTransaction({
          warehouseCode: warehouseCode,
          filters,
        });
        return response;
      } else {
        const data = generateMockTransactionData(50);
        return data;
      }
    },
    placeholderData: (prev) => prev,
    enabled: !!filters && !!warehouseCode,
  });
