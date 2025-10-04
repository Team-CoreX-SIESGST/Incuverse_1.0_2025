"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/services/auth/authServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restore user/token immediately for smoother UI
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Error restoring auth state:", err);
      clearAuthData();
    }
    checkAuth();
  }, []);

  // Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user" || e.key === "token") {
        const token = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
          setUser(null);
          return;
        }

        try {
          setUser(JSON.parse(storedUser));
        } catch {
          clearAuthData();
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const clearAuthData = () => {
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");
    // localStorage.removeItem("refresh_token");
  };

  const setAuthData = (userData, token, refreshToken) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", userData);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    setUser(userData);
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        // clearAuthData();
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data?.user ?? data;

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } else {
          // clearAuthData();
          setUser(null);
        }
      } else {
        // clearAuthData();
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // clearAuthData();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      console.log(response,"fweoih")
      if (response) {
        // Assuming response structure matches your login page
        const userData = response.data;
        const token = response.data.accessToken || response.data.accessToken;
        const refreshToken = response.data.refresh_token;

        if (!token) {
          return { success: false, error: "No token received" };
        }

        setAuthData(userData, token, refreshToken);
        return { success: true };
      } else {
        return { success: false, error: response?.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message || error?.message || "Login failed",
      };
    }
  };

  const googleLogin = async (googleToken) => {
    try {
      const response = await loginUser({ googleToken });

      if (response.data) {
        const userData = response.data;
        const token = response.data.accessToken || response.data.accessToken;
        const refreshToken = response.data.refresh_token;

        if (!token) {
          return { success: false, error: "No token received" };
        }

        setAuthData(userData, token, refreshToken);
        return { success: true };
      } else {
        return {
          success: false,
          error: response?.message || "Google login failed",
        };
      }
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Google login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerUser(userData);

      if (response.data) {
        // Auto-login after registration if the API returns auth data
        const authData = response.data;
        const token = authData.accessToken || authData.accessToken;
        const refreshToken = authData.refresh_token;

        if (token) {
          setAuthData(authData, token, refreshToken);
        }

        return { success: true, data: response.data };
      } else {
        return {
          success: false,
          error: response?.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Registration failed",
      };
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
    router.push("/login");
  };

  const sendOTP = async (email) => {
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return response.ok
        ? { success: true, message: data.message }
        : { success: false, error: data.message };
    } catch (error) {
      console.error("Send OTP error:", error);
      return { success: false, error: "Failed to send OTP" };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      return response.ok
        ? { success: true, message: data.message }
        : { success: false, error: data.message };
    } catch (error) {
      console.error("Verify OTP error:", error);
      return { success: false, error: "OTP verification failed" };
    }
  };

  const value = {
    user,
    loading,
    login,
    googleLogin,
    register,
    logout,
    sendOTP,
    verifyOTP,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
