import { createOrder, closeOrder, fetchFeed, fetchUserOrders } from '@slices/orders';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { selectConstructor, selectOrders, selectUser } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const constructorItems = useSelector(selectConstructor);
  const { orderRequest, orderModalData, orderError } = useSelector(selectOrders);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    const bunId = constructorItems.bun._id;
    void dispatch(
      createOrder([
        bunId,
        ...constructorItems.ingredients.map((item) => item._id),
        bunId,
      ])
    )
      .unwrap()
      .then(() => {
        void dispatch(fetchFeed());
        void dispatch(fetchUserOrders());
      })
      .catch(() => undefined);
  };

  const closeOrderModal = (): void => {
    if (!orderRequest) dispatch(closeOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      orderError={orderError}
    />
  );
};
