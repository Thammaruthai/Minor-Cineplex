import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    user_id: null,
    name: "",
    email: "",
    profile_image: "",
  });

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get("/api/users/profile", config);
      setUserData(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    // Load user on initial app load
    fetchUserProfile();
  }, []);
  
  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
