import React from "react";
import Script from "next/script";

const Index = () => (
  <>
    <Script
      type="module"
      id="client"
      src="http://localhost:5173/@vite/client"
    />
    <Script type="module" id="main" src="http://localhost:5173/src/main" />
    <Script
      type="module"
      dangerouslySetInnerHTML={{
        __html: `
              import RefreshRuntime from 'http://localhost:5173/@react-refresh';
              RefreshRuntime.injectIntoGlobalHook(window);
              window.$RefreshReg$ = () => {};
              window.$RefreshSig$ = () => (type) => type;
              window.__vite_plugin_react_preamble_installed__ = true;
              `,
      }}
      id="vite-refresh"
    />
  </>
);

export default Index;
