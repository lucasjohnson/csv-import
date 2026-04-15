"use client";

import { useState } from "react";
import { Alert, Box, IconButton, Snackbar, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Modal } from "./components/Modal/Modal";
import { DataTable } from "./components/DataTable/DataTable";
import type { RowState } from "./lib/validate/types";
import * as styles from "./styles";
export const LandingPage = () => {
  const [rows, setRows] = useState<RowState[]>([]);
  const [importCount, setImportCount] = useState<number | null>(null);

  const handleImport = (imported: RowState[]) => {
    setRows((previous) => {
      let maxId = -1;
      for (const row of previous) {
        if (row.id > maxId) maxId = row.id;
      }
      const nextId = maxId + 1;
      const remapped = imported.map((row, index) => ({
        ...row,
        id: nextId + index,
      }));
      return [...previous, ...remapped];
    });

    setImportCount(imported.length);
  };

  return (
    <Box sx={styles.pageRoot}>
      <Box sx={styles.pageHeader} component="header">
        <Box sx={styles.titleWrapper}>
          <Typography variant="h4" component="h1">
            CSV Import
          </Typography>
          <IconButton
            component="a"
            href="https://github.com/lucasjohnson/csv-import"
            target="_blank"
            rel="noopener noreferrer"
            title="https://github.com/lucasjohnson/csv-import"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
        <Modal
          existingRows={rows}
          onImport={handleImport}
          onOpen={() => setImportCount(null)}
        />
      </Box>
      <Box component="main" sx={styles.pageMain}>
        <DataTable rows={rows} />
      </Box>
      <Snackbar
        open={importCount !== null}
        autoHideDuration={5000}
        onClose={() => setImportCount(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setImportCount(null)}>
          {importCount} records successfully imported
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandingPage;
