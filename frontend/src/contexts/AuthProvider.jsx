import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import publicApi from "../api/publicApi";


export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);


  // Vérifie l'utilisateur courant au chargement du provider
  useEffect(() => {
    loadCurrentUser();
  }, []);


  async function loadCurrentUser() {
    try {
      const token = localStorage.getItem("authToken");


      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }


      const isValid = await publicApi.verifyToken(token);
      if (!isValid) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }


      const res = await publicApi.getCurrentUser(token);
      setUser(res.user);
      setRole(res.user.role);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth Error:", error);
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }


  async function logout() {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await publicApi.logout(token);
      }
    } catch (e) {
      // ignore errors
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        logout,
        refreshAuth: loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}