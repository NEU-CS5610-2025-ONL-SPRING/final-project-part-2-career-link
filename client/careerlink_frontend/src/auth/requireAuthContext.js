import { Navigate } from "react-router-dom";
import { useAuthUser } from "./authContext.js";
 
export const RequireAuth = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, user } = useAuthUser();
 
  if (loading) {
    return <p>... loading</p>;
  }
 
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
 
  if (roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
 
  return children;
};
 