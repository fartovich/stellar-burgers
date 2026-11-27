import { fetchFeed } from '@slices/orders';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { selectFeed } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

const refreshInterval = 5000;

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeed);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  useEffect(() => {
    void dispatch(fetchFeed());
    const timer = window.setInterval(() => {
      void dispatch(fetchFeed());
    }, refreshInterval);
    return (): void => window.clearInterval(timer);
  }, [dispatch]);

  if (isLoading && !orders.length) return <Preloader />;

  return (
    <>
      {error && !orders.length ? (
        <p className="text text_type_main-default">Не удалось загрузить заказы</p>
      ) : null}
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
