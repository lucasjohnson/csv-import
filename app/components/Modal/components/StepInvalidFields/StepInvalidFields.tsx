"use client";

import { useMemo } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { Field, RowState } from "../../../../lib/validate/types";
import { getFieldErrorMessage } from "../../../../lib/schema";
import { TABLE_FIELDS, TABLE_HEADERS } from "../../Modal.constants";
import * as styles from "../tableStyles";
import { EditableCell } from "../EditableCell/EditableCell";

interface Props {
  rows: RowState[];
  visibleIds: Set<number>;
  onUpdate: (rowId: number, field: Field, value: string) => void;
}

export const StepInvalidFields = ({ rows, visibleIds, onUpdate }: Props) => {
  const visibleRows = rows.filter((row) => visibleIds.has(row.id));

  const initialEditable = useMemo(() => {
    const map = new Map<number, Set<Field>>();
    for (const row of rows) {
      if (!visibleIds.has(row.id)) continue;
      const fields = new Set<Field>();
      for (const field of TABLE_FIELDS) {
        if (row.errors[field] === "invalid") fields.add(field);
      }
      if (fields.size > 0) map.set(row.id, fields);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleIds]);

  return (
    <Box sx={styles.tableContainer}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
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
              {TABLE_FIELDS.map((field) => {
                const isErrorField =
                  initialEditable.get(row.id)?.has(field);
                const currentlyBroken = !!row.errors[field] && !!isErrorField;
                const wasFixed = !!isErrorField && !row.errors[field];

                return (
                  <TableCell key={field}>
                    <EditableCell
                      value={row.current[field]}
                      originalValue={row.original[field]}
                      hasError={currentlyBroken}
                      isFixed={wasFixed}
                      editable={!!isErrorField}
                      errorMessage={
                        currentlyBroken && row.errors[field]
                          ? getFieldErrorMessage(field, row.errors[field])
                          : undefined
                      }
                      onSave={(value) => onUpdate(row.id, field, value)}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};
