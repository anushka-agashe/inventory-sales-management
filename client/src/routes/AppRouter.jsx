import { BrowserRouter as Router, Routes, Route ,Navigate  } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import SignUp from "../pages/auth/SignUp.jsx";
import ForgetPassword from "../pages/auth/ForgetPassword.jsx";
import Home from "../pages/Home.jsx";
import Invoices from "../pages/Invoices.jsx";
import Products from "../pages/Products.jsx";
import AddProductForm from "../components/Products/AddProductForm.jsx";
import Statistics from "../pages/Statistics.jsx";
import Settings from "../pages/Settings.jsx";
const AppRouter = () => {
  return (
    <div>
      <Router>
        <Routes>

<Route path="/" element={<Navigate to="/auth/login" />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route path="/auth/forgetpassword" element={<ForgetPassword />} />

          <Route path="/home" element={<Home />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProductForm />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />

          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default AppRouter;
