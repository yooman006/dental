import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeMockData } from '../utils/mockData';

const mockUsers = [
  { 
    id: "1", 
    role: "Admin", 
    email: "admin@entnt.in", 
    password: "admin123", 
    name: "Dr. Smith",
  },
  { 
    id: "2", 
    role: "Patient", 
    email: "john@entnt.in", 
    password: "patient123", 
    patientId: "p1", 
    name: "John Doe",

  },
 
];


const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  
  useEffect(() => {
    initializeAuth();
  }, []);

  
  useEffect(() => {
    if (sessionExpiry) {
      const timeUntilExpiry = sessionExpiry - Date.now();
      if (timeUntilExpiry <= 0) {
        logout();
        return;
      }

      const timer = setTimeout(() => {
        logout();
        alert('Your session has expired. Please log in again.');
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    }
  }, [sessionExpiry]);

 const initializeAuth = () => {
  try {
    // Clear any existing mock data if needed
    localStorage.removeItem('dental_mock_data');
    
    // Initialize fresh mock data
    initializeMockData();
    
    // Check for existing session
    const savedUser = localStorage.getItem('dental_user');
    const savedExpiry = localStorage.getItem('dental_session_expiry');
    
    if (savedUser && savedExpiry) {
      const expiryTime = parseInt(savedExpiry);
      
      if (Date.now() < expiryTime) {
        setUser(JSON.parse(savedUser));
        setSessionExpiry(expiryTime);
      } else {
        // Clear expired session
        localStorage.removeItem('dental_user');
        localStorage.removeItem('dental_session_expiry');
      }
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
    // Clear any corrupted data
    localStorage.removeItem('dental_user');
    localStorage.removeItem('dental_session_expiry');
  } finally {
    setIsLoading(false);
  }
};
  const login = async (email, password, rememberMe = false) => {
    return new Promise((resolve) => {
      
      setTimeout(() => {
        const foundUser = mockUsers.find(u => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
        );
        
        if (foundUser) {
          const userSession = {
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role,
            name: foundUser.name,
            avatar: foundUser.avatar,
            patientId: foundUser.patientId || null,
            loginTime: Date.now()
          };

          // Set session expiry
          const expiryTime = Date.now() + (rememberMe ? 24 * 60 * 60 * 1000 : 8 * 60 * 60 * 1000);
          
          setUser(userSession);
          setSessionExpiry(expiryTime);
          
          localStorage.setItem('dental_user', JSON.stringify(userSession));
          localStorage.setItem('dental_session_expiry', expiryTime.toString());
          
          resolve({ 
            success: true, 
            user: userSession,
            message: `Welcome back, ${foundUser.name}!`
          });
        } else {
          resolve({ 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.'
          });
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setSessionExpiry(null);
    localStorage.removeItem('dental_user');
    localStorage.removeItem('dental_session_expiry');
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('dental_user', JSON.stringify(updatedUser));
    }
  };

  const isAdmin = () => user?.role === 'Admin';
  const isPatient = () => user?.role === 'Patient';

  const getSessionTimeRemaining = () => {
    if (!sessionExpiry) return null;
    const remaining = sessionExpiry - Date.now();
    return remaining > 0 ? remaining : 0;
  };

  const value = {
   
    user,
    isLoading,
    isAuthenticated: !!user,
    sessionExpiry,
    
    
    login,
    logout,
    updateUser,
    
    
    isAdmin,
    isPatient,
    getSessionTimeRemaining,
    
    
    mockUsers: mockUsers.map(u => ({ ...u, password: undefined })) 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;