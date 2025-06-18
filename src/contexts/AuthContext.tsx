import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../lib/apiBase';

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  verified?: boolean;
  created_at?: string;
  next_billing_date?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        const mappedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.username,
          plan: data.user.plan,
          verified: data.user.verified,
          created_at: data.user.created_at,
          next_billing_date: data.user.next_billing_date,
        };
        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password }),
      });
      const data = await response.json();
      if (response.ok && data.user) {
        const mappedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.username,
          plan: data.user.plan,
          verified: data.user.verified,
          created_at: data.user.created_at,
          next_billing_date: data.user.next_billing_date,
        };
        setUser(mappedUser);
        localStorage.setItem('user', JSON.stringify(mappedUser));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/');
  };

  // Check for existing session on initial load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
