import { IWarehouseQueryParams } from "@/features/audit/types/filters/WarehouseOverviewFilters";
import WarehouseService from "@/services/warehouse/WarehouseService";
import { queryClient } from "@/utils/query-client";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { ISuccessResponse } from "@/types/network/Response";
import { IWarehouseOverviewData } from "@/features/audit/types/data/WarehouseTypes";
import { QueryNames } from "@/utils/enumeration";

const warehouseService = new WarehouseService();

const generateMockDataWarehouseOverview = (count: number) => {
  const mockData = [];

  for (let i = 0; i < count; i++) {
    const hasReview = faker.datatype.boolean();

    const review = hasReview
      ? {
          id: faker.string.uuid(),
          remark: faker.lorem.sentence() + faker.lorem.sentence(),
          is_reviewed: faker.datatype.boolean(),
          is_changed: faker.datatype.boolean(),
          cutoff_from: faker.date.past().toISOString(),
          cutoff_to: faker.date.future().toISOString(),
          reviewer: {
            name: faker.name.fullName(),
            email: faker.internet.email(),

            role: {
              name: faker.person.jobTitle(),
              code: faker.person.jobType(),
            },
          },
          updated_at: faker.date.recent().toISOString(),
        }
      : null;

    mockData.push({
      itemcode: faker.string.uuid().slice(0, 6),
      qty_soh: faker.number.int({ min: 0, max: 2000 }),
      qty_soh_1: faker.number.int({ min: 0, max: 2000 }),
      qty_difference: faker.number.int({ min: 0, max: 2000 }),
      brand_code: faker.commerce.product(),
      brand_name: faker.commerce.product(),
      is_finalized: faker.datatype.boolean(),
      review,
    });
  }

  return mockData;
};

export const useFetchWarehousesOverview = (
  warehouseCode: string,
  filters: IWarehouseQueryParams,
  isMock?: boolean,
) =>
  useQuery<
    //eslint-disable-next-line
    {},
    { message: string },
    ISuccessResponse<IWarehouseOverviewData[]> & {
      allow_finalize: boolean;
    }
  >({
    queryKey: [QueryNames.WAREHOUSE_OVERVIEW, warehouseCode, filters],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      if (!isMock) {
        const response = await warehouseService.getWarehouseOverview({
          warehouseCode: warehouseCode,
          filters,
        });
        return response;
      } else {
        const data = generateMockDataWarehouseOverview(50);
        return { data: data } as ISuccessResponse<IWarehouseOverviewData[]>;
      }
    },

    enabled: !isMock
      ? !!warehouseCode && !!filters.db1 && !!filters.db2 && !!filters.cutoff_to
      : true,
  });

export const invalidateWarehouseOverview = () => {
  queryClient.invalidateQueries({
    queryKey: [QueryNames.WAREHOUSE_OVERVIEW],
  });
};
