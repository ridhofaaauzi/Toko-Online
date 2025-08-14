import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Profile from "./pages/profile/Profile";
import Home from "./pages/Home";
import EditProfile from "./pages/profile/EditProfile";
import ProductList from "./pages/product/ProductList";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductManage from "./pages/dashboard/product_manage/ProductManage";
import CreateProduct from "./pages/dashboard/product_manage/CreateProduct";
import EditProduct from "./pages/dashboard/product_manage/EditProduct";
import ProtectedRoute from "./routes/ProtectedRoute";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/product" element={<ProductList />} />
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
    </Router>
  );
}

export default App;
