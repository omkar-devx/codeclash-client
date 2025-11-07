import "./App.css";
import { Toaster } from "react-hot-toast";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./Routes/router";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <TanStackRouterDevtools router={router} position="bottom-left" />
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster
          toastOptions={{
            className: "text-sm font-medium rounded-lg shadow-lg",
            style: {
              border: "1px solid #334155",
              background: "#1e293b",
              color: "#f1f5f9",
              padding: "14px 18px",
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(30, 41, 59, 0.95)",
            },
            success: {
              className: "text-sm font-medium rounded-lg shadow-lg",
              style: {
                border: "1px solid #10b98180",
                background: "#1e293b",
                color: "#86efac",
                padding: "14px 18px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(30, 41, 59, 0.95)",
              },
              iconTheme: {
                primary: "#10b981",
                secondary: "#1e293b",
              },
            },
            error: {
              className: "text-sm font-medium rounded-lg shadow-lg",
              style: {
                border: "1px solid #ef444480",
                background: "#1e293b",
                color: "#fca5a5",
                padding: "14px 18px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(30, 41, 59, 0.95)",
              },
              iconTheme: {
                primary: "#ef4444",
                secondary: "#1e293b",
              },
            },
            loading: {
              className: "text-sm font-medium rounded-lg shadow-lg",
              style: {
                border: "1px solid #6366f180",
                background: "#1e293b",
                color: "#a5b4fc",
                padding: "14px 18px",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(30, 41, 59, 0.95)",
              },
              iconTheme: {
                primary: "#6366f1",
                secondary: "#1e293b",
              },
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
