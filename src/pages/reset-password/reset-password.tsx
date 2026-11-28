import { resetPassword } from '@slices/user';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

import type { Location } from 'react-router-dom';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationState = location.state as { from?: Location } | null;
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    setError(null);
    void dispatch(resetPassword({ password, token }))
      .unwrap()
      .then(() => {
        localStorage.removeItem('resetPassword');
        void navigate('/login', { state: locationState });
      })
      .catch((err: Error) => setError(err));
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true, state: locationState });
    }
  }, [navigate, locationState]);

  return (
    <ResetPasswordUI
      locationState={locationState}
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
