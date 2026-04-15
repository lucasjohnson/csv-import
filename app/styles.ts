import type { SxProps, Theme } from "@mui/material";

export const layoutRoot: SxProps<Theme> = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
};

export const titleWrapper: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const pageRoot: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
};

export const pageHeader: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
  mt: 4,
  mb: 3,
};

export const pageMain: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  pb: "200px",
};
