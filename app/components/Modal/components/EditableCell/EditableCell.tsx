"use client";

import { useState, useRef, useEffect } from "react";
import { Box, IconButton, InputBase, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as styles from "./EditableCell.styles";

interface Props {
  value: string;
  originalValue?: string;
  hasError: boolean;
  isFixed: boolean;
  editable: boolean;
  errorMessage?: string;
  onSave: (value: string) => void;
}

export const EditableCell = ({
  value,
  originalValue,
  hasError,
  isFixed,
  editable,
  errorMessage,
  onSave,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const valueAtEditStart = useRef(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setDraft(newValue);
    onSave(newValue);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraft(valueAtEditStart.current);
    onSave(valueAtEditStart.current);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      inputRef.current?.blur();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  };

  const handleFocus = () => {
    if (canEdit) {
      valueAtEditStart.current = value;
      setDraft(value);
      setEditing(true);
    }
  };

  const canEdit = editable && (hasError || isFixed);
  const dotColor = hasError ? "error.main" : "success.main";
  const isModified = originalValue !== undefined && value !== originalValue;

  const handleRevert = () => {
    if (originalValue !== undefined) {
      setDraft(originalValue);
      onSave(originalValue);
    }
  };

  if (!canEdit) {
    return (
      <Typography variant="body2" sx={styles.nonEditableText}>
        {value}
      </Typography>
    );
  }

  return (
    <Box sx={styles.container}>
      <InputBase
        inputRef={inputRef}
        value={editing ? draft : value}
        onChange={editing ? handleChange : undefined}
        onBlur={editing ? handleBlur : undefined}
        onKeyDown={editing ? handleKeyDown : undefined}
        onFocus={handleFocus}
        readOnly={!editing}
        size="small"
        sx={styles.input(canEdit, isFixed, hasError)}
      />
      {isModified && editing && (
        <Tooltip title="Revert to original" placement="top">
          <IconButton
            size="small"
            tabIndex={-1}
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleRevert}
            sx={styles.revertButton}
          >
            <CloseIcon sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>
      )}
      {canEdit && hasError && errorMessage ? (
        <Tooltip title={errorMessage} placement="top" open={editing}>
          <Box sx={styles.statusDot(dotColor)} />
        </Tooltip>
      ) : (
        canEdit && <Box sx={styles.statusDot(dotColor)} />
      )}
    </Box>
  );
};
