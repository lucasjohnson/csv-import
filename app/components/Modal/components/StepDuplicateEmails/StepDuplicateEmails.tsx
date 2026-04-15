"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { Field, RowState } from "../../../../lib/validate/types";
import { getFieldErrorMessage } from "../../../../lib/schema";
import { TABLE_FIELDS, TABLE_HEADERS } from "../../Modal.constants";
import * as styles from "../tableStyles";
import { EditableCell } from "../EditableCell/EditableCell";

interface Props {
  rows: RowState[];
  visibleIds: Set<number>;
  onUpdate: (rowId: number, field: Field, value: string) => void;
  onDeleteRows: (ids: number[]) => void;
  hasIssues: boolean;
  failMessage: string;
}

export const StepDuplicateEmails = ({
  rows,
  visibleIds,
  onUpdate,
  onDeleteRows,
  hasIssues,
  failMessage,
}: Props) => {
  const visibleRows = rows.filter((row) => visibleIds.has(row.id));
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);

  const allChecked =
    visibleRows.length > 0 && visibleRows.every((row) => checked.has(row.id));
  const someChecked =
    !allChecked && visibleRows.some((row) => checked.has(row.id));

  const handleToggleAll = () => {
    if (allChecked) {
      setChecked(new Set());
    } else {
      setChecked(new Set(visibleRows.map((row) => row.id)));
    }
  };

  const handleToggle = (id: number) => {
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirmDelete = () => {
    onDeleteRows([...checked]);
    setChecked(new Set());
    setConfirmOpen(false);
  };

  return (
    <Box>
      <Box sx={styles.toolbar}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {hasIssues ? (
            <CancelIcon sx={{ color: "error.main" }} />
          ) : (
            <CheckCircleIcon sx={{ color: "success.main" }} />
          )}
          <Typography
            variant="body1"
            sx={{ color: hasIssues ? "error.main" : "success.main" }}
          >
            {hasIssues ? failMessage : "All duplicates have been resolved"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          size="small"
          disabled={checked.size === 0}
          onClick={() => setConfirmOpen(true)}
        >
          Delete Selected ({checked.size})
        </Button>
      </Box>
      <Box sx={styles.tableContainer}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={styles.headerCell}>
                <Checkbox
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={handleToggleAll}
                  size="small"
                />
              </TableCell>
              {TABLE_HEADERS.map((header) => (
                <TableCell key={header} sx={styles.headerCell}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={checked.has(row.id)}
                    onChange={() => handleToggle(row.id)}
                    size="small"
                  />
                </TableCell>
                {TABLE_FIELDS.map((field) => (
                  <TableCell key={field}>
                    <EditableCell
                      value={row.current[field]}
                      originalValue={row.original[field]}
                      hasError={field === "email" && !!row.errors.email}
                      isFixed={field === "email" && !row.errors.email}
                      editable={field === "email"}
                      errorMessage={
                        field === "email" && row.errors.email
                          ? getFieldErrorMessage("email", row.errors.email)
                          : undefined
                      }
                      onSave={(value) => onUpdate(row.id, field, value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete rows</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete {checked.size} rows? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
