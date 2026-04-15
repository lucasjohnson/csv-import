import type { SxProps, Theme } from "@mui/material";

export const nonEditableText: SxProps<Theme> = {
  opacity: 0.4,
  minHeight: 24,
  display: "flex",
  alignItems: "center",
};

export const container: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  minHeight: 24,
  cursor: "pointer",
};

export const input = (
  showDot: boolean,
  isFixed: boolean,
  hasError: boolean,
): SxProps<Theme> => ({
  fontSize: "0.8125rem",
  lineHeight: 1.43,
  py: 0,
  px: 0,
  "& .MuiInputBase-input": {
    p: 0,
    pr: showDot ? "20px" : 0,
    color: isFixed && !hasError ? "success.main" : "text.primary",
    cursor: "inherit",
  },
});

export const revertButton: SxProps<Theme> = {
  position: "absolute",
  right: 20,
  top: "50%",
  transform: "translateY(-50%)",
  p: 0,
  minWidth: 0,
  color: "text.secondary",
  "&:hover": { color: "error.main" },
};

export const statusDot = (dotColor: string): SxProps<Theme> => ({
  position: "absolute",
  right: 0,
  top: "50%",
  transform: "translateY(-50%)",
  width: 10,
  height: 10,
  borderRadius: "50%",
  bgcolor: dotColor,
});
