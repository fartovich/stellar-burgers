import { fetchOrder } from '@slices/orders';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients, selectOrders } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const orderNumber = Number(number);
  const { feed, history, details, detailErrors } = useSelector(selectOrders);
  const orderData =
    history.find((item) => item.number === orderNumber) ??
    feed.orders.find((item) => item.number === orderNumber) ??
    details[orderNumber];
  const detailError = detailErrors[orderNumber];
  const ingredients = useSelector(selectIngredients);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!orderData && Number.isInteger(orderNumber))
      void dispatch(fetchOrder(orderNumber));
  }, [dispatch, orderNumber, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return detailError || !Number.isInteger(orderNumber) ? (
      <p className="text text_type_main-medium">{detailError ?? 'Заказ не найден'}</p>
    ) : (
      <Preloader />
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
