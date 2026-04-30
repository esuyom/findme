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
    // 게스트 전환 시 스크랩/위시 초기화
    const SCRAP_KEYS = [
      'findme_scrap_recruits',
      'findme_scrap_companies',
      'findme_scrap_coachings',
      'findme_scrap_trends',
      'findme_scrap_contests',
      'findme_wish_students',
      'findme_contest_inquiries',
    ];
    SCRAP_KEYS.forEach((key) => localStorage.removeItem(key));
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
