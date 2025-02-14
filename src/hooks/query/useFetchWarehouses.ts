import WarehouseService from "@/services/warehouse/WarehouseService";
import { ISuccessResponse } from "@/types/network/Response";
import { IWarehouseData } from "@/types/service/warehouse";
import { QueryNames } from "@/utils/enumeration";
import { faker } from "@faker-js/faker";
import { useQuery } from "@tanstack/react-query";

const warehouseService = new WarehouseService();

const generateMockDataWarehouse = (count: number) => {
  const mockData = [];
  for (let i = 0; i < count; i++) {
    const warehouse: IWarehouseData = {
      code: faker.string.alpha({ length: 5, casing: "upper" }),
      name: faker.string.alpha({ length: 5, casing: "upper" }),
      type: faker.commerce.productMaterial(),
    };
    mockData.push(warehouse);
  }
  return mockData;
};

export const useFetchWarehouses = ({
  isMock,
  types,
  isActive,
}: {
  isMock?: boolean;
  types?: string[];
  isActive?: boolean;
}) =>
  //eslint-disable-next-line
  useQuery<{}, { message: string }, ISuccessResponse<IWarehouseData[]>>({
    queryKey: [QueryNames.WAREHOUSE, types, isActive],
    queryFn: async () => {
      if (!isMock) {
        const response = await warehouseService.getWarehouses(types, isActive);
        return response;
      } else {
        const data = generateMockDataWarehouse(50);
        return { data: data } as ISuccessResponse<IWarehouseData[]>;
      }
    },
  });
