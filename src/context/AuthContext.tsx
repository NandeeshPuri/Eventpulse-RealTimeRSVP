import React, { createContext, useState, useEffect, useContext } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  role: "host" | "attendee";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: "host" | "attendee") => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isHost: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session in localStorage
    const storedUser = localStorage.getItem("eventpulse_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock API call - in a real app, this would be an actual API request
      await new Promise((resolve) => setTimeout(resolve, 800));

      // For demo purposes, we'll create a user if credentials look valid
      if (email && password) {
        const newUser: User = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          email,
          name: email.split('@')[0], // Use part of email as name
          role: email.includes('host') ? 'host' : 'attendee' // Simple logic for demo
        };

        localStorage.setItem("eventpulse_user", JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: "host" | "attendee") => {
    setLoading(true);
    try {
      // Mock API call - in a real app, this would be an actual API request
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (email && password && name) {
        const newUser: User = {
          id: `user-${Math.random().toString(36).substring(2, 9)}`,
          email,
          name,
          role
        };

        localStorage.setItem("eventpulse_user", JSON.stringify(newUser));
        setUser(newUser);
      } else {
        throw new Error("Invalid registration information");
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("eventpulse_user");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isHost = user?.role === "host";

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isHost
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};