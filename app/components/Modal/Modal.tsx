"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import type { RowState } from "../../lib/validate/types";
import { InfoAlert } from "../InfoAlert/InfoAlert";
import { StepDuplicateRows } from "./components/StepDuplicateRows/StepDuplicateRows";
import { StepDuplicateEmails } from "./components/StepDuplicateEmails/StepDuplicateEmails";
import { StepInvalidFields } from "./components/StepInvalidFields/StepInvalidFields";
import { StepSummary } from "./components/StepSummary/StepSummary";
import { useImportWizard } from "./hooks/useImportWizard";
import * as styles from "./Modal.styles";

interface Props {
  existingRows: RowState[];
  onImport: (rows: RowState[]) => void;
  onOpen?: () => void;
}

const STEP_LABELS = [
  "Duplicate Rows",
  "Email Duplicates",
  "Formatting",
  "Summary",
];

export const Modal = ({ existingRows, onImport, onOpen }: Props) => {
  const {
    open,
    fileError,
    loading,
    rows,
    activeStep,
    completedSteps,
    checkStatus,
    stepVisibleIds,
    inputRef,
    isWizard,
    hasIssues,
    hasExistingDuplicates,
    failMessage,
    canAdvance,
    handleInputChange,
    handleClose,
    handleUpdate,
    handleDeleteRows,
    handleNext,
    handleImport,
    handleOpen,
  } = useImportWizard({ existingRows, onImport, onOpen });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={handleInputChange}
      />
      <Box sx={styles.statusRow}>
        <Button variant="outlined" href="/test-data.csv" download>
          Download Test CSV
        </Button>
        <Button variant="contained" onClick={handleOpen}>
          Import CSV
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>Import CSV</DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          {isWizard && (
            <Stepper activeStep={activeStep} sx={styles.stepper}>
              {STEP_LABELS.map((label, index) => (
                <Step key={label} completed={completedSteps.has(index)}>
                  <StepLabel
                    icon={
                      completedSteps.has(index) ? (
                        <CheckCircleIcon sx={styles.successColor} />
                      ) : undefined
                    }
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {loading && (
            <Box sx={styles.loadingContainer}>
              <CircularProgress />
              <Typography variant="body1" color="text.secondary">
                Processing CSV...
              </Typography>
            </Box>
          )}

          {fileError && (
            <Alert severity="error" sx={styles.fileError}>
              {fileError}
            </Alert>
          )}

          {isWizard &&
            activeStep === 2 &&
            checkStatus === "fail" &&
            hasIssues && (
              <Box sx={styles.statusRow}>
                <CancelIcon sx={styles.errorColor} />
                <Typography variant="body1" sx={styles.errorColor}>
                  {failMessage}
                </Typography>
              </Box>
            )}

          {isWizard &&
            activeStep === 2 &&
            checkStatus === "fail" &&
            !hasIssues && (
              <Box sx={styles.statusRow}>
                <CheckCircleIcon sx={styles.successColor} />
                <Typography variant="body1" sx={styles.successColor}>
                  All validation errors have been resolved
                </Typography>
              </Box>
            )}

          {activeStep === 0 && checkStatus === "fail" && (
            <StepDuplicateRows
              rows={rows}
              existingRows={existingRows}
              onDeleteRows={handleDeleteRows}
              failMessage={failMessage}
            />
          )}

          {activeStep === 1 && checkStatus === "fail" && (
            <StepDuplicateEmails
              rows={rows}
              visibleIds={stepVisibleIds}
              onUpdate={handleUpdate}
              onDeleteRows={handleDeleteRows}
              hasIssues={hasIssues}
              failMessage={failMessage}
            />
          )}

          {activeStep === 2 && checkStatus === "fail" && (
            <StepInvalidFields
              rows={rows}
              visibleIds={stepVisibleIds}
              onUpdate={handleUpdate}
            />
          )}

          {activeStep === 3 && <StepSummary rows={rows} />}

          <Box sx={styles.actions}>
            {isWizard && activeStep === 0 && checkStatus === "fail" && (
              <InfoAlert
                text={
                  hasExistingDuplicates
                    ? "Duplicate records found. Please delete them all."
                    : "Duplicate records found. You can import one, or delete them all."
                }
              />
            )}
            {isWizard && activeStep === 1 && checkStatus === "fail" && (
              <InfoAlert text="Emails must be unique. Please delete or update them." />
            )}
            {isWizard && activeStep === 2 && checkStatus === "fail" && (
              <InfoAlert text="Formatting errors found in the CSV file. Please correct them. The reason for the error will be shown when you edit a field." />
            )}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                ml: "auto",
              }}
            >
              <Button onClick={handleClose}>Cancel</Button>
              {isWizard && activeStep < 3 && checkStatus === "fail" && (
                <Button
                  variant="contained"
                  disabled={!canAdvance}
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
              {activeStep === 3 && (
                <Button variant="contained" onClick={handleImport}>
                  Import
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
