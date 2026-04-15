import type { SxProps, Theme } from "@mui/material";

export const stepper: SxProps<Theme> = {
  mb: 2,
};

export const fileError: SxProps<Theme> = {
  mt: 2,
};

export const statusRow: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  py: 2,
};

export const errorColor: SxProps<Theme> = {
  color: "error.main",
};

export const successColor: SxProps<Theme> = {
  color: "success.main",
};

export const dialogContent: SxProps<Theme> = {
  display: "grid",
  gap: "20px",
};

export const loadingContainer: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  py: 6,
};

export const actions: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 2,
  mt: 3,
};
