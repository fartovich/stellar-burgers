import { Preloader } from '@ui';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { selectUserState } from '@services/selectors';
import { useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyGuest?: boolean;
};

export const ProtectedRoute = ({
  onlyGuest = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const { user, isChecked } = useSelector(selectUserState);
  const location = useLocation();

  if (!isChecked) return <Preloader />;

  if (!onlyGuest && !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (onlyGuest && user) {
    const from = (location.state as { from?: Location } | null)?.from;
    return <Navigate to={from ?? '/'} replace />;
  }

  return <Outlet />;
};
