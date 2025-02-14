import { Badge } from "@/components/ui/badge";
import { ICheckFinalizeResponse } from "@/features/audit/types/data/FinalizeParamsTypes";
import dayjs from "dayjs";

interface TooltipFinalizedProps {
  data: ICheckFinalizeResponse[];
}

const TooltipFinalized = ({ data }: TooltipFinalizedProps) => {
  return (
    <div className="p-1 space-y-1 rounded-md overflow-y-auto max-h-52">
      {data.map((record, index) => (
        <div
          key={index}
          className="px-2 py-1 border-b border-gray-300 last:border-none space-y-1"
        >
          <div className="text-base font-semibold ">{record.user.name}</div>
          <div className="text-sm text-gray-600">
            <span className="font-medium ">Finalized at:</span>{" "}
            {dayjs(record.finalized_at).format("DD MMM YYYY HH:mm A")}
          </div>
          <div className="text-sm text-gray-600 flex gap-2">
            <span className="font-medium ">Brands:</span>{" "}
            <div className="flex flex-wrap">
              {record.brand_codes.map((brand: string, idx: number) => (
                <Badge
                  key={idx}
                  variant={"secondary"}
                  className="font-normal rounded-sm"
                >
                  {brand.toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TooltipFinalized;
