import ListService from "@/services/list/ListService";
import { ISuccessResponse } from "@/types/network/Response";
import { IBrandData } from "@/types/service/list";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { QueryNames } from "@/utils/enumeration";

const storeService = new ListService();

const generateMockDataBrands = (count: number) => {
  const mockData = [];

  for (let i = 0; i < count; i++) {
    const brandCode = faker.string.alpha({ length: 5, casing: "upper" });
    const brand = {
      brand_code: brandCode,
      brand: brandCode,
    };
    mockData.push(brand);
  }

  return mockData;
};

export const useFetchBrands = (isMock?: boolean) =>
  //eslint-disable-next-line
  useQuery<{}, { message: string }, ISuccessResponse<IBrandData[]>>({
    queryKey: [QueryNames.BRANDS],
    queryFn: async () => {
      if (!isMock) {
        const response = await storeService.getBrands();
        return response;
      } else {
        const data = generateMockDataBrands(50);
        return { data } as ISuccessResponse<IBrandData[]>;
      }
    },
  });
