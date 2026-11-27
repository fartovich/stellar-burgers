import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';
import { clsx } from 'clsx';
import { Link, NavLink, useLocation } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => {
  const { pathname } = useLocation();
  const constructorActive = pathname === '/' || pathname.startsWith('/ingredients/');
  const feedActive = pathname === '/feed' || pathname.startsWith('/feed/');
  const profileActive = pathname === '/profile' || pathname.startsWith('/profile/');
  const linkClass = (active: boolean): string =>
    clsx(styles.link, active && styles.link_active);
  return (
    <header className={styles.header}>
      <nav className={clsx(styles.menu, 'p-4')}>
        <div className={styles.menu_part_left}>
          <NavLink to="/" className={linkClass(constructorActive)} end>
            <BurgerIcon type={constructorActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
          </NavLink>
          <NavLink to="/feed" className={linkClass(feedActive)}>
            <ListIcon type={feedActive ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </NavLink>
        </div>
        <Link to="/" className={styles.logo}>
          <Logo className="" />
        </Link>
        <NavLink
          to="/profile"
          className={clsx(styles.link_position_last, linkClass(profileActive))}
        >
          <ProfileIcon type={profileActive ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </NavLink>
      </nav>
    </header>
  );
};
