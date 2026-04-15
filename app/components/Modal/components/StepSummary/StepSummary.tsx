"use client";

import { Box, Typography } from "@mui/material";
import type { RowState } from "../../../../lib/validate/types";
import * as styles from "./StepSummary.styles";

interface Props {
  rows: RowState[];
}

export const StepSummary = ({ rows }: Props) => (
  <Box sx={styles.container}>
    <Typography variant="h5">{rows.length} records ready to import</Typography>
  </Box>
);
