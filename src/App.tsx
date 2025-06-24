import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import StudentView from "./pages/StudentView";
import TeacherView from "./pages/TeacherView";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentDetail from "./pages/StudentDetail";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute requiredUserType="student">
        <StudentView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher",
    element: (
      <ProtectedRoute requiredUserType="teacher">
        <TeacherView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/teacher/students/:studentId",
    element: (
      <ProtectedRoute requiredUserType="teacher">
        <StudentDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
