import ListService from "@/services/list/ListService";
import { ISuccessResponse } from "@/types/network/Response";
import { IDatabaseData } from "@/types/service/list";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { QueryNames } from "@/utils/enumeration";

const storeService = new ListService();

const generateMockDataDatabases = (count: number) => {
  const mockData = [];
  for (let i = 0; i < count; i++) {
    const brand: IDatabaseData = {
      db_1: faker.string.alpha({ length: 5, casing: "upper" }),
      db_2: faker.string.alpha({ length: 5, casing: "upper" }),
    };
    mockData.push(brand);
  }
  return mockData;
};

export const useFetchDatabases = (isMock?: boolean) =>
  //eslint-disable-next-line
  useQuery<{}, { message: string }, ISuccessResponse<IDatabaseData[]>>({
    queryKey: [QueryNames.DATABASES],
    queryFn: async () => {
      if (!isMock) {
        const response = await storeService.getComparisonDbs();
        return response;
      } else {
        const response = generateMockDataDatabases(50);
        return { data: response } as ISuccessResponse<IDatabaseData[]>;
      }
    },
  });
