import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import ForgotPasswordPage from "../pages/public/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/public/auth/ResetPasswordPage";
import ActivateAccountPage from "../pages/public/auth/ActivateAccountPage";
import Login from "../pages/public/auth/Login";
import SignUp from "../pages/public/auth/SignUp";


export default function PublicRoutes() {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/activate/:token" element={<ActivateAccountPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
    );
}