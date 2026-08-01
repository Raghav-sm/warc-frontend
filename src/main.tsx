import { NuqsAdapter } from "nuqs/adapters/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "@/components/AuthProvider";
import Routes from "@/routes";

import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element with id "root" not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <NuqsAdapter>
        <Routes />
      </NuqsAdapter>
    </AuthProvider>
  </StrictMode>,
);
