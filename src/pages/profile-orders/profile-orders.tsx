import { fetchUserOrders } from '@slices/orders';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectOrders } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

const refreshInterval = 5000;

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { history, historyError, historyLoading } = useSelector(selectOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
    const timer = window.setInterval(() => {
      void dispatch(fetchUserOrders());
    }, refreshInterval);
    return (): void => window.clearInterval(timer);
  }, [dispatch]);

  return (
    <ProfileOrdersUI
      orders={history}
      isLoading={historyLoading && !history.length}
      errorText={historyError}
    />
  );
};
