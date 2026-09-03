import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import RegisterCoursePage from "./pages/RegisterCoursePage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Routes>
          {/* Trang mặc định */}
          <Route
            path="/"
            element={
              <Navigate
                to="/courses"
                replace
              />
            }
          />

          {/* Đăng nhập - công khai */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Danh sách môn học - công khai */}
          <Route
            path="/courses"
            element={<CoursesPage />}
          />

          {/* Chỉ ADMIN */}
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminCoursesPage />
              </ProtectedRoute>
            }
          />

          {/* Chỉ STUDENT */}
          <Route
            path="/register-course"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <RegisterCoursePage />
              </ProtectedRoute>
            }
          />

          {/* Danh sách môn học đã đăng ký - chỉ STUDENT */}
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <MyRegistrationsPage />
              </ProtectedRoute>
            }
          />

          {/* Quản lý API Key - chỉ ADMIN */}
          <Route
            path="/admin/api-keys"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ApiKeysPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;