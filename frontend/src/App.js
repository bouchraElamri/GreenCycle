import logo from './logo.svg';
import './App.css';
import Login from './pages/public/auth/Login';

import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<div>Register</div>} />
      <Route path="/forgot-password" element={<div>Forgot Password</div>} />
    </Routes>
  );
}
