"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
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
import { findDuplicateGroups } from "../../../../lib/validate/findDuplicateGroups";
import type { RowState } from "../../../../lib/validate/types";
import * as styles from "./StepDuplicateRows.styles";

interface Props {
  rows: RowState[];
  existingRows: RowState[];
  onDeleteRows: (ids: number[]) => void;
  failMessage: string;
}

const HEADERS = ["", "Name", "Email", "Phone", "Net Worth"];

export const StepDuplicateRows = ({
  rows,
  existingRows,
  onDeleteRows,
  failMessage,
}: Props) => {
  const groups = useMemo(
    () => findDuplicateGroups(rows, existingRows),
    [rows, existingRows],
  );

  const [initialIds] = useState(
    () =>
      new Set(
        [...groups.values()]
          .flat()
          .filter((entry) => !entry.isExisting)
          .map((entry) => entry.row.id),
      ),
  );

  const visibleRows = useMemo(() => {
    const csvRows = rows.filter((row) => initialIds.has(row.id));
    const existingInGroups = [
      ...new Map(
        [...groups.values()]
          .flat()
          .filter((entry) => entry.isExisting)
          .map((entry) => [entry.row.id, entry.row] as const),
      ).values(),
    ];
    return { csvRows, existingInGroups };
  }, [rows, initialIds, groups]);

  const preCheckedIds = useMemo(() => {
    const ids = new Set<number>();
    for (const group of groups.values()) {
      const csvEntries = group.filter((entry) => !entry.isExisting);
      const hasExisting = group.some((entry) => entry.isExisting);
      if (hasExisting) {
        for (const entry of csvEntries) {
          ids.add(entry.row.id);
        }
      } else {
        for (let index = 1; index < csvEntries.length; index++) {
          ids.add(csvEntries[index].row.id);
        }
      }
    }
    return ids;
  }, [groups]);

  const [checked, setChecked] = useState<Set<number>>(preCheckedIds);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const duplicateIds = useMemo(() => {
    const ids = new Set<number>();
    for (const group of groups.values()) {
      for (const entry of group) {
        if (!entry.isExisting) ids.add(entry.row.id);
      }
    }
    return ids;
  }, [groups]);

  const allVisible = useMemo(() => {
    const entries: { row: RowState; isExisting: boolean }[] =
      visibleRows.existingInGroups.map((row) => ({ row, isExisting: true }));
    for (const row of visibleRows.csvRows) {
      entries.push({ row, isExisting: false });
    }
    return entries;
  }, [visibleRows]);

  return (
    <Box>
      <Box sx={styles.toolbar}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {groups.size > 0 ? (
            <CancelIcon sx={{ color: "error.main" }} />
          ) : (
            <CheckCircleIcon sx={{ color: "success.main" }} />
          )}
          <Typography
            variant="body1"
            sx={{ color: groups.size > 0 ? "error.main" : "success.main" }}
          >
            {groups.size > 0 ? failMessage : "You have no duplicate records"}
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
              {HEADERS.map((header, index) => (
                <TableCell key={index} sx={styles.headerCell}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allVisible.map(({ row, isExisting }) => {
              const isDuplicate = !isExisting && duplicateIds.has(row.id);
              return (
                <TableRow
                  key={`${isExisting ? "existing" : "csv"}-${row.id}`}
                  sx={styles.duplicateRow(isDuplicate || isExisting)}
                >
                  <TableCell padding="checkbox">
                    {isExisting ? (
                      <Chip label="Existing" size="small" variant="outlined" />
                    ) : (
                      <Checkbox
                        checked={checked.has(row.id)}
                        onChange={() => handleToggle(row.id)}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{row.current.name}</TableCell>
                  <TableCell>{row.current.email}</TableCell>
                  <TableCell>{row.current.phone}</TableCell>
                  <TableCell>{row.current.netWorth}</TableCell>
                </TableRow>
              );
            })}
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
