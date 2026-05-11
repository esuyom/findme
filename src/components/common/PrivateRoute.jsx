import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * allowedRoles: ['student'] | ['company'] | ['student','company']
 * - 비로그인 → /member/login (state.from 포함)
 * - 잘못된 역할 → /
 */
export default function PrivateRoute({ allowedRoles }) {
  const { userType } = useAuth();
  const location = useLocation();

  if (!userType) {
    return <Navigate to="/member/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
