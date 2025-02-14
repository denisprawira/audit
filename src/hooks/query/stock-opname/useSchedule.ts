import {
  getSchedule,
  getScheduleDetail,
} from "@/services/schedule/schedule-service";
import { getUserList } from "@/services/user/UserService";
import { IScheduleData, IScheduleOverviewData } from "@/types/data";
import { ISuccessResponse } from "@/types/network/Response";
import { SortColumn } from "@/types/SortTypes";
import { IUser } from "@/types/UserTypes";
import { QueryNames } from "@/utils/enumeration";
import {
  generateScheduleData,
  generateScheduleOverviewData,
} from "@/utils/faker/schedule";
import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface IParams {
  page?: number;
  perPage?: number;
  start_date?: string;
  end_date?: string;
  search?: string;
  sort?: SortColumn;
  paginated?: boolean;
  status?: string[];
  uuid?: string;
  isMockData?: boolean;
  roleCode?: string[];
}

const useSchedule = (params?: IParams) => {
  const [page, setPage] = useState(params?.page || 1);
  const [perPage, setPerPage] = useState(params?.perPage || 10);
  const [startDate, setStartDate] = useState(params?.start_date);
  const [endDate, setEndDate] = useState(params?.end_date);
  const [search, setSearch] = useState(params?.search);
  const [paginated, setPaginated] = useState(params?.paginated ?? true);
  const [status, setStatus] = useState<string[] | undefined>(params?.status);
  const [rolesCode, setRolesCode] = useState<string[]>(params?.roleCode ?? []);
  const [isActive, setIsActive] = useState<string[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const queryParams = useMemo(() => {
    // eslint-disable-next-line
    const params: Record<string, any> = {
      page: page,
      per_page: perPage,
      start_date: startDate,
      end_date: endDate,
      search: search,
      paginated: paginated,
      status: status,
      sort:
        sorting.length > 0
          ? { [sorting[0].id]: sorting[0].desc ? "desc" : "asc" }
          : undefined,
    };

    return params;
  }, [page, perPage, startDate, endDate, search, paginated, status, sorting]);

  const scheduleQuery = useQuery<ISuccessResponse<IScheduleData[]>>({
    queryKey: [QueryNames.SCHEDULE, queryParams],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      if (params?.isMockData) {
        const result = await generateScheduleData(100);
        return result;
      } else {
        const { data } = await getSchedule(queryParams);
        return data;
      }
    },
    enabled:
      !!queryParams.page && !!queryParams.per_page && !!queryParams.paginated,
  });

  const scheduleOverviewQuery = useQuery<
    ISuccessResponse<IScheduleOverviewData>
  >({
    queryKey: [QueryNames.SCHEDULE_OVERVIEW, params?.uuid],
    queryFn: async () => {
      if (params?.isMockData) {
        const result = await generateScheduleOverviewData();
        return result;
      } else {
        const { data } = await getScheduleDetail(params?.uuid ?? "");
        return data;
      }
    },
    enabled: !!params?.uuid,
  });

  const assigneQuery = useQuery<ISuccessResponse<IUser[]>>({
    queryKey: [QueryNames.ASSIGNEES, rolesCode],
    queryFn: async () => {
      const { data } = await getUserList(rolesCode);
      return data;
    },
    enabled: !!rolesCode,
  });

  return {
    scheduleQuery,
    scheduleOverviewQuery,
    schedule: {
      startDate,
      setStartDate,
      setEndDate,
      endDate,
      search,
      setSearch,
      sorting,
      setSorting,
      page,
      setPage,
      perPage,
      setPerPage,
      paginated,
      setPaginated,
      status,
      setStatus,
    },
    assigneQuery,
    assigne: {
      rolesCode,
      setRolesCode,
      isActive,
      setIsActive,
    },
  };
};
export default useSchedule;
