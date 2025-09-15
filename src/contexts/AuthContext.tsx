import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("khsrny-auth") === "true";
  });

  const signIn = (username: string, password: string) => {
    // This would normally verify credentials
    setIsAuthenticated(true);
    localStorage.setItem("khsrny-auth", "true");
    return true;
  };

  const signOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("khsrny-auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};