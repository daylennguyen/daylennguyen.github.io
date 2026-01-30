"use client";

import { useEffect } from "react";
import { createGlobalStyle, ThemeProvider, StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";
import { styleReset } from "react95";
import original from "react95/dist/themes/original";
// @ts-expect-error - woff2 asset import
import msSansSerif from "react95/dist/fonts/ms_sans_serif.woff2";
// @ts-expect-error - woff2 asset import
import msSansSerifBold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

function shouldForwardProp(propName: string, target: unknown) {
  if (typeof target === "string") {
    return isPropValid(propName);
  }
  return true;
}

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  html, body {
    height: 100%;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${msSansSerif}') format('woff2');
    font-weight: 400;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${msSansSerifBold}') format('woff2');
    font-weight: bold;
  }
  body {
    font-family: 'ms_sans_serif', "MS Sans Serif", sans-serif !important;
  }
  code {
    font-family: 'ms_sans_serif', "Courier New", monospace !important;
  }
`;

export default function React95Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("styles-ready");
  }, []);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ThemeProvider theme={original}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyleSheetManager>
  );
}
