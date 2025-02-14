export const checkIfFilesAreTooBig = (
  files: File[],
  maxSize: number,
): boolean => {
  let valid = true;
  if (files) {
    files.map((file: File) => {
      const size = file.size / 1024 / 1024;
      if (size > maxSize) {
        valid = false;
      }
    });
  }
  return valid;
};
