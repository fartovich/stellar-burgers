import type { Dispatch, SetStateAction, SyntheticEvent } from 'react';
import type { Location } from 'react-router-dom';

export type PageUIProps = {
  errorText: string | undefined;
  locationState?: { from?: Location } | null;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleSubmit: (e: SyntheticEvent) => void;
};
