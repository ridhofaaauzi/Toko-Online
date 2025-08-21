import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth/auth-form/AuthForm";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/edit/EditProfile";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductManage from "./pages/dashboard/product_manage/ProductManage";
import CreateProduct from "./pages/dashboard/product_manage/create/CreateProduct";
import EditProduct from "./pages/dashboard/product_manage/edit/EditProduct";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./components/auth/forgot-password/ForgotPassword";
import ResetPassword from "./components/auth/reset-password/ResetPassword";
import NotFound from "./pages/notfound/NotFound";
import ChatPage from "./pages/chat/ChatPage";
import ChatWidget from "./components/chat/ChatWidget";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<AuthForm isLogin={true} />} />
        <Route path="/register" element={<AuthForm isLogin={false} />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <ProtectedRoute>
              <ProductManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/product/create"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/product/edit/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <ChatWidget />
    </Router>
  );
}

export default App;
