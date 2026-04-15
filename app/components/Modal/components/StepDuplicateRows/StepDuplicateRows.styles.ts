import type { SxProps, Theme } from "@mui/material";

export { tableContainer, headerCell } from "../tableStyles";

export const toolbar: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1,
};

export const duplicateRow = (isDuplicate: boolean): SxProps<Theme> => ({
  bgcolor: isDuplicate ? "action.hover" : "inherit",
});
