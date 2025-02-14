import { Separator } from "@/components/ui/separator";
import useSummary from "@/hooks/query/stock-opname/useSummary";
import { formatNumberSeparator } from "@/utils/string-helpers";
import dayjs from "dayjs";
import { useEffect } from "react";

interface PreviewSummaryModalProps {
  summaryHook: ReturnType<typeof useSummary>;
  pic: string;
  so: string;
}

const PreviewSummaryContent = ({
  summaryHook,
  pic,
  so,
}: PreviewSummaryModalProps) => {
  const {
    summaryReportPreviewQuery: { data: previewData },
  } = summaryHook;

  useEffect(() => {
    summaryHook.reportPreview.setLoadPreviewReport(true);
    return () => {
      summaryHook.reportPreview.setLoadPreviewReport(false);
    };
  }, []);

  return (
    <div className="overflow-auto">
      <div className="text-center space-y-2 text-sm">
        <p className="font-light">{`PT. PLANET SELANCAR MANDIRI`}</p>
        <p>{`PLANET SURF`}</p>
        <p className="font-light text-xs">
          {` Jl. Mertasari No. 7 Kerobokan, Kuta – Bali 80361`}
          <br />
          {` Phone : (62-0361) 738888 (Hunting) Fax : (62-0361) 731888`}
        </p>
        <p className="text-sm">
          {`BERITA ACARA PERHITUNGAN FISIK`}
          <br /> {`STOCK OPNAME`}
        </p>
      </div>
      <div className="p-4">
        <Separator className="" />
      </div>
      <div className="text-sm px-4 text-muted-foreground">
        <p>Berdasarkan hasil stock opname yang sudah dilaksanakan pada:</p>
        <table className="no-border">
          <tr className="no-border">
            <td className="no-border">TEMPAT</td>
            <td className="no-border text-foreground">
              : {`${previewData?.schedule.store_code}`}
            </td>
          </tr>
          <tr className="no-border">
            <td className="no-border">TANGGAL</td>
            <td className="no-border text-foreground">
              :{" "}
              {`${dayjs(previewData?.schedule.start_date).format(
                "DD MMMM YYYY",
              )} - ${dayjs(previewData?.schedule.end_date).format(
                "DD MMMM YYYY",
              )}`}
            </td>
          </tr>
        </table>

        <p>
          Dari pelaksanaan Stock Opname tersebut diperoleh hasil sebagai
          berikut:
        </p>
      </div>
      <div className="p-4">
        <table className="w-full text-xs border border-gray-300 ">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="border border-gray-300 px-4 py-2 text-center align-middle"
              >
                BRAND
              </th>
              <th className="border border-gray-300 px-4 py-2">FREEZE</th>
              <th className="border border-gray-300 px-4 py-2">SCAN FISIK</th>
              <th className="border border-gray-300 px-4 py-2">SELISIH</th>
            </tr>
            <tr>
              <th className="border border-gray-300 px-4 py-2">QTY</th>
              <th className="border border-gray-300 px-4 py-2">QTY</th>
              <th className="border border-gray-300 px-4 py-2">QTY</th>
            </tr>
          </thead>

          <tbody>
            {previewData?.data.map((item) => (
              <tr key={crypto.randomUUID()}>
                <td className="border-b border-gray-300 p-2">
                  {item.brand_code}
                </td>
                <td className="border-b border-gray-300 p-2 text-right">
                  {formatNumberSeparator(item.freeze_qty)}
                </td>
                <td className="border-b border-gray-300 p-2 text-right">
                  {formatNumberSeparator(item.scan_qty)}
                </td>
                <td className="border-b border-gray-300 p-2 text-right">
                  {formatNumberSeparator(item.difference)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="border-b border-gray-300 p-2 font-bold">
                Grand Total
              </td>
              <td className="border-b border-gray-300 p-2 text-right font-bold">
                {formatNumberSeparator(previewData?.totals.freeze_qty ?? 0)}
              </td>
              <td className="border-b border-gray-300 p-2 text-right font-bold">
                {formatNumberSeparator(previewData?.totals.scan_qty ?? 0)}
              </td>
              <td className="border-b border-gray-300 p-2 text-right font-bold">
                {formatNumberSeparator(previewData?.totals.difference ?? 0)}
              </td>
            </tr>
          </tfoot>
        </table>
        <p className="text-sm mt-4 text-muted-foreground">
          Dengan ini kami sepakati hasil perhitungan fisik sudah sesuai dengan
          fisik yang ada di toko, yang dilakukan oleh team SO dengan disaksikan
          oleh team toko.
          <br />
          Demikian berita acara ini kami buat dengan sebenarnya, sesuai hasil
          stock opname terlampir.
        </p>

        <p className="py-4 text-sm">{`${previewData?.schedule.store_city ?? "-"}, ${dayjs().format(
          "DD MMMM YYYY",
        )}`}</p>
        <table className="table-fixed no-border w-full mt-10 text-sm">
          <tr className="no-border">
            <td className="w-1/2 no-border text-center text-muted-foreground">
              Team SO <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              {so && so.trim() ? (
                <span className="underline text-primary">{so}</span>
              ) : (
                "_______________"
              )}
            </td>
            <td className="w-1/2 no-border text-center text-muted-foreground">
              PIC / SH / SSH / AM <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              {pic && pic.trim() ? (
                <span className="underline text-primary">{pic}</span>
              ) : (
                "_______________"
              )}
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
};

export default PreviewSummaryContent;
