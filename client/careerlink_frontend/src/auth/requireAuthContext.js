import { Navigate } from "react-router-dom";
import { useAuthUser } from "./authContext";

export const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuthUser();

  if (loading) {
    return <p>... loading</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
