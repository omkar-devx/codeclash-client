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
        {/* <TanStackRouterDevtools router={router} position="bottom-left" />
        <ReactQueryDevtools initialIsOpen={false} /> */}
        <Toaster
          toastOptions={{
            className: "text-sm font-medium rounded-md shadow-md",
            style: {
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#111827",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#D1FAE5",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fee2e2",
              },
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
