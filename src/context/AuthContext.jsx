import { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../service/api";

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider(props) {
  const children = props.children;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(function () {
    function initAuth() {
      var storedToken = localStorage.getItem("token");
      if (storedToken) {
        authAPI
          .getCurrentUser()
          .then(function (response) {
            setUser(response.data);
          })
          .catch(function (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem("token");
            setToken(null);
          })
          .finally(function () {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  function login(credentials) {
    return authAPI
      .login(credentials)
      .then(function (response) {
        var accessToken = response.data.accessToken;
        var refreshToken = response.data.refreshToken;
        var userData = response.data;
        delete userData.accessToken;
        delete userData.refreshToken;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setToken(accessToken);
        setUser(userData);
        return { success: true };
      })
      .catch(function (error) {
        var message = "Login failed";
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message = error.response.data.message;
        }
        return { success: false, error: message };
      });
  }
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }
  function register(userData) {
    return { success: true, message: "Registration successful! Please login." };
  }
  var value = {
    user: user,
    token: token,
    loading: loading,
    login: login,
    logout: logout,
    register: register,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
