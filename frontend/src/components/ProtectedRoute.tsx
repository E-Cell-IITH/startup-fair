import { ReactNode, useContext } from "react"
import { AuthContext } from "../services/AuthProvider"
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, loading } = authContext;

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to='/' />
  }

  return <>{children}</>;
}

export default ProtectedRoute;
