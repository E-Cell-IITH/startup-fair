import { createContext, useEffect, useState } from "react";
import { AuthContextType, User } from "../types";
import axios from "axios";
import config from '../config.json'

interface AuthProviderProp {
  children: React.ReactNode
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProp) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.post(`${config.BACKEND_URL}/api/me`, {}, {
          withCredentials: true
        })

        setUser(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            console.warn("User not found!");
          } else {
            console.error("An error occurred while fetching user data", error);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}