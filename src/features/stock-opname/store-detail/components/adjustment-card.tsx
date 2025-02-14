import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import api from "@/services/interceptor/Interceptor";
import { Adjustment } from "@/types/data";
import { AdjustmentType } from "@/utils/enumeration";
import { formatEnumSnakeCase } from "@/utils/string-helpers";
import { SquarePen } from "lucide-react";
interface AdjustmentCardProps {
  data: Adjustment;
  onClick: () => void;
  status: string;
}

const AdjustmentCard = ({ data, onClick, status }: AdjustmentCardProps) => {
  return (
    <Card className="bg-red p-4 flex flex-col items-center rounded-sm gap-4">
      <div className="flex gap-2 items-center justify-between w-full ">
        <div className="flex items-center gap-2">
          {status === AdjustmentType.Plus ? "Barang Plus" : "Barang Minus"}
          <Badge variant="outline">{`${data.qty} pcs`}</Badge>
        </div>

        <Button variant={"outline"} onClick={onClick}>
          <SquarePen /> Edit Adjustment
        </Button>
      </div>
      {data.user && <Separator />}
      {data.user && (
        <div className="flex gap-4 w-full">
          <img
            src={
              data.item_photo
                ? api.defaults.baseURL + "/images/" + data.item_photo
                : ""
            }
            className="size-32 min-w-32 rounded-lg bg-gray-50 border-none"
            loading="lazy"
            alt="Item image"
          />

          <div className="space-y-4 text-sm w-full">
            <div className="flex w-full flex-wrap ">
              <div className="space-y-1 flex-1">
                <p className="text-muted-foreground text-sm">{"Reason"}</p>
                <p className="font-normal">
                  {data.reason ? formatEnumSnakeCase(data.reason) : "-"}
                </p>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-muted-foreground text-sm">{"Reporter"}</p>
                <p>{data.user.name ?? "-"}</p>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-muted-foreground text-sm">{"Item Pcs"}</p>
                <p>{data.qty ?? "-"}</p>
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <p className="text-muted-foreground text-sm">{"Description"}</p>
              <p>{data.description ?? "-"}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
export default AdjustmentCard;
