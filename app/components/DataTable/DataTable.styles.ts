import type { SxProps, Theme } from "@mui/material";

export const root: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
};

export const toolbar: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 2,
};

export const tableContainer: SxProps<Theme> = {
  flex: 1,
  overflow: "auto",
};

export const searchField: SxProps<Theme> = {
  mb: 2,
  width: 300,
};

export const headerCell: SxProps<Theme> = {
  fontWeight: 700,
};

export const netWorthCell: SxProps<Theme> = {
  textAlign: "right",
};

export const netWorthHeaderCell: SxProps<Theme> = {
  fontWeight: 700,
  textAlign: "right",
};

export const netWorthHeader: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

export const sortButton: SxProps<Theme> = {
  ml: 0.5,
};

export const sortIconInactive = (isDesc: boolean): SxProps<Theme> => ({
  opacity: isDesc ? 1 : 0.3,
});
