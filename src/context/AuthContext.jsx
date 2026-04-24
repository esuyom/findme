import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userType, setUserType] = useState(
    sessionStorage.getItem('testUserType') || null
  );

  const login = (type) => {
    sessionStorage.setItem('testUserType', type);
    setUserType(type);
  };

  const logout = () => {
    sessionStorage.removeItem('testUserType');
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
