import { IUser } from "@/types/UserTypes";
import { QueryNames } from "@/utils/enumeration";
import { useQuery } from "@tanstack/react-query";
import { faker } from "@faker-js/faker";
import { getUser } from "@/services/user/UserService";

const generateMockDataUser = (): IUser => {
  const mockData: IUser = {
    email: faker.internet.email(),
    name: faker.internet.displayName(),
    role: {
      name: faker.person.jobTitle(),
      code: faker.person.jobType(),
    },
  };
  return mockData;
};

export const useGetUser = (isMock?: boolean) =>
  useQuery({
    queryKey: [QueryNames.USER_INFO],
    queryFn: async () => {
      if (!isMock) {
        const response = await getUser();
        return response.data as IUser;
      } else {
        return generateMockDataUser();
      }
    },
    staleTime: Infinity,
  });
