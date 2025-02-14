import { useEffect, useMemo, useRef, useState } from "react";
import SheetComponent from "@/components/sheet/Sheet";
import DetailItem from "@/features/audit/components/sheet-content/DetailItem";
import Table from "@/features/audit/components/table/Table";
import Toolbar from "@/features/audit/components/toolbar/Toolbar";
import { useElementRefs } from "@/stores/ui/userRefsStore";
import useWindowSize from "@/hooks/utils/useWindowSize";
import toast from "react-hot-toast";
import { useReviewMutation } from "@/hooks/mutation/useReviewMutation";
import { useReviewStoreMutation } from "@/features/audit/stores/data/userReviewStore";
import { cn } from "@/lib/utils";

const Store = () => {
  const { refs } = useElementRefs();
  const { width } = useWindowSize();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const { mutate, isPending, isError } = useReviewMutation();
  const { reviewStoreMutation } = useReviewStoreMutation();
  const toastRef = useRef<string | undefined>(undefined);

  const showLoading = () => (toastRef.current = toast.loading("Loading..."));

  const containerHeightMemo = useMemo(() => {
    const headerHeight = refs?.header?.current?.offsetHeight || 0;
    const toolbarHeight = refs?.toolbar?.current?.offsetHeight || 0;
    return headerHeight + toolbarHeight;
  }, [
    refs?.header?.current?.offsetHeight,
    refs?.toolbar?.current?.offsetHeight,
  ]);

  useEffect(() => {
    setContainerHeight(containerHeightMemo);
  }, [containerHeightMemo]);

  const dynamicHeight = useMemo(() => {
    return width < 640 ? `90vh` : `calc(100vh - ${containerHeight}px - 4.5rem)`;
  }, [width, containerHeight]);

  useEffect(() => {
    reviewStoreMutation && mutate(reviewStoreMutation);
  }, [reviewStoreMutation]);

  useEffect(() => {
    isPending && showLoading();
    isError && toast.dismiss(toastRef.current);
  }, [isPending, isError]);

  return (
    <div className="flex flex-col h-full gap-4 max-sm:px-6 p-8 pt-6 ">
      <Toolbar />
      <div
        style={{
          height: dynamicHeight,
          maxHeight: dynamicHeight,
        }}
        className={cn(
          "flex flex-col flex-1 overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent",
        )}
      >
        <Table />
      </div>
      <SheetComponent>
        <DetailItem />
      </SheetComponent>
    </div>
  );
};

export default Store;
