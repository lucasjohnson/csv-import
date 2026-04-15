export const validateFile = (file: File): string | null => {
  if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
    return `"${file.name}" is not a CSV file.`;
  }
  return null;
};
