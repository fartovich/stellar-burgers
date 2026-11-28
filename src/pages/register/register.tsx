import { registerUser } from '@slices/user';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { selectUserState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { Location } from 'react-router-dom';

export const Register = (): React.JSX.Element => {
  const [userName, setUserName] = useState('');
  const dispatch = useDispatch();
  const location = useLocation();
  const locationState = location.state as { from?: Location } | null;
  const { registerError, isLoading } = useSelector(selectUserState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!isLoading) void dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      locationState={locationState}
      errorText={registerError ?? undefined}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
