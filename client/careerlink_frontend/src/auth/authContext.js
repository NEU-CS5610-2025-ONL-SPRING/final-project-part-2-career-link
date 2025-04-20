import { createContext, useState, useContext, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/token`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          setIsAuthenticated(true);
          const data = await res.json();
          setUser(data);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = async (email, password, navigate) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (res.ok) {
      const userData = await res.json();
      setIsAuthenticated(true);
      setUser(userData);
      if(userData.role.toLowerCase() === "employer")
        navigate("/employer/jobs");
      else
        navigate("/");
    } else {
      const errorData = await res.json(); 
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(errorData.error || "Login failed. Please try again.");
    }
  };

  const signup = async (user,navigate) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) {
      const userData = await res.json();
      setIsAuthenticated(true);
      setUser(userData);
      if(userData.role.toLowerCase() === "employer")
        navigate("/employer/jobs");
      else
        navigate("/");
    } else {
      const errorData = await res.json(); 
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(errorData.error || "Signup failed. Please try again.");
    }
  };

  const logout = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setIsAuthenticated(false);
    setUser(null);
  };

 // Role checking utilities
 const hasRole = (role) => user?.role === role;

 return (
   <AuthContext.Provider
     value={{
       isAuthenticated: isAuthenticated,
       loading,
       user: user,
       login,
       logout,
       signup,
       hasRole,
     }}
   >
     {children}
   </AuthContext.Provider>
 );
};

export const useAuthUser = () => useContext(AuthContext);
