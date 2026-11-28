import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { fetchIngredients } from '@slices/ingredients';
import { checkUser } from '@slices/user';
import { Preloader } from '@ui';
import { clsx } from 'clsx';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';

import { selectIngredientsState, selectUserState } from '@services/selectors';
import { useDispatch, useSelector } from '@services/store';

import { ProtectedRoute } from './protected-route';

import type { AppContentProps } from './type';
import type { Location } from 'react-router-dom';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { items: ingredients, isLoading, error } = useSelector(selectIngredientsState);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent ingredients={ingredients} isLoading={isLoading} error={error} />
    </div>
  );
};

export default App;

/* Данные ингредиентов нужны конструктору и составу заказов, но не формам. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  const { pathname } = useLocation();
  const { user, isChecked } = useSelector(selectUserState);
  const needsIngredients =
    pathname === '/' ||
    /^\/ingredients\/[^/]+\/?$/.test(pathname) ||
    /^\/feed(?:\/[^/]+)?\/?$/.test(pathname) ||
    (isChecked && !!user && /^\/profile\/orders(?:\/[^/]+)?\/?$/.test(pathname));

  if (needsIngredients && isLoading) return <Preloader />;
  if (needsIngredients && error) {
    return (
      <p className={clsx(styles.message, 'text text_type_main-medium')}>
        Не удалось загрузить ингредиенты: {error.message}
      </p>
    );
  }
  if (needsIngredients && !ingredients.length) {
    return (
      <p className={clsx(styles.message, 'text text_type_main-medium')}>
        Нет ингредиентов
      </p>
    );
  }
  return <RouteComponent />;
};

const IngredientPage = (): React.JSX.Element => (
  <main className={styles.detailPageWrap}>
    <h1 className={clsx(styles.detailHeader, 'text text_type_main-large')}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </main>
);

const useOrderTitle = (): string => {
  const { number } = useParams();
  return `#${(number ?? '').padStart(6, '0')}`;
};

const OrderPage = (): React.JSX.Element => {
  const title = useOrderTitle();
  return (
    <main className={styles.detailPageWrap}>
      <h1 className={clsx(styles.detailHeader, 'text text_type_digits-default')}>
        {title}
      </h1>
      <OrderInfo />
    </main>
  );
};

const OrderModal = ({ onClose }: { onClose: () => void }): React.JSX.Element => {
  const title = useOrderTitle();
  return (
    <Modal title={title} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = (location.state as { background?: Location } | null)?.background;
  const closeModal = (): void => {
    void navigate(-1);
  };

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/ingredients/:id" element={<IngredientPage />} />
        <Route path="/feed/:number" element={<OrderPage />} />
        <Route element={<ProtectedRoute onlyGuest />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/orders" element={<ProfileOrders />} />
          <Route path="/profile/orders/:number" element={<OrderPage />} />
        </Route>
        <Route path="*" element={<NotFound404 />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path="/feed/:number" element={<OrderModal onClose={closeModal} />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile/orders/:number"
              element={<OrderModal onClose={closeModal} />}
            />
          </Route>
        </Routes>
      )}
    </>
  );
};
