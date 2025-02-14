export const getDb = (value: string): { db1: string; db2: string } => {
  const [first, second] = value.split("&");
  return {
    db1: first,
    db2: second,
  };
};

export const formatNumberSeparator = (
  value: number | null | undefined,
  locale: string = "en-US",
): string => {
  if (value == null) {
    return "";
  }
  return new Intl.NumberFormat(locale).format(value);
};

export const getInitials = (name: string) => {
  const trimmedName = name?.trim();
  if (!trimmedName) return "";
  const words = trimmedName.split(" ");
  if (words.length === 0) return "";
  if (words.length >= 3) {
    const firstInitial = words[0]?.[0] || "";
    const lastInitial = words[words.length - 1]?.[0] || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  const firstInitial = words[0]?.[0] || "";
  const secondInitial = words[1]?.[0] || "";
  return `${firstInitial}${secondInitial}`.toUpperCase();
};

export const limitCharacters = (text: string, limit: number) => {
  if (text.length <= limit) {
    return text;
  }
  return text.slice(0, limit).trim() + "...";
};

export const isExcelFormat = (fileName: string) => {
  const excelExtensions = /\.(xls|xlsx)$/i;
  return excelExtensions.test(fileName);
};

export const formatEnumSnakeCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
