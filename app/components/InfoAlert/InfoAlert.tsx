import { Alert } from "@mui/material";
import * as styles from "./InfoAlert.styles";

interface Props {
  text: string;
}

export const InfoAlert = ({ text }: Props) => (
  <Alert severity="info" sx={styles.root}>
    {text}
  </Alert>
);
