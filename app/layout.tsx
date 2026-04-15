import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import "./globals.css";
import { ReactNode } from "react";
import * as styles from "./styles";

export const metadata: Metadata = {
  title: "CSV Import | Lucas Johnson",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Container maxWidth="xl">
            <Box sx={styles.layoutRoot}>{children}</Box>
          </Container>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
