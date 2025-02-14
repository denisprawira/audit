export const downloadFile = (
  data: ArrayBuffer | string,
  filename: string,
  type: string,
) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const downloadStringToCSV = (csvData: string, filename = "data.csv") => {
  downloadFile(csvData, filename, "text/csv");
};

export const downloadPDF = (
  responseData: ArrayBuffer,
  fileName = "document.pdf",
  openNewWindow = false,
) => {
  const blob = new Blob([responseData], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  if (openNewWindow) {
    window.open(url);
  } else {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
