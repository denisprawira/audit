import { useQuery } from "@tanstack/react-query";
import {
  IPreviewSummaryReportData,
  IPreviewReportScheduleDetail,
  IPreviewReportTotals,
  ISummaryAdjustmentData,
  ISummaryData,
  ISummaryFinalizeData,
} from "@/types/data/index";
import { useMemo, useState } from "react";
import { ISuccessResponse } from "@/types/network/Response";
import { ItemsType, QueryNames } from "@/utils/enumeration";
import {
  generateAdjustmentData,
  generateReportPreviewData,
  generateSummaryListData,
} from "@/utils/faker/summary";
import {
  checkFinalizeEligibility,
  getAdjustment,
  getSummary,
  getSummaryCountDocument,
  getSummarypreviewReport,
  getSummaryReportDocument,
} from "@/services/summary/summary-service";
import { SortingState } from "@tanstack/react-table";
import { downloadPDF, downloadStringToCSV } from "@/utils/download";

const useSummary = ({
  isMock = false,
  scheduleID,
  itemCode,
}: {
  isMock?: boolean;
  scheduleID: string;
  itemCode?: string;
}) => {
  const [summaryPage, setSummaryPage] = useState(1);
  const [summaryPerPage, setSummaryPerPage] = useState(10);
  const [summarySearch, setSummarySearch] = useState<string>("");
  const [summaryBrands, setSummaryBrands] = useState<string[]>([]);
  const [summaryStatus, setSummaryStatus] = useState<string[]>([]);
  const [summaryType, setSummaryType] = useState<ItemsType>(ItemsType.SALE);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loadPreviewReport, setLoadPreviewReport] = useState<boolean>(false);

  const [reportPic, setReportPic] = useState<string>("");
  const [reportSo, setReportSo] = useState<string>("");

  const summaryParams = useMemo(
    () => ({
      page: summaryPage,
      per_page: summaryPerPage,
      search: summarySearch,
      brand: summaryBrands,
      status: summaryStatus,
      sort:
        sorting.length > 0
          ? { [sorting[0].id]: sorting[0].desc ? "desc" : "asc" }
          : undefined,
      items_type: summaryType,
    }),
    [
      summaryPage,
      summaryPerPage,
      summarySearch,
      summaryBrands,
      summaryStatus,
      summaryType,
      sorting,
    ],
  );

  const summaryQuery = useQuery<
    ISuccessResponse<ISummaryData[]> & {
      all_brands: string[];
      all_statuses: string[];
      all_locations: { id: string; name: string }[];
      finalize_data: ISummaryFinalizeData;
    }
  >({
    queryKey: [QueryNames.SUMMARY, scheduleID, summaryParams],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      if (isMock) {
        const result = await generateSummaryListData(100);
        return result;
      } else {
        const { data } = await getSummary(scheduleID, summaryParams);
        return data;
      }
    },
  });

  const summaryAdjustmentQuery = useQuery<
    ISuccessResponse<ISummaryAdjustmentData>
  >({
    queryKey: [QueryNames.ADJUSTMENT, scheduleID, itemCode],
    queryFn: async () => {
      if (isMock) {
        return await generateAdjustmentData(10);
      } else {
        const { data } = await getAdjustment(scheduleID, itemCode ?? "");
        return data;
      }
    },
    retry: false,
    enabled: Boolean(scheduleID) && Boolean(itemCode),
    refetchOnWindowFocus: false,
  });

  const summaryReportPreviewQuery = useQuery<
    ISuccessResponse<IPreviewSummaryReportData[]> & {
      totals: IPreviewReportTotals;
      schedule: IPreviewReportScheduleDetail;
    }
  >({
    queryKey: [
      QueryNames.SUMMARY_REPORT_PREVIEW,
      scheduleID,
      loadPreviewReport,
    ],
    queryFn: async () => {
      if (isMock) {
        const result = await generateReportPreviewData(10);
        return result;
      } else {
        const { data } = await getSummarypreviewReport(scheduleID);
        return data;
      }
    },
    enabled: loadPreviewReport,
  });

  const checkFinalizeEligibilityQuery = useQuery<{
    is_finalize_eligible: boolean;
  }>({
    queryKey: [QueryNames.CHECK_FINALIZE_ELIGIBILITY, scheduleID],
    queryFn: async () => {
      const { data } = await checkFinalizeEligibility(scheduleID);
      return data;
    },
  });

  const downloadCountReportQuery = useQuery({
    queryKey: [QueryNames.DOWNLAOD_COUNT_SUMMARY, scheduleID],
    queryFn: async () => {
      const result = await getSummaryCountDocument(scheduleID);
      downloadStringToCSV(result.data);
      return result;
    },
    enabled: false,
  });

  const downloadReportParams = useMemo(() => {
    return {
      pic_name: reportPic,
      so_member_name: reportSo,
    };
  }, [reportSo, reportPic]);

  const downloadReportQuery = useQuery({
    queryKey: [
      QueryNames.DOWNLOAD_REPORT_SUMMARY,
      scheduleID,
      downloadReportParams,
    ],
    queryFn: async () => {
      const result = await getSummaryReportDocument(
        scheduleID,
        downloadReportParams,
      );
      downloadPDF(result.data);
      return result;
    },
    enabled: !!reportPic && !!reportSo,
  });

  return {
    summaryQuery,
    summaryAdjustmentQuery,
    summaryReportPreviewQuery,
    checkFinalizeEligibilityQuery,
    summaryFilters: {
      page: summaryPage,
      setPage: setSummaryPage,
      perPage: summaryPerPage,
      setPerPage: setSummaryPerPage,
      search: summarySearch,
      setSearch: setSummarySearch,
      brands: summaryBrands,
      setBrands: setSummaryBrands,
      status: summaryStatus,
      setStatus: setSummaryStatus,
      sorting: sorting,
      setSorting: setSorting,
      summaryType,
      setSummaryType,
    },
    reportPreview: {
      loadPreviewReport,
      setLoadPreviewReport,
    },
    downloadReportFilters: {
      setReportPic,
      setReportSo,
    },
    download: {
      downloadCountReportQuery,
      downloadReportQuery,
    },
  };
};
export default useSummary;
