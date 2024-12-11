import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  }); // Null indicates not logged in

  const fetchUser = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log(`Token:`, token);
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }
    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(`/api/payment/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token in the Authorization header
        },
      });
      console.log(`Response from PAYMENT`, response.data);
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null, 
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    console.log(`State:`, state);
    fetchUser(); // Load user on initial app load
  }, []);

  return (
    <AuthContext.Provider value={{ state, fetchUser }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
