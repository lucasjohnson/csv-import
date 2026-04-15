import type { SxProps, Theme } from "@mui/material";

export const tableContainer: SxProps<Theme> = {
  overflowY: "auto",
  maxHeight: 400,
};

export const headerCell: SxProps<Theme> = {
  fontWeight: 700,
};

export const toolbar: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 1,
  pl: "10px",
};
