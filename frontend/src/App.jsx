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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm isLogin={true} />} />
        <Route path="/register" element={<AuthForm isLogin={false} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/product" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/products" element={<ProductManage />} />
        <Route path="/dashboard/product/create" element={<CreateProduct />} />
        <Route path="/dashboard/product/edit/:id" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
