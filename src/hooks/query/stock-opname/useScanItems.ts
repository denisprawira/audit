import { useQuery } from "@tanstack/react-query";
import { IScanItemDetail, IScanData, ICommentData } from "@/types/data/index";
import { ISuccessResponse } from "@/types/network/Response";
import { QueryNames, ItemsType } from "@/utils/enumeration";
import {
  getScanDownload,
  getScanItem,
  getScanItemDetail,
} from "@/services/scan-item/scan-item-service";
import {
  generateScanItemData,
  generateScanItemDetailsData,
} from "@/utils/faker/scan-item";
import { SortingState } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { downloadStringToCSV } from "@/utils/download";

interface IParams {
  isMock?: boolean;
  scheduleID: string;
  scanId?: string;
}

const useScanItems = ({ isMock = false, scheduleID, scanId }: IParams) => {
  const [scanItemPage, setScanItemPage] = useState(1);
  const [scanItemPerPage, setScanItemPerPage] = useState(10);
  const [scanItemScannedBy, setScanItemScannedBy] = useState<string[]>([]);
  const [scanItemSearch, setScanItemSearch] = useState<string>("");
  const [scanItemType, setScanItemType] = useState<ItemsType>(ItemsType.SALE);

  const [scanItemDetailPage, setScanItemDetailPage] = useState(1);
  const [scanItemDetailPerPage, setScanItemDetailPerPage] = useState(10);
  const [scanItemDetailScannedBy, setScanItemDetailScannedBy] = useState<
    string[]
  >([]);
  const [scanItemDetailBrand, setScanItemDetailBrand] = useState<string[]>([]);
  const [scanItemDetailSearch, setScanItemDetailSearch] = useState<string>("");
  const [scanItemDetailSort, setScanItemDetailSort] = useState<SortingState>(
    [],
  );

  const scanItemParams = useMemo(
    () => ({
      page: scanItemPage,
      per_page: scanItemPerPage,
      search: scanItemSearch,
      scanned_by: scanItemScannedBy.length > 0 ? scanItemScannedBy : undefined,
      paginated: true,
      items_type: scanItemType,
    }),
    [
      scanItemPage,
      scanItemPerPage,
      scanItemScannedBy,
      scanItemSearch,
      scanItemType,
    ],
  );

  const scanItemDetailParams = useMemo(
    () => ({
      page: scanItemDetailPage,
      per_page: scanItemDetailPerPage,
      search: scanItemDetailSearch,
      brand: scanItemDetailBrand,
      paginated: true,
      sort:
        scanItemDetailSort.length > 0
          ? {
              [scanItemDetailSort[0].id]: scanItemDetailSort[0].desc
                ? "desc"
                : "asc",
            }
          : undefined,
    }),
    [
      scanItemDetailPage,
      scanItemDetailPerPage,
      scanItemDetailSearch,
      scanItemDetailBrand,
      scanItemDetailSort,
    ],
  );

  const scanItemQuery = useQuery<ISuccessResponse<IScanData[]>>({
    queryKey: [
      QueryNames.SCAN_ITEM,
      scheduleID,
      JSON.stringify(scanItemParams),
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      if (isMock) {
        const result = await generateScanItemData(100);
        return result;
      } else {
        const { data } = await getScanItem(scheduleID, scanItemParams);
        return data;
      }
    },
  });

  const scanItemDetailQuery = useQuery<
    ISuccessResponse<IScanItemDetail[]> & {
      brand_codes: string[];
      notes: ICommentData;
    }
  >({
    queryKey: [
      QueryNames.SCAN_ITEM_DETAILS,
      scanItemDetailParams,
      scanId,
      scheduleID,
    ],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      if (isMock) {
        const result = await generateScanItemDetailsData(100);
        return result;
      } else {
        const { data } = await getScanItemDetail(
          scheduleID,
          scanId ?? "",
          scanItemDetailParams,
        );
        return data;
      }
    },
    enabled: !!scheduleID && !!scanId,
  });

  const downloadScanItemsQuery = useQuery({
    queryKey: [QueryNames.DOWNLOAD_SCAN_ITEM, scanId],
    queryFn: async () => {
      const result = await getScanDownload(scanId ?? "");
      downloadStringToCSV(result.data);
      return result;
    },
    enabled: false,
  });

  return {
    scanItemQuery,
    scanItemDetailQuery,
    scanItemFilters: {
      page: scanItemPage,
      setPage: setScanItemPage,
      perPage: scanItemPerPage,
      setPerPage: setScanItemPerPage,
      search: scanItemSearch,
      setSearch: setScanItemSearch,
      scannedBy: scanItemScannedBy,
      setScannedBy: setScanItemScannedBy,
      ScanType: scanItemType,
      setScanType: setScanItemType,
    },
    scanItemDetail: {
      page: scanItemDetailPage,
      setPage: setScanItemDetailPage,
      perPage: scanItemDetailPerPage,
      setPerPage: setScanItemDetailPerPage,
      scannedBy: scanItemDetailScannedBy,
      setScannedBy: setScanItemDetailScannedBy,
      search: scanItemDetailSearch,
      setSearch: setScanItemDetailSearch,
      brand: scanItemDetailBrand,
      setBrand: setScanItemDetailBrand,
      sort: scanItemDetailSort,
      setSort: setScanItemDetailSort,
    },
    download: {
      downloadScanItemsQuery,
    },
  };
};

export default useScanItems;
