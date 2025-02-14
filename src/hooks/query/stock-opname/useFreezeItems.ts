import { useQuery } from "@tanstack/react-query";
import { FreezeGroup, IDocumentFreeze, IFreezeData } from "@/types/data/index";
import { useMemo, useState } from "react";
import { ISuccessResponse } from "@/types/network/Response";
import {
  getAvailableFreezeData,
  getFreezeData,
  pullFreezeData,
} from "@/services/freeze/freeze-data-service";
import { SortingState } from "@tanstack/react-table";
import { generateFreezeData } from "@/utils/faker/freeze-items";
import { QueryNames } from "@/utils/enumeration";

interface IProps {
  isMock?: boolean;
  scheduleID: string;
}

const useFreezeItems = ({ isMock = false, scheduleID }: IProps) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [freezeId, setFreezeId] = useState<string>("");
  const [isPulldata, setIsPullData] = useState<boolean>(false);

  const params = useMemo(() => {
    //eslint-disable-next-line
    const params: Record<string, any> = {
      page,
      per_page: perPage,
      sort:
        sorting.length > 0
          ? { [sorting[0].id]: sorting[0].desc ? "desc" : "asc" }
          : undefined,
      brand: brands,
      paginated: true,
      search: search,
    };

    return params;
  }, [page, perPage, sorting, brands, search]);

  const freezeItemQuery = useQuery<
    ISuccessResponse<IFreezeData[]> & {
      brand_codes: string[];
      freeze_group: FreezeGroup;
    }
  >({
    queryKey: [QueryNames.FREEZE_ITEMS, scheduleID, params],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      if (isMock) {
        const result = await generateFreezeData(100);
        return result;
      } else {
        const { data } = await getFreezeData(scheduleID, params);
        return data;
      }
    },
    retry: 1,
  });

  const listDocumentFreezeQuery = useQuery<ISuccessResponse<IDocumentFreeze[]>>(
    {
      queryKey: [QueryNames.SELECT_DOCUMENT_FREEZE, scheduleID],
      queryFn: async () => {
        const { data } = await getAvailableFreezeData(scheduleID);
        return data;
      },
      enabled: !!scheduleID,
      retry: 1,
    },
  );

  const pullFreezeDataQuery = useQuery({
    queryKey: [QueryNames.PULL_FREEZE_ITEMS, freezeId, isPulldata, scheduleID],
    queryFn: async () => {
      const { data } = await pullFreezeData(scheduleID, freezeId);
      return data;
    },
    enabled: !!scheduleID && !!freezeId && isPulldata,
    retry: false,
  });

  return {
    freezeItemQuery,
    pullFreezeDataQuery,
    listDocumentFreezeQuery,
    page,
    setPage,
    perPage,
    setPerPage,
    sorting,
    setSorting,
    brands,
    setBrands,
    search,
    setSearch,
    freezeId,
    setFreezeId,
    isPulldata,
    setIsPullData,
  };
};
export default useFreezeItems;
