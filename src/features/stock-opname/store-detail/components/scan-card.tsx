import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/services/interceptor/Interceptor";
import { IScanData } from "@/types/data";

type ScanCardProps = {
  data: IScanData;
  onClick: () => void;
};
const ScanCard = ({ data, onClick }: ScanCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="flex-1 w-full p-4 text-sm cursor-pointer hover:bg-gray-50 h-fit"
    >
      <CardContent className="flex flex-row p-0 gap-4">
        <img
          width={100}
          height={100}
          src={
            data.background_image
              ? api.defaults.baseURL + "/images/" + data.background_image
              : "/empty-placeholder.jpg"
          }
          alt=""
          className="bg-gray-200 rounded-md max-h-[100px] max-w-[100px]"
        />
        <div className="flex flex-col justify-between">
          <div className="flex gap-2 items-center ">
            <Badge variant={"secondary"} className="text-xs font-normal">
              {"AZ"}
            </Badge>
            <p className="text-muted-foreground text-xs">{data.user.name}</p>
          </div>
          <div>
            <p className="text-2xl">{data.total_qty}</p>
            <p className="text-muted-foreground">{data.name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScanCard;
