
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { routers } from "./App";
import AuthcontextProvider from "./Context/AuthContext";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthcontextProvider>
      <RouterProvider router={routers} />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        theme="colored"
      />
    </AuthcontextProvider>
  </QueryClientProvider>
);
