import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { normalizeEmail } from "../../../lib/normalizeEmail";
import { validateRows } from "../../../lib/validate/validateRows";
import { revalidateRows } from "../../../lib/validate/revalidateRows";
import type { Field, RowState } from "../../../lib/validate/types";
import { findDuplicateGroups } from "../../../lib/validate/findDuplicateGroups";
import { validateFile } from "../utils/validateFile";
import { getStepIssues } from "../utils/getStepIssues";
import { getFailMessage } from "../utils/getFailMessage";

type CheckStatus = "idle" | "fail";

interface UseImportWizardParams {
  existingRows: RowState[];
  onImport: (rows: RowState[]) => void;
  onOpen?: () => void;
}

export const useImportWizard = ({
  existingRows,
  onImport,
  onOpen,
}: UseImportWizardParams) => {
  const existingEmails = useMemo(
    () =>
      new Set(
        existingRows.map((row) => normalizeEmail(row.current.email)),
      ),
    [existingRows],
  );

  const [open, setOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<RowState[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("idle");
  const [stepVisibleIds, setStepVisibleIds] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  const runStepCheckRef =
    useRef<(step: number, currentRows: RowState[]) => void>(undefined);

  const markCompleted = useCallback((step: number) => {
    setCompletedSteps((previous) => new Set([...previous, step]));
  }, []);

  const advanceToStep = useCallback((step: number) => {
    setActiveStep(step);
    setCheckStatus("idle");
  }, []);

  const runStepCheck = useCallback(
    (step: number, currentRows: RowState[]) => {
      const { count, affectedIds } = getStepIssues(step, currentRows, existingRows);

      setStepVisibleIds(affectedIds);

      if (count === 0) {
        markCompleted(step);
        advanceToStep(step + 1);
        if (step + 1 < 3) {
          runStepCheckRef.current?.(step + 1, currentRows);
        }
      } else {
        setCheckStatus("fail");
      }
    },
    [markCompleted, advanceToStep, existingRows],
  );

  useEffect(() => {
    runStepCheckRef.current = runStepCheck;
  }, [runStepCheck]);

  const parseFile = (incoming: File) => {
    const err = validateFile(incoming);
    if (err) {
      setFileError(err);
      setOpen(true);
      setRows([]);
      return;
    }
    setFileError(null);
    setOpen(true);
    setLoading(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const result = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: true,
      });
      const records = result.data.map((record) => ({
        name: record["Name"] ?? "",
        email: record["Email"] ?? "",
        phone: record["Phone Number"] ?? "",
        netWorth: record["Net Worth"] ?? "",
      })) as Record<Field, string>[];

      const validated = validateRows(records, existingEmails);
      setRows(validated);
      setActiveStep(0);
      setLoading(false);
      runStepCheck(0, validated);
    };
    reader.readAsText(incoming);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) parseFile(selected);
  };

  const handleClose = () => {
    setOpen(false);
    setFileError(null);
    setLoading(false);
    setRows([]);
    setActiveStep(-1);
    setCompletedSteps(new Set());
    setCheckStatus("idle");
    setStepVisibleIds(new Set());
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpdate = (rowId: number, field: Field, value: string) => {
    setRows((previous) => {
      const updated = previous.map((row) =>
        row.id === rowId
          ? { ...row, current: { ...row.current, [field]: value } }
          : row,
      );
      return revalidateRows(updated, existingEmails);
    });
  };

  const handleDeleteRows = (ids: number[]) => {
    const idSet = new Set(ids);
    setRows((previous) =>
      revalidateRows(
        previous.filter((row) => !idSet.has(row.id)),
        existingEmails,
      ),
    );
  };

  const handleNext = () => {
    markCompleted(activeStep);
    const nextStep = activeStep + 1;
    advanceToStep(nextStep);
    if (nextStep < 3) {
      runStepCheck(nextStep, rows);
    }
  };

  const handleImport = () => {
    onImport(rows);
    handleClose();
  };

  const handleOpen = () => {
    onOpen?.();
    inputRef.current?.click();
  };

  const isWizard = activeStep >= 0;

  const duplicateGroups = useMemo(
    () => (activeStep === 0 ? findDuplicateGroups(rows, existingRows) : null),
    [activeStep, rows, existingRows],
  );

  const stepIssues = useMemo(
    () => getStepIssues(activeStep, rows, existingRows, duplicateGroups),
    [activeStep, rows, existingRows, duplicateGroups],
  );

  const hasVisibleInvalidEmails = useMemo(
    () =>
      activeStep === 1 &&
      rows.some(
        (r) => stepVisibleIds.has(r.id) && r.errors.email === "invalid",
      ),
    [activeStep, rows, stepVisibleIds],
  );
  const hasVisibleDuplicateEmails = useMemo(
    () =>
      activeStep === 2 &&
      rows.some(
        (r) => stepVisibleIds.has(r.id) && r.errors.email === "duplicate",
      ),
    [activeStep, rows, stepVisibleIds],
  );
  const hasIssues = useMemo(
    () =>
      stepIssues.count > 0 ||
      hasVisibleInvalidEmails ||
      hasVisibleDuplicateEmails,
    [stepIssues, hasVisibleInvalidEmails, hasVisibleDuplicateEmails],
  );
  const failMessage = useMemo(
    () => getFailMessage(activeStep, rows, stepVisibleIds, existingRows),
    [activeStep, rows, stepVisibleIds, existingRows],
  );

  const hasExistingDuplicates = useMemo(() => {
    if (!duplicateGroups) return false;
    for (const group of duplicateGroups.values()) {
      if (group.some((entry) => entry.isExisting)) return true;
    }
    return false;
  }, [duplicateGroups]);

  const canAdvance =
    activeStep === 0
      ? checkStatus === "fail" && !hasIssues
      : activeStep === 1 || activeStep === 2
        ? !hasIssues
        : false;

  return {
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
  };
};
