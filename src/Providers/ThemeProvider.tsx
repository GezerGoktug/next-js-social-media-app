"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { FC, ReactNode } from "react";

const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <NextThemeProvider attribute="class" enableSystem={true}>
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProvider;
