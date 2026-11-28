import { loginUser } from '@slices/user';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { selectUserState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const location = useLocation();
  const locationState = location.state as { from?: Location } | null;
  const { loginError, isLoading } = useSelector(selectUserState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!isLoading) void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      locationState={locationState}
      errorText={loginError ?? undefined}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
