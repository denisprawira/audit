import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import dayjs from "dayjs";
import { IDocumentFreeze } from "@/types/data";
import useFreezeItems from "@/hooks/query/stock-opname/useFreezeItems";
import { formatNumberSeparator } from "@/utils/string-helpers";
import { Loader2 } from "lucide-react";

type DocumentCardProps = {
  data: IDocumentFreeze;
  setFreezeId: (id: string) => void;
};

type SelectFreezeDataModalProps = {
  freezeHook: ReturnType<typeof useFreezeItems>;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DocumentCard: React.FC<DocumentCardProps> = ({ data, setFreezeId }) => {
  const formattedDay = dayjs(data.freezedate).format("DD");
  const formattedMonth = dayjs(data.freezedate).format("MMM");
  const formattedYear = dayjs(data.freezedate).format("YY");

  return (
    <Card
      onClick={() => {
        setFreezeId(data.id.toString());
      }}
      className="p-2 hover:bg-muted-foreground/5 cursor-pointer flex gap-4 rounded-md px-4 hover:border-l-muted-foreground hover:border-l-4 transition-all"
    >
      <div className="bg-primary min-w-24 min-h-20 max-h-20 max-w-24 flex flex-col justify-center items-center rounded-md p-3">
        <p className="text-4xl text-muted">{formattedDay}</p>
        <p className="w-fit text-muted/90">{`${formattedMonth} / ${formattedYear}`}</p>
      </div>
      <div className="flex flex-col gap-2 justify-center w-full">
        <div className="flex gap-1 text-lg">
          <p className="text-muted-foreground">#Doc</p>
          <p>{data.id}</p>
        </div>
        <p className="text-xl">{data.store?.city ?? "-"}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="font-black text-2xl">
          {formatNumberSeparator(data.total_items)}
        </p>
        <p className="text-muted-foreground">Total</p>
      </div>
    </Card>
  );
};

const SelectFreezeDataModal: React.FC<SelectFreezeDataModalProps> = ({
  freezeHook,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl max-h-full flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-medium">Select Freeze Data</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 max-h-full overflow-auto">
          {freezeHook.listDocumentFreezeQuery.isPending && (
            <div className="flex gap-2 text-lg items-center ">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {"Loading..."}
            </div>
          )}
          {freezeHook.listDocumentFreezeQuery.isError && (
            <p className="text-red-500 text-lg">
              {" "}
              {freezeHook.listDocumentFreezeQuery.error.message}
            </p>
          )}
          {freezeHook.listDocumentFreezeQuery.data?.data.map((data) => (
            <DocumentCard
              key={data.id}
              data={data}
              setFreezeId={freezeHook.setFreezeId}
            />
          ))}
        </div>

        <Button
          disabled={
            freezeHook.pullFreezeDataQuery.isFetching ||
            freezeHook.freezeId === ""
          }
          onClick={() => freezeHook.setIsPullData(true)}
        >
          {freezeHook.pullFreezeDataQuery.isFetching ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {"Loading..."}
            </>
          ) : (
            "Pull Data"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SelectFreezeDataModal;
