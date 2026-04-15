"use client";

import { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { RowState } from "../../lib/validate/types";
import { formatNetWorth } from "../../lib/formatters/formatNetWorth";
import { sortByNetWorth } from "../../lib/sort/sortByNetWorth";
import { cycleSortDirection } from "../../lib/sort/cycleSortDirection";
import type { SortDirection } from "../../lib/sort/types";
import * as styles from "./DataTable.styles";

interface Props {
  rows: RowState[];
}

export const DataTable = ({ rows }: Props) => {
  const [search, setSearch] = useState("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSortToggle = () => {
    setSortDirection(cycleSortDirection);
  };

  const filteredAndSorted = useMemo(() => {
    let result = rows;

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((row) =>
        row.current.name.toLowerCase().includes(query),
      );
    }

    result = sortByNetWorth(result, sortDirection);

    return result;
  }, [rows, search, sortDirection]);

  if (rows.length === 0) return null;

  return (
    <Box sx={styles.root}>
      <Box sx={styles.toolbar}>
        <TextField
          placeholder="Search by name..."
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={styles.searchField}
        />
        <Typography variant="subtitle1" color="textSecondary">
          Total imported records {rows.length}
        </Typography>
      </Box>
      <TableContainer sx={styles.tableContainer}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.headerCell}>Name</TableCell>
              <TableCell sx={styles.headerCell}>Email</TableCell>
              <TableCell sx={styles.headerCell}>Phone</TableCell>
              <TableCell sx={styles.netWorthHeaderCell}>
                <Box sx={styles.netWorthHeader}>
                  Net Worth
                  <IconButton
                    size="small"
                    onClick={handleSortToggle}
                    sx={styles.sortButton}
                  >
                    {sortDirection === "asc" ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon
                        fontSize="small"
                        sx={styles.sortIconInactive(sortDirection === "desc")}
                      />
                    )}
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSorted.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.current.name}</TableCell>
                <TableCell>{row.current.email}</TableCell>
                <TableCell>{row.current.phone}</TableCell>
                <TableCell sx={styles.netWorthCell}>
                  {formatNetWorth(row.current.netWorth)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
